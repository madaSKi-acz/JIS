import { describe, expect, it } from 'vitest';
import { CATEGORIES } from './categories';
import { MAKI, markerSvg, svgBody } from './icons';

describe('marker icons', () => {
  it('has a Maki icon for every category that names one', () => {
    for (const c of CATEGORIES.filter((c) => c.icon)) expect(MAKI[c.icon!], c.id).toBeTruthy();
  });

  it('draws the icon in white on the category colour', () => {
    const svg = markerSvg('#ea580c', MAKI.bus);
    expect(svg).toContain('fill="#ea580c"');
    expect(svg).toContain('<g transform="translate(5.5 5.5)" fill="#ffffff"><path');
    expect(svg).not.toContain('<?xml');
    expect(markerSvg('#6b7280')).not.toContain('<g');
  });

  it('strips the outer svg element', () => {
    expect(svgBody('<?xml?><svg id="x" viewBox="0 0 15 15"><path d="M0"/></svg>')).toBe(
      '<path d="M0"/>',
    );
  });
});
