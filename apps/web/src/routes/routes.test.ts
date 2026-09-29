import { describe, expect, it } from 'vitest';
import { collection, type PlaceFeature, type PlaceProperties } from '../layers/data';
import {
  busRoutes,
  compareRoutes,
  matchesQuery,
  routeBounds,
  routeSubtitle,
  routeTitle,
} from './routes';

const route = (
  props: Partial<PlaceProperties>,
  coords: number[][] = [
    [104, 11],
    [105, 12],
  ],
): PlaceFeature => ({
  type: 'Feature',
  geometry: { type: 'MultiLineString', coordinates: [coords] },
  properties: { id: `relation/${props.ref ?? 0}`, category: 'bus_route', ...props },
});

describe('compareRoutes', () => {
  it('sorts numeric refs by number, then other refs alphabetically', () => {
    const refs = ['10', 'B', '2', 'A', '1'].map((ref) => ({ id: ref, category: 'bus_route', ref }));
    expect(refs.sort(compareRoutes).map((r) => r.ref)).toEqual(['1', '2', '10', 'A', 'B']);
  });
});

describe('busRoutes', () => {
  it('returns only bus routes, sorted', () => {
    const data = {
      tourism: collection([]),
      transport: collection([
        route({ ref: '3' }),
        route({ ref: '1' }),
        { ...route({ ref: '9' }), properties: { id: 'way/1', category: 'railway' } },
      ]),
    };
    expect(busRoutes(data).map((r) => r.properties.ref)).toEqual(['1', '3']);
  });
});

describe('route text', () => {
  const p = {
    id: 'relation/1',
    category: 'bus_route',
    ref: '1',
    name: 'ខ្សែ ១',
    name_en: 'Line 1',
    from: 'A',
    to: 'B',
  };

  it('uses the chosen language, falling back to the ref', () => {
    expect(routeTitle(p, 'en')).toBe('Line 1');
    expect(routeTitle(p, 'km')).toBe('ខ្សែ ១');
    expect(routeTitle({ id: 'x', category: 'bus_route', ref: '7' }, 'en')).toBe('7');
    expect(routeSubtitle(p)).toBe('A → B');
  });

  it('searches ref, names and terminals', () => {
    expect(matchesQuery(p, ' line ')).toBe(true);
    expect(matchesQuery(p, 'b')).toBe(true);
    expect(matchesQuery(p, '២')).toBe(false);
    expect(matchesQuery(p, '')).toBe(true);
  });
});

describe('routeBounds', () => {
  it('covers the line and its stops', () => {
    const r = route({ ref: '1', stops: [{ id: 'node/1', coordinates: [103, 13] }] });
    expect(routeBounds(r)).toEqual([
      [103, 11],
      [105, 13],
    ]);
  });
});
