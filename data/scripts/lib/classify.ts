import { LAYER_RULES, type GeometryKind, type LayerRule } from '../../config/layers.ts';
import type { OsmElement, Tags } from './types.ts';

function matches(rule: LayerRule, tags: Tags): boolean {
  return Object.entries(rule.match).every(([key, allowed]) => {
    const value = tags[key];
    if (value === undefined) return false;
    return allowed === '*' || allowed.includes(value);
  });
}

function allowedKinds(element: Pick<OsmElement, 'type' | 'tags'>): GeometryKind[] {
  if (element.type === 'node') return ['point'];
  if (element.type === 'way') return ['point', 'line'];
  return element.tags?.type === 'multipolygon' ? ['point'] : ['route'];
}

export function classify(
  element: Pick<OsmElement, 'type' | 'tags'>,
  rules: LayerRule[] = LAYER_RULES,
): LayerRule | undefined {
  const tags = element.tags;
  if (!tags) return undefined;
  const kinds = allowedKinds(element);
  return rules.find((rule) => kinds.includes(rule.kind) && matches(rule, tags));
}
