import type { ExpressionSpecification, FilterSpecification, LayerSpecification } from 'maplibre-gl';

/**
 * OpenMapTiles `poi` classes we already draw from our own data (layers/categories.ts).
 * The base map's icons for them would sit next to ours and look like a second, different marker.
 */
export const DUPLICATE_POI_CLASSES = [
  'place_of_worship',
  'castle',
  'monument',
  'ruins',
  'museum',
  'art_gallery',
  'attraction',
  'zoo',
  'aquarium',
  'lodging',
  'bus',
  'rail',
  'railway',
  'ferry_terminal',
  'airport',
];

/** Base map layers that only show places we already show: hidden completely. */
const DUPLICATE_LAYER_SOURCES = ['aerodrome_label'];

export interface PoiChanges {
  /** Layers to hide. */
  hide: string[];
  /** New filters for base map POI layers, leaving out our classes. */
  filters: Record<string, FilterSpecification>;
}

const isExpression = (filter: unknown): boolean =>
  Array.isArray(filter) && (filter[0] !== '==' || Array.isArray(filter[1]));

export function basemapPoiChanges(layers: LayerSpecification[]): PoiChanges {
  const changes: PoiChanges = { hide: [], filters: {} };
  const notOurs: ExpressionSpecification = [
    'match',
    ['get', 'class'],
    DUPLICATE_POI_CLASSES,
    false,
    true,
  ];
  for (const layer of layers) {
    if (layer.type !== 'symbol') continue;
    const sourceLayer = layer['source-layer'];
    if (sourceLayer && DUPLICATE_LAYER_SOURCES.includes(sourceLayer)) {
      changes.hide.push(layer.id);
    } else if (sourceLayer === 'poi') {
      // Old-style filters can't be combined with expressions; hide such a layer instead.
      if (layer.filter && !isExpression(layer.filter)) changes.hide.push(layer.id);
      else
        changes.filters[layer.id] = (
          layer.filter ? ['all', layer.filter, notOurs] : notOurs
        ) as FilterSpecification;
    }
  }
  return changes;
}
