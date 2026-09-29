import { t } from '../i18n';
import { getCategory } from '../layers/categories';
import type { PlaceProperties } from '../layers/data';
import type { LabelLanguage } from '../map/labels';

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

/** Only http(s) links; OSM tags are user-edited, so `javascript:` and similar must never become links. */
export function safeUrl(value: string): string | undefined {
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withScheme);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export function displayName(p: PlaceProperties, lang: LabelLanguage): string | undefined {
  return (lang === 'km' ? p.name_km : p.name_en) ?? p.name;
}

export function osmUrl(id: string): string | undefined {
  const match = /^(node|way|relation)\/(\d+)$/.exec(id);
  return match ? `https://www.openstreetmap.org/${match[1]}/${match[2]}` : undefined;
}

export function popupHtml(p: PlaceProperties, lang: LabelLanguage): string {
  const title = displayName(p, lang);
  const names = [p.name_km, p.name_en, p.name].filter((n): n is string => !!n);
  const subtitle = names.find((n) => n !== title);
  const category = getCategory(p.category)?.label[lang] ?? p.category;

  const rows: string[] = [];
  const row = (label: string, valueHtml: string) =>
    rows.push(`<dt>${escapeHtml(label)}</dt><dd>${valueHtml}</dd>`);

  if (p.ref)
    row(
      t(lang, 'route'),
      escapeHtml([p.ref, p.from && p.to ? `${p.from} → ${p.to}` : ''].filter(Boolean).join(' · ')),
    );
  if (p.opening_hours) row(t(lang, 'openingHours'), escapeHtml(p.opening_hours));
  if (p.phone) row(t(lang, 'phone'), escapeHtml(p.phone));
  if (p.operator) row(t(lang, 'operator'), escapeHtml(p.operator));
  const website = p.website ? safeUrl(p.website) : undefined;
  if (website) {
    row(
      t(lang, 'website'),
      `<a href="${escapeHtml(website)}" target="_blank" rel="noopener noreferrer">${escapeHtml(new URL(website).host)}</a>`,
    );
  }

  const osm = osmUrl(p.id);
  return [
    `<div class="popup">`,
    `<div class="popup-category">${escapeHtml(category)}</div>`,
    `<h3 class="popup-title">${escapeHtml(title ?? t(lang, 'unnamed'))}</h3>`,
    subtitle ? `<div class="popup-subtitle">${escapeHtml(subtitle)}</div>` : '',
    rows.length ? `<dl>${rows.join('')}</dl>` : '',
    osm
      ? `<a class="popup-osm" href="${osm}" target="_blank" rel="noopener noreferrer">${escapeHtml(t(lang, 'viewOnOsm'))}</a>`
      : '',
    `</div>`,
  ].join('');
}
