import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { GroupId } from './categories';

export interface PlaceProperties {
  id: string;
  category: string;
  name?: string;
  name_km?: string;
  name_en?: string;
  opening_hours?: string;
  website?: string;
  phone?: string;
  operator?: string;
  ref?: string;
  from?: string;
  to?: string;
}

export type PlaceFeature = Feature<Geometry, PlaceProperties>;
export type PlaceCollection = FeatureCollection<Geometry, PlaceProperties>;
export type LayerData = Record<GroupId, PlaceCollection>;

export class DataNotFoundError extends Error {}

export async function loadLayerData(
  dataUrl: string,
  fetchImpl: typeof fetch = fetch,
): Promise<LayerData> {
  const load = async (name: string): Promise<PlaceCollection> => {
    const res = await fetchImpl(`${dataUrl}/${name}.geojson`);
    // Vite's dev server answers missing files with index.html, so check the type too.
    if (!res.ok || !(res.headers.get('content-type') ?? '').match(/json/)) {
      throw new DataNotFoundError(`${name}.geojson not found at ${dataUrl}`);
    }
    return (await res.json()) as PlaceCollection;
  };
  const [tourism, transport] = await Promise.all([load('tourism'), load('transport')]);
  return { tourism, transport };
}

export function collection(features: PlaceFeature[]): PlaceCollection {
  return { type: 'FeatureCollection', features };
}

export function splitByGeometry(fc: PlaceCollection): {
  points: PlaceFeature[];
  lines: PlaceFeature[];
} {
  const points: PlaceFeature[] = [];
  const lines: PlaceFeature[] = [];
  for (const f of fc.features) (f.geometry.type === 'Point' ? points : lines).push(f);
  return { points, lines };
}

export function filterByCategory(
  features: PlaceFeature[],
  enabled: ReadonlySet<string>,
): PlaceFeature[] {
  return features.filter((f) => enabled.has(f.properties.category));
}

export function countByCategory(data: LayerData): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const fc of Object.values(data)) {
    for (const f of fc.features)
      counts[f.properties.category] = (counts[f.properties.category] ?? 0) + 1;
  }
  return counts;
}
