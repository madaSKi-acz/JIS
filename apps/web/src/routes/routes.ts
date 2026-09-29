import type { LngLatBoundsLike } from 'maplibre-gl';
import type { LayerData, PlaceFeature, PlaceProperties } from '../layers/data';
import type { LabelLanguage } from '../map/labels';
import { displayName } from '../ui/popup';

/** Numeric refs in number order (2 before 10), then everything else alphabetically. */
export function compareRoutes(a: PlaceProperties, b: PlaceProperties): number {
  const na = Number.parseFloat(a.ref ?? '');
  const nb = Number.parseFloat(b.ref ?? '');
  if (!Number.isNaN(na) && !Number.isNaN(nb) && na !== nb) return na - nb;
  if (Number.isNaN(na) !== Number.isNaN(nb)) return Number.isNaN(na) ? 1 : -1;
  return (a.ref ?? '').localeCompare(b.ref ?? '') || (a.name ?? '').localeCompare(b.name ?? '');
}

export function busRoutes(data: LayerData): PlaceFeature[] {
  return data.transport.features
    .filter((f) => f.properties.category === 'bus_route')
    .sort((a, b) => compareRoutes(a.properties, b.properties));
}

export function routeTitle(p: PlaceProperties, lang: LabelLanguage): string {
  return displayName(p, lang) ?? p.ref ?? '';
}

export function routeSubtitle(p: PlaceProperties): string | undefined {
  return p.from && p.to ? `${p.from} → ${p.to}` : undefined;
}

export function matchesQuery(p: PlaceProperties, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [p.ref, p.name, p.name_km, p.name_en, p.from, p.to].some((v) =>
    v?.toLowerCase().includes(q),
  );
}

export function routeBounds(route: PlaceFeature): LngLatBoundsLike | undefined {
  const coords: number[][] = [];
  const g = route.geometry;
  if (g.type === 'MultiLineString') for (const line of g.coordinates) coords.push(...line);
  if (g.type === 'LineString') coords.push(...g.coordinates);
  for (const stop of route.properties.stops ?? []) coords.push(stop.coordinates);
  if (coords.length === 0) return undefined;
  const lons = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  return [
    [Math.min(...lons), Math.min(...lats)],
    [Math.max(...lons), Math.max(...lats)],
  ];
}
