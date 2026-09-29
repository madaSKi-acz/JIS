import type { GeoJSONSource, Map as MapLibreMap } from 'maplibre-gl';
import { collection, type PlaceFeature } from '../layers/data';
import type { LabelLanguage } from '../map/labels';

const ROUTE_SOURCE = 'jis-selected-route';
const STOPS_SOURCE = 'jis-selected-stops';
const COLOR = '#1d4ed8';

/** Draws one selected route and its numbered stops above all other data layers. */
export class RouteHighlight {
  constructor(
    private readonly map: MapLibreMap,
    lang: LabelLanguage,
  ) {
    map.addSource(ROUTE_SOURCE, { type: 'geojson', data: collection([]) });
    map.addSource(STOPS_SOURCE, { type: 'geojson', data: collection([]) });
    map.addLayer({
      id: `${ROUTE_SOURCE}-casing`,
      type: 'line',
      source: ROUTE_SOURCE,
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': '#ffffff',
        'line-width': ['interpolate', ['linear'], ['zoom'], 10, 7, 16, 12],
      },
    });
    map.addLayer({
      id: ROUTE_SOURCE,
      type: 'line',
      source: ROUTE_SOURCE,
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': COLOR,
        'line-width': ['interpolate', ['linear'], ['zoom'], 10, 4, 16, 7],
      },
    });
    map.addLayer({
      id: STOPS_SOURCE,
      type: 'circle',
      source: STOPS_SOURCE,
      paint: {
        'circle-color': '#ffffff',
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 6, 16, 10],
        'circle-stroke-color': COLOR,
        'circle-stroke-width': 2.5,
      },
    });
    map.addLayer({
      id: `${STOPS_SOURCE}-order`,
      type: 'symbol',
      source: STOPS_SOURCE,
      minzoom: 12,
      layout: {
        'text-field': ['to-string', ['get', 'order']],
        'text-font': ['Noto Sans Bold'],
        'text-size': 10,
        'text-allow-overlap': true,
      },
      paint: { 'text-color': COLOR },
    });
    map.addLayer({
      id: `${STOPS_SOURCE}-names`,
      type: 'symbol',
      source: STOPS_SOURCE,
      minzoom: 13,
      layout: {
        'text-field': ['coalesce', ['get', lang === 'km' ? 'name_km' : 'name_en'], ['get', 'name']],
        'text-font': ['Noto Sans Regular'],
        'text-size': 12,
        'text-anchor': 'left',
        'text-offset': [1.2, 0],
        'text-optional': true,
      },
      paint: { 'text-color': '#1f2937', 'text-halo-color': '#ffffff', 'text-halo-width': 1.5 },
    });
  }

  show(route: PlaceFeature): void {
    this.source(ROUTE_SOURCE).setData(collection([route]));
    this.source(STOPS_SOURCE).setData(
      collection(
        (route.properties.stops ?? []).map((stop, i) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: stop.coordinates },
          properties: { id: stop.id, category: 'bus_stop', order: String(i + 1), ...names(stop) },
        })),
      ),
    );
  }

  clear(): void {
    this.source(ROUTE_SOURCE).setData(collection([]));
    this.source(STOPS_SOURCE).setData(collection([]));
  }

  private source(id: string): GeoJSONSource {
    return this.map.getSource(id) as GeoJSONSource;
  }
}

function names(stop: { name?: string; name_km?: string; name_en?: string }) {
  return { name: stop.name, name_km: stop.name_km, name_en: stop.name_en };
}
