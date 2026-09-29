import type { IControl } from 'maplibre-gl';
import { languageUrl, storeLanguage } from '../language';
import type { LabelLanguage } from '../map/labels';

const OPTIONS: { lang: LabelLanguage; label: string }[] = [
  { lang: 'km', label: 'ខ្មែរ' },
  { lang: 'en', label: 'EN' },
];

/** Switching reloads the page, since labels, panels and popups are all built for one language. */
export class LanguageSwitch implements IControl {
  private container?: HTMLElement;

  constructor(private readonly current: LabelLanguage) {}

  onAdd(): HTMLElement {
    const group = document.createElement('div');
    group.className = 'maplibregl-ctrl maplibregl-ctrl-group language-switch';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Language / ភាសា');
    for (const { lang, label } of OPTIONS) {
      const button = document.createElement('button');
      button.type = 'button';
      button.lang = lang;
      button.textContent = label;
      button.setAttribute('aria-pressed', String(lang === this.current));
      button.addEventListener('click', () => {
        if (lang === this.current) return;
        storeLanguage(lang);
        location.assign(languageUrl(location.href, lang));
      });
      group.append(button);
    }
    this.container = group;
    return group;
  }

  onRemove(): void {
    this.container?.remove();
  }
}
