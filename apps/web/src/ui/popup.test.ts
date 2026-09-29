import { describe, expect, it } from 'vitest';
import { displayName, escapeHtml, osmUrl, popupHtml, safeUrl } from './popup';

describe('escapeHtml', () => {
  it('escapes HTML special characters', () => {
    expect(escapeHtml(`<img src=x onerror="a('b')">&`)).toBe(
      '&lt;img src=x onerror=&quot;a(&#39;b&#39;)&quot;&gt;&amp;',
    );
  });
});

describe('safeUrl', () => {
  it('allows http(s) and adds a missing scheme', () => {
    expect(safeUrl('https://example.org/a')).toBe('https://example.org/a');
    expect(safeUrl('example.org')).toBe('https://example.org/');
  });

  it('rejects other schemes', () => {
    expect(safeUrl('javascript:alert(1)')).toBeUndefined();
    expect(safeUrl('data:text/html,hi')).toBeUndefined();
  });
});

describe('displayName', () => {
  const p = { id: 'node/1', category: 'temple', name: 'វត្តភ្នំ', name_en: 'Wat Phnom' };
  it('prefers the chosen language, then the local name', () => {
    expect(displayName(p, 'en')).toBe('Wat Phnom');
    expect(displayName(p, 'km')).toBe('វត្តភ្នំ');
  });
});

describe('osmUrl', () => {
  it('links to the OSM element', () => {
    expect(osmUrl('way/42')).toBe('https://www.openstreetmap.org/way/42');
    expect(osmUrl('bogus')).toBeUndefined();
  });
});

describe('popupHtml', () => {
  it('shows names, category and details', () => {
    const html = popupHtml(
      {
        id: 'node/1',
        category: 'museum',
        name: 'សារមន្ទីរជាតិ',
        name_en: 'National Museum',
        opening_hours: 'Mo-Su 08:00-17:00',
        website: 'https://example.org',
      },
      'en',
    );
    expect(html).toContain('<h3 class="popup-title">National Museum</h3>');
    expect(html).toContain('<div class="popup-subtitle">សារមន្ទីរជាតិ</div>');
    expect(html).toContain('Museum');
    expect(html).toContain('Mo-Su 08:00-17:00');
    expect(html).toContain('href="https://example.org/"');
    expect(html).toContain('href="https://www.openstreetmap.org/node/1"');
  });

  it('never outputs markup from OSM data', () => {
    const html = popupHtml(
      {
        id: 'node/1',
        category: 'temple',
        name: '<script>alert(1)</script>',
        website: 'javascript:alert(1)',
        opening_hours: '"><img src=x onerror=alert(1)>',
      },
      'km',
    );
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('javascript:');
  });

  it('labels unnamed places', () => {
    expect(popupHtml({ id: 'node/1', category: 'bus_stop' }, 'en')).toContain('Unnamed');
  });
});
