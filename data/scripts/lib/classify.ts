import { LAYER_RULES, type LayerRule } from '../../config/layers.ts';
import type { OsmElement, Tags } from './types.ts';

function matches(rule: LayerRule, tags: Tags): boolean {
  return Object.entries(rule.match).every(([key, allowed]) => {
    const value = tags[key];
    if (value === undefined) return false;
    return allowed === '*' || allowed.includes(value);
  });
}

/**
 * Nodes, ways and multipolygon relations can only become points;
 * other relations can only become routes.
 */
export function classify(
  element: Pick<OsmElement, 'type' | 'tags'>,
  rules: LayerRule[] = LAYER_RULES,
): LayerRule | undefined {
  const tags = element.tags;
  if (!tags) return undefined;
  const kind = element.type === 'relation' && tags.type !== 'multipolygon' ? 'route' : 'point';
  return rules.find((rule) => rule.kind === kind && matches(rule, tags));
}
