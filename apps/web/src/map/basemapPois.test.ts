import type { LayerSpecification } from 'maplibre-gl';
import { describe, expect, it } from 'vitest';
import { basemapPoiChanges } from './basemapPois';

const layer = (id: string, sourceLayer: string, filter?: unknown) =>
  ({
    id,
    type: 'symbol',
    source: 'openmaptiles',
    'source-layer': sourceLayer,
    ...(filter ? { filter } : {}),
  }) as LayerSpecification;

describe('basemapPoiChanges', () => {
  it('keeps other base map POIs but leaves out the classes we draw ourselves', () => {
    const rank: unknown = ['>=', ['get', 'rank'], 20];
    const { filters, hide } = basemapPoiChanges([layer('poi_r20', 'poi', rank)]);
    expect(hide).toEqual([]);
    const [all, kept, notOurs] = filters.poi_r20 as unknown[];
    expect(all).toBe('all');
    expect(kept).toEqual(rank);
    expect(JSON.stringify(notOurs)).toContain('place_of_worship');
    expect(JSON.stringify(notOurs)).toContain('lodging');
  });

  it('filters a POI layer that has no filter yet', () => {
    expect((basemapPoiChanges([layer('poi', 'poi')]).filters.poi as unknown[])[0]).toBe('match');
  });

  it('hides airport labels and POI layers with old-style filters', () => {
    const { hide, filters } = basemapPoiChanges([
      layer('airport', 'aerodrome_label', ['has', 'iata']),
      layer('poi_old', 'poi', ['==', 'class', 'shop']),
      layer('roads', 'transportation_name'),
    ]);
    expect(hide).toEqual(['airport', 'poi_old']);
    expect(filters).toEqual({});
  });
});
