import { describe, expect, it } from 'vitest';
import { classify } from './classify.ts';

describe('classify', () => {
  it('matches a node by tag value', () => {
    expect(classify({ type: 'node', tags: { tourism: 'hotel' } })?.category).toBe('accommodation');
  });

  it('requires every tag in the rule', () => {
    expect(classify({ type: 'node', tags: { amenity: 'place_of_worship' } })).toBeUndefined();
    expect(
      classify({ type: 'node', tags: { amenity: 'place_of_worship', religion: 'buddhist' } })
        ?.category,
    ).toBe('temple');
  });

  it('supports "*" for any value', () => {
    expect(classify({ type: 'node', tags: { aeroway: 'aerodrome' } })).toBeUndefined();
    expect(classify({ type: 'node', tags: { aeroway: 'aerodrome', iata: 'PNH' } })?.category).toBe(
      'airport',
    );
  });

  it('uses the first matching rule', () => {
    const tags = { historic: 'temple', amenity: 'place_of_worship', religion: 'buddhist' };
    expect(classify({ type: 'way', tags })?.category).toBe('heritage');
  });

  it('only matches route rules for non-multipolygon relations', () => {
    expect(classify({ type: 'relation', tags: { type: 'route', route: 'bus' } })?.kind).toBe(
      'route',
    );
    expect(
      classify({ type: 'relation', tags: { type: 'route', tourism: 'museum' } }),
    ).toBeUndefined();
    expect(
      classify({ type: 'relation', tags: { type: 'multipolygon', tourism: 'museum' } })?.kind,
    ).toBe('point');
    expect(classify({ type: 'node', tags: { type: 'route', route: 'bus' } })).toBeUndefined();
  });

  it('ignores untagged elements', () => {
    expect(classify({ type: 'node' })).toBeUndefined();
  });
});
