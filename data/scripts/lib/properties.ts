import { EXTRA_PROPERTIES, type LayerRule } from '../../config/layers.ts';
import type { OsmElement, Tags } from './types.ts';

export interface FeatureProperties {
  id: string;
  category: string;
  name?: string;
  name_km?: string;
  name_en?: string;
  [key: string]: string | undefined;
}

export function buildProperties(
  element: Pick<OsmElement, 'type' | 'id'>,
  rule: LayerRule,
  tags: Tags,
): FeatureProperties {
  const props: FeatureProperties = { id: `${element.type}/${element.id}`, category: rule.category };
  if (tags.name) props.name = tags.name;
  if (tags['name:km']) props.name_km = tags['name:km'];
  if (tags['name:en']) props.name_en = tags['name:en'];
  for (const key of EXTRA_PROPERTIES) {
    if (tags[key]) props[key] = tags[key];
  }
  return props;
}
