import type { ExpressionSpecification, LayerSpecification } from 'maplibre-gl';

export type LabelLanguage = 'km' | 'en';

export function labelExpression(lang: LabelLanguage): ExpressionSpecification {
  return lang === 'km'
    ? ['coalesce', ['get', 'name:km'], ['get', 'name']]
    : ['coalesce', ['get', 'name:en'], ['get', 'name_en'], ['get', 'name:latin'], ['get', 'name']];
}

/** Symbol layers whose labels show a place name (not house numbers or road refs). */
export function nameLabelLayerIds(layers: LayerSpecification[]): string[] {
  return layers
    .filter(
      (layer) =>
        layer.type === 'symbol' &&
        /[{"]name/.test(JSON.stringify(layer.layout?.['text-field'] ?? '')),
    )
    .map((layer) => layer.id);
}
