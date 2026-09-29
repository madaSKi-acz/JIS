import type { IControl } from 'maplibre-gl';
import { t } from '../i18n';
import { getCategory } from '../layers/categories';
import type { LabelLanguage } from '../map/labels';
import { searchPlaces, type SearchEntry } from '../search/search';
import { el } from './dom';
import { displayName } from './popup';

export class SearchPanel implements IControl {
  private container?: HTMLElement;

  constructor(
    private readonly lang: LabelLanguage,
    private readonly index: SearchEntry[],
    private readonly onSelect: (entry: SearchEntry) => void,
  ) {}

  onAdd(): HTMLElement {
    const container = el('div', 'maplibregl-ctrl map-panel search-panel');
    const form = el('form', 'search-form');
    form.setAttribute('role', 'search');
    const input = el('input', 'route-search');
    input.type = 'search';
    input.placeholder = t(this.lang, 'searchPlaces');
    input.setAttribute('aria-label', t(this.lang, 'searchPlaces'));
    const list = el('ul', 'search-results');
    list.hidden = true;
    form.append(input, list);
    container.append(form);

    let results: SearchEntry[] = [];
    const pick = (entry: SearchEntry) => {
      list.hidden = true;
      input.blur();
      this.onSelect(entry);
    };
    const fill = () => {
      results = searchPlaces(this.index, input.value).map((r) => r.entry);
      list.replaceChildren();
      list.hidden = !input.value.trim();
      if (results.length === 0) list.append(el('li', 'route-empty', t(this.lang, 'noPlacesFound')));
      for (const entry of results) {
        const p = entry.feature.properties;
        const button = el('button', 'route-item');
        button.type = 'button';
        const text = el('span', 'route-text');
        text.append(
          el('span', 'route-title', displayName(p, this.lang) ?? t(this.lang, 'unnamed')),
        );
        const category = getCategory(p.category)?.label[this.lang];
        if (category) text.append(el('span', 'route-subtitle', category));
        button.append(text);
        button.addEventListener('click', () => pick(entry));
        const item = el('li');
        item.append(button);
        list.append(item);
      }
    };

    input.addEventListener('input', fill);
    input.addEventListener('focus', () => {
      if (input.value.trim()) list.hidden = false;
    });
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      input.value = '';
      fill();
    });
    // Enter picks the best match.
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (results[0]) pick(results[0]);
    });

    this.container = container;
    return container;
  }

  onRemove(): void {
    this.container?.remove();
  }
}
