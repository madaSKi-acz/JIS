import { describe, expect, it } from 'vitest';
import { LAYER_RULES } from '../../../../data/config/layers';
import { CATEGORIES } from './categories';

describe('CATEGORIES', () => {
  it('covers every category the data pipeline produces, in the same group', () => {
    for (const rule of LAYER_RULES) {
      const category = CATEGORIES.find((c) => c.id === rule.category);
      expect(category, `missing category "${rule.category}"`).toBeDefined();
      expect(category?.group).toBe(rule.layer);
    }
  });

  it('has unique ids and both languages', () => {
    expect(new Set(CATEGORIES.map((c) => c.id)).size).toBe(CATEGORIES.length);
    for (const c of CATEGORIES) {
      expect(c.label.km).not.toBe('');
      expect(c.label.en).not.toBe('');
    }
  });
});
