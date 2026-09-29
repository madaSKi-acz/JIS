import {
  Popup,
  type DataDrivenPropertyValueSpecification,
  type ExpressionSpecification,
  type GeoJSONSource,
  type Map as MapLibreMap,
  type MapMouseEvent,
} from 'maplibre-gl';
import type { LabelLanguage } from '../map/labels';
import { popupHtml } from '../ui/popup';
import { CATEGORIES, FALLBACK_COLOR, GROUPS, type GroupId } from './categories';
import {
  collection,
  filterByCategory,
  splitByGeometry,
  type LayerData,
  type PlaceFeature,
  type PlaceProperties,
} from './data';

const CLUSTER_COLOR: Record<GroupId, string> = { tourism: '#ea580c', transport: '#2563eb' };

// The spec types can't express a match expression built from a list, hence the cast.
export const categoryColor = [
  'match',
  ['get', 'category'],
  ...CATEGORIES.flatMap((c) => [c.id, c.color]),
  FALLBACK_COLOR,
] as unknown as DataDrivenPropertyValueSpecification<string>;

const pointsSource = (g: GroupId) => `jis-${g}-points`;
const linesSource = (g: GroupId) => `jis-${g}-lines`;
const clusterLayer = (g: GroupId) => `jis-${g}-clusters`;
const pointLayer = (g: GroupId) => `jis-${g}-points`;
const lineLayer = (g: GroupId) => `jis-${g}-lines`;

export interface DataLayers {
  setEnabledCategories(enabled: ReadonlySet<string>): void;
  /** Fades all data layers, e.g. while one bus route is highlighted on top. */
  setDimmed(dimmed: boolean): void;
}

export interface DataLayerOptions {
  /** Called instead of opening a popup when a bus route line is clicked. */
  onRouteClick?: (routeId: string) => void;
}

/** Route lines stay light at city zoom, where dozens of routes share the same roads. */
const LINE_OPACITY: ExpressionSpecification = [
  'interpolate',
  ['linear'],
  ['zoom'],
  10,
  0.35,
  15,
  0.85,
];

/** [layer, paint property, normal value, dimmed value] */
type DimRule = [
  string,
  'circle-opacity' | 'line-opacity' | 'text-opacity',
  number | ExpressionSpecification,
  number,
];

function dimRules(g: GroupId): DimRule[] {
  return [
    [lineLayer(g), 'line-opacity', LINE_OPACITY, 0.12],
    [clusterLayer(g), 'circle-opacity', 0.85, 0.2],
    [`${clusterLayer(g)}-count`, 'text-opacity', 1, 0.2],
    [pointLayer(g), 'circle-opacity', 1, 0.2],
    [`${pointLayer(g)}-labels`, 'text-opacity', 1, 0.2],
  ];
}

