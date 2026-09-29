import type { LabelLanguage } from './map/labels';

const STORAGE_KEY = 'jis.lang';

function isLanguage(value: string | null | undefined): value is LabelLanguage {
  return value === 'km' || value === 'en';
}

/** `?lang=` in the URL wins, then the viewer's last choice, then Khmer. */
export function resolveLanguage(search: string, stored: string | null): LabelLanguage {
  const fromUrl = new URLSearchParams(search).get('lang');
  if (isLanguage(fromUrl)) return fromUrl;
  return isLanguage(stored) ? stored : 'km';
}

export function readStoredLanguage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function storeLanguage(lang: LabelLanguage): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Storage can be blocked (private mode); the URL still carries the choice.
  }
}

/** Same page with `?lang=` set; keeps the map position in the hash. */
export function languageUrl(href: string, lang: LabelLanguage): string {
  const url = new URL(href);
  url.searchParams.set('lang', lang);
  return url.href;
}
