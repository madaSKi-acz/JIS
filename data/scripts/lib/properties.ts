import { EXTRA_PROPERTIES, type LayerRule } from '../../config/layers.ts';
import type { OsmElement, Tags } from './types.ts';

export interface Names {
  name?: string;
  name_km?: string;
  name_en?: string;
}

export interface RouteStop extends Names {
  id: string;
  coordinates: [number, number];
}

export type FeatureProperties = Names &
  Partial<Record<(typeof EXTRA_PROPERTIES)[number], string>> & {
    id: string;
    category: string;
    /** Ordered stops, only on route features. */
    stops?: RouteStop[];
  };

export function namesFrom(tags: Tags): Names {
  const names: Names = {};
  if (tags.name) names.name = tags.name;
  if (tags['name:km']) names.name_km = tags['name:km'];
  if (tags['name:en']) names.name_en = tags['name:en'];
  return names;
}

export function buildProperties(
  element: Pick<OsmElement, 'type' | 'id'>,
  rule: LayerRule,
  tags: Tags,
): FeatureProperties {
  const props: FeatureProperties = {
    id: `${element.type}/${element.id}`,
    category: rule.category,
    ...namesFrom(tags),
  };
  for (const key of EXTRA_PROPERTIES) {
    if (tags[key]) props[key] = tags[key];
  }
  return props;
}
