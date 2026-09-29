import type { Feature, MultiPolygon } from 'geojson';
import { describe, expect, it } from 'vitest';
import cambodia from './cambodia.json';
import { outsideMask } from './outsideMask';

describe('outsideMask', () => {
  it('covers the world with one hole per part of the country', () => {
    const square = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 0],
    ];
    const island = [
      [2, 2],
      [3, 2],
      [3, 3],
      [2, 2],
    ];
    const country: Feature<MultiPolygon> = {
      type: 'Feature',
      properties: {},
      geometry: { type: 'MultiPolygon', coordinates: [[square], [island]] },
    };
    const rings = outsideMask(country).geometry.coordinates;
    expect(rings).toHaveLength(3);
    expect(rings[0]).toContainEqual([180, 85]);
    expect(rings.slice(1)).toEqual([square, island]);
  });

  it('uses a boundary that lies inside the map bounds', () => {
    const coords = (cambodia as Feature<MultiPolygon>).geometry.coordinates.flat(2);
    for (const [lon, lat] of coords) {
      expect(lon).toBeGreaterThan(100.5);
      expect(lon).toBeLessThan(109.5);
      expect(lat).toBeGreaterThan(8.5);
      expect(lat).toBeLessThan(15.5);
    }
  });
});
