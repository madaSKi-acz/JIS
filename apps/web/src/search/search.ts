import type { Geometry } from 'geojson';
import type { LayerData, PlaceFeature } from '../layers/data';

export const MAX_RESULTS = 10;

export interface SearchEntry {
  feature: PlaceFeature;
  /** Where to fly to and open the popup. */
  coordinates: [number, number];
  /** Normalized names to match against. */
  keys: string[];
}

export interface SearchResult {
  entry: SearchEntry;
  score: number;
}

/** Case- and spacing-insensitive form. Marks are kept: Khmer vowel signs are combining marks. */
export function normalize(text: string): string {
  return text.normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** A point for any geometry: the point itself, otherwise the middle of its bounding box. */
export function anchor(geometry: Geometry): [number, number] | undefined {
  if (geometry.type === 'Point') return geometry.coordinates as [number, number];
  const coords: number[][] = [];
  const collect = (g: Geometry) => {
    switch (g.type) {
      case 'Point':
        coords.push(g.coordinates);
        break;
      case 'MultiPoint':
      case 'LineString':
        coords.push(...g.coordinates);
        break;
      case 'MultiLineString':
      case 'Polygon':
        for (const part of g.coordinates) coords.push(...part);
        break;
      case 'MultiPolygon':
        for (const poly of g.coordinates) for (const ring of poly) coords.push(...ring);
        break;
      case 'GeometryCollection':
        g.geometries.forEach(collect);
        break;
    }
  };
  collect(geometry);
  if (coords.length === 0) return undefined;
  const lons = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  return [(Math.min(...lons) + Math.max(...lons)) / 2, (Math.min(...lats) + Math.max(...lats)) / 2];
}

/** Named places, ready to search. Bus lines are left out: the bus lines panel lists them. */
export function buildIndex(data: LayerData): SearchEntry[] {
  const entries: SearchEntry[] = [];
  for (const fc of Object.values(data)) {
    for (const feature of fc.features) {
      const p = feature.properties;
      if (p.category === 'bus_route') continue;
      const names = [p.name, p.name_km, p.name_en].filter((n): n is string => !!n?.trim());
      const coordinates = anchor(feature.geometry);
      if (names.length === 0 || !coordinates) continue;
      entries.push({ feature, coordinates, keys: [...new Set(names.map(normalize))] });
    }
  }
  return entries;
}

/** Lower is better; undefined means no match. */
function scoreKey(key: string, query: string): number | undefined {
  if (key === query) return 0;
  if (key.startsWith(query)) return 1;
  if (key.includes(` ${query}`)) return 2;
  if (key.includes(query)) return 3;
  return undefined;
}

export function searchPlaces(
  index: SearchEntry[],
  query: string,
  limit = MAX_RESULTS,
): SearchResult[] {
  const q = normalize(query);
  if (!q) return [];
  const results: SearchResult[] = [];
  for (const entry of index) {
    let best: number | undefined;
    for (const key of entry.keys) {
      const score = scoreKey(key, q);
      if (score !== undefined && (best === undefined || score < best)) best = score;
    }
    if (best !== undefined) results.push({ entry, score: best });
  }
  const shortest = (e: SearchEntry) => Math.min(...e.keys.map((k) => k.length));
  results.sort((a, b) => a.score - b.score || shortest(a.entry) - shortest(b.entry));
  return results.slice(0, limit);
}
