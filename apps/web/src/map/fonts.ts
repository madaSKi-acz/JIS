import type { FontFacesSpecification, LayerSpecification } from 'maplibre-gl';

/** Khmer, Khmer Symbols, zero-width joiners and the dotted circle used with combining marks. */
export const KHMER_UNICODE_RANGE = ['U+1780-17FF', 'U+19E0-19FF', 'U+200C-200D', 'U+25CC'];

/** MapLibre's default when a symbol layer sets no `text-font`. */
const DEFAULT_TEXT_FONT = ['Open Sans Regular', 'Arial Unicode MS Regular'];

function literalFontList(value: unknown): string[] | undefined {
  if (Array.isArray(value) && value.length > 0 && value.every((v) => typeof v === 'string')) {
    return value as string[];
  }
  if (Array.isArray(value) && value[0] === 'literal') return literalFontList(value[1]);
  return undefined;
}

/** Every font name the style's text labels ask for. */
export function textFontNames(layers: LayerSpecification[]): string[] {
  const names = new Set<string>();
  for (const layer of layers) {
    if (layer.type !== 'symbol' || !layer.layout?.['text-field']) continue;
    const fonts = layer.layout['text-font'];
    for (const name of fonts === undefined ? DEFAULT_TEXT_FONT : (literalFontList(fonts) ?? [])) {
      names.add(name);
    }
  }
  return [...names];
}

/**
 * Glyph servers deliver one codepoint at a time, which breaks Khmer (stacked consonants and
 * vowel signs). Font faces let the browser shape whole Khmer syllables instead.
 */
export function khmerFontFaces(
  fontNames: string[],
  urls: { regular: string; bold: string },
): FontFacesSpecification {
  return Object.fromEntries(
    fontNames.map((name) => [
      name,
      [
        {
          url: /bold/i.test(name) ? urls.bold : urls.regular,
          'unicode-range': KHMER_UNICODE_RANGE,
        },
      ],
    ]),
  );
}
