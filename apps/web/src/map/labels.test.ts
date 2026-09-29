import type { LayerSpecification } from 'maplibre-gl';
import { describe, expect, it } from 'vitest';
import { labelExpression, nameLabelLayerIds } from './labels';

const symbol = (id: string, textField: unknown) =>
  ({ id, type: 'symbol', source: 's', layout: { 'text-field': textField } }) as LayerSpecification;

describe('nameLabelLayerIds', () => {
  it('finds layers labelled with a name, in template or expression form', () => {
    const layers = [
      symbol('place', '{name:latin}\n{name:nonlatin}'),
      symbol('poi', ['coalesce', ['get', 'name_en'], ['get', 'name']]),
      symbol('housenumber', '{housenumber}'),
      symbol('road-shield', ['get', 'ref']),
      { id: 'bg', type: 'background' } as LayerSpecification,
    ];
    expect(nameLabelLayerIds(layers)).toEqual(['place', 'poi']);
  });
});

describe('labelExpression', () => {
  it('prefers the Khmer name and falls back to the local name', () => {
    expect(labelExpression('km')).toEqual(['coalesce', ['get', 'name:km'], ['get', 'name']]);
  });

  it('prefers English names for English', () => {
    expect(labelExpression('en')[1]).toEqual(['get', 'name:en']);
  });
});
