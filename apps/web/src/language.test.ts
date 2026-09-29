import { describe, expect, it } from 'vitest';
import { languageUrl, resolveLanguage } from './language';

describe('resolveLanguage', () => {
  it('prefers the URL, then the stored choice, then Khmer', () => {
    expect(resolveLanguage('?lang=en', 'km')).toBe('en');
    expect(resolveLanguage('', 'en')).toBe('en');
    expect(resolveLanguage('', null)).toBe('km');
  });

  it('ignores unknown values', () => {
    expect(resolveLanguage('?lang=fr', 'de')).toBe('km');
  });
});

describe('languageUrl', () => {
  it('sets the language and keeps other params and the map position', () => {
    expect(languageUrl('http://x/?a=1#12/11.5/104.9', 'en')).toBe(
      'http://x/?a=1&lang=en#12/11.5/104.9',
    );
    expect(languageUrl('http://x/?lang=en#5/1/2', 'km')).toBe('http://x/?lang=km#5/1/2');
  });
});
