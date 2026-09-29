import type { LayerSpecification } from 'maplibre-gl';
import { describe, expect, it } from 'vitest';
import { KHMER_UNICODE_RANGE, khmerFontFaces, textFontNames } from './fonts';

const symbol = (id: string, layout: Record<string, unknown>) =>
  ({ id, type: 'symbol', source: 's', layout }) as LayerSpecification;

describe('textFontNames', () => {
  it('collects literal font lists from labelled symbol layers', () => {
    const layers = [
      symbol('a', { 'text-field': '{name}', 'text-font': ['Noto Sans Regular'] }),
      symbol('b', { 'text-field': '{name}', 'text-font': ['literal', ['Noto Sans Bold']] }),
      symbol('c', { 'icon-image': 'x', 'text-font': ['Icon Only Font'] }),
      { id: 'bg', type: 'background' } as LayerSpecification,
    ];
    expect(textFontNames(layers)).toEqual(['Noto Sans Regular', 'Noto Sans Bold']);
  });

  it("uses MapLibre's default fonts when a layer sets none", () => {
    expect(textFontNames([symbol('a', { 'text-field': '{name}' })])).toEqual([
      'Open Sans Regular',
      'Arial Unicode MS Regular',
    ]);
  });
});

describe('khmerFontFaces', () => {
  it('maps each font to the Khmer file of matching weight', () => {
    expect(
      khmerFontFaces(['Noto Sans Regular', 'Noto Sans Bold'], {
        regular: 'r.woff2',
        bold: 'b.woff2',
      }),
    ).toEqual({
      'Noto Sans Regular': [{ url: 'r.woff2', 'unicode-range': KHMER_UNICODE_RANGE }],
      'Noto Sans Bold': [{ url: 'b.woff2', 'unicode-range': KHMER_UNICODE_RANGE }],
    });
  });
});
