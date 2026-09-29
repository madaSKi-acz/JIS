import type { Feature, MultiPolygon, Polygon } from 'geojson';
import type { Map as MapLibreMap } from 'maplibre-gl';
import cambodia from './cambodia.json';

const MASK_SOURCE = 'outside-cambodia';

/** Web Mercator stops near ±85°, so the world ring does too. */
const WORLD_RING = [
  [-180, -85],
  [180, -85],
  [180, 85],
  [-180, 85],
  [-180, -85],
];

/** The whole world with a hole for each part of the country (mainland and islands). */
export function outsideMask(country: Feature<MultiPolygon>): Feature<Polygon> {
  const holes = country.geometry.coordinates.map((polygon) => polygon[0]);
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates: [WORLD_RING, ...holes] },
  };
}

/**
 * Fades the base map outside Cambodia so Thai and Vietnamese labels don't compete with ours.
 * Call it once the base style has loaded, before our data layers are added, so it sits below them.
 */
export function addOutsideMask(map: MapLibreMap) {
  map.addSource(MASK_SOURCE, {
    type: 'geojson',
    data: outsideMask(cambodia as Feature<MultiPolygon>),
  });
  map.addLayer({
    id: MASK_SOURCE,
    type: 'fill',
    source: MASK_SOURCE,
    paint: { 'fill-color': '#ffffff', 'fill-opacity': 0.6 },
  });
}
