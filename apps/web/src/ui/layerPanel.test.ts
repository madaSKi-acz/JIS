import { describe, expect, it } from 'vitest';
import { CATEGORIES } from '../layers/categories';
import { groupState, visibleCategories } from './layerPanel';

const tourism = CATEGORIES.filter((c) => c.group === 'tourism');

describe('groupState', () => {
  it('reports all, some or none enabled', () => {
    expect(groupState(tourism, new Set(tourism.map((c) => c.id)))).toBe('all');
    expect(groupState(tourism, new Set(['temple']))).toBe('some');
    expect(groupState(tourism, new Set(['bus_stop']))).toBe('none');
  });
});

describe('visibleCategories', () => {
  it('hides categories with no features', () => {
    expect(visibleCategories('transport', { bus_stop: 3, railway: 0 }).map((c) => c.id)).toEqual([
      'bus_stop',
    ]);
  });
});