export function addDataLayers(
  map: MapLibreMap,
  data: LayerData,
  lang: LabelLanguage,
  options: DataLayerOptions = {},
): DataLayers {
  const split = Object.fromEntries(
    GROUPS.map((g) => [g.id, splitByGeometry(data[g.id])]),
  ) as Record<GroupId, { points: PlaceFeature[]; lines: PlaceFeature[] }>;

  // Lines first so every group's markers draw above every group's lines.
  for (const { id: g } of GROUPS) {
    map.addSource(linesSource(g), { type: 'geojson', data: collection(split[g].lines) });
    map.addLayer({
      id: lineLayer(g),
      type: 'line',
      source: linesSource(g),
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': categoryColor,
        'line-width': ['interpolate', ['linear'], ['zoom'], 6, 1, 12, 2, 16, 4],
        'line-opacity': LINE_OPACITY,
      },
    });
  }

  for (const { id: g } of GROUPS) {
    map.addSource(pointsSource(g), {
      type: 'geojson',
      data: collection(split[g].points),
      cluster: true,
      clusterRadius: 45,
      clusterMaxZoom: 13,
    });
    map.addLayer({
      id: clusterLayer(g),
      type: 'circle',
      source: pointsSource(g),
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': CLUSTER_COLOR[g],
        'circle-opacity': 0.85,
        'circle-radius': ['step', ['get', 'point_count'], 14, 50, 18, 250, 24, 1000, 30],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
      },
    });
    map.addLayer({
      id: `${clusterLayer(g)}-count`,
      type: 'symbol',
      source: pointsSource(g),
      filter: ['has', 'point_count'],
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-font': ['Noto Sans Bold'],
        'text-size': 12,
        'text-allow-overlap': true,
      },
      paint: { 'text-color': '#ffffff' },
    });
    map.addLayer({
      id: pointLayer(g),
      type: 'circle',
      source: pointsSource(g),
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': categoryColor,
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 4, 16, 8],
        'circle-stroke-width': 1.5,
        'circle-stroke-color': '#ffffff',
      },
    });
    map.addLayer({
      id: `${pointLayer(g)}-labels`,
      type: 'symbol',
      source: pointsSource(g),
      minzoom: 14,
      filter: ['!', ['has', 'point_count']],
      layout: {
        'text-field': ['coalesce', ['get', lang === 'km' ? 'name_km' : 'name_en'], ['get', 'name']],
        'text-font': ['Noto Sans Regular'],
        'text-size': 12,
        'text-offset': [0, 1.1],
        'text-anchor': 'top',
        'text-optional': true,
      },
      paint: { 'text-color': '#1f2937', 'text-halo-color': '#ffffff', 'text-halo-width': 1.5 },
    });
  }

  addInteractions(map, lang, options);

  return {
    setEnabledCategories(enabled) {
      for (const { id: g } of GROUPS) {
        (map.getSource(pointsSource(g)) as GeoJSONSource).setData(
          collection(filterByCategory(split[g].points, enabled)),
        );
        (map.getSource(linesSource(g)) as GeoJSONSource).setData(
          collection(filterByCategory(split[g].lines, enabled)),
        );
      }
    },
    setDimmed(dimmed) {
      for (const { id: g } of GROUPS) {
        for (const [layer, property, normal, dim] of dimRules(g)) {
          map.setPaintProperty(layer, property, dimmed ? dim : normal);
        }
      }
    },
  };
}

function addInteractions(map: MapLibreMap, lang: LabelLanguage, options: DataLayerOptions) {
  const popup = new Popup({ maxWidth: '300px', closeButton: true });
  // Checked in this order, so a marker wins over a route drawn underneath it.
  const clusters = GROUPS.map((g) => clusterLayer(g.id));
  const points = GROUPS.map((g) => pointLayer(g.id));
  const lines = GROUPS.map((g) => lineLayer(g.id));
  const clickable = [...clusters, ...points, ...lines];

  map.on('click', async (e: MapMouseEvent) => {
    const hits = map.queryRenderedFeatures(e.point, { layers: clickable });
    const hit = clickable.map((id) => hits.find((f) => f.layer.id === id)).find(Boolean);
    if (!hit) return;

    if (clusters.includes(hit.layer.id) && hit.geometry.type === 'Point') {
      const source = map.getSource(hit.source) as GeoJSONSource;
      const zoom = await source.getClusterExpansionZoom(hit.properties.cluster_id as number);
      map.easeTo({ center: hit.geometry.coordinates as [number, number], zoom });
      return;
    }

    const props = hit.properties as PlaceProperties;
    if (options.onRouteClick && props.category === 'bus_route') {
      popup.remove();
      options.onRouteClick(props.id);
      return;
    }

    const at =
      hit.geometry.type === 'Point' ? (hit.geometry.coordinates as [number, number]) : e.lngLat;
    popup.setLngLat(at).setHTML(popupHtml(props, lang)).addTo(map);
  });

  for (const layer of clickable) {
    map.on('mouseenter', layer, () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', layer, () => (map.getCanvas().style.cursor = ''));
  }
}
