import type { IControl } from 'maplibre-gl';
import { t } from '../i18n';
import type { PlaceFeature, RouteStop } from '../layers/data';
import type { LabelLanguage } from '../map/labels';
import { matchesQuery, routeSubtitle, routeTitle } from '../routes/routes';
import { el } from './dom';
import { displayName } from './popup';

export interface RoutePanelCallbacks {
  onSelect(route: PlaceFeature | undefined): void;
  onStopClick(stop: RouteStop): void;
}

export class RoutePanel implements IControl {
  private details?: HTMLDetailsElement;
  private body?: HTMLElement;
  private query = '';

  constructor(
    private readonly lang: LabelLanguage,
    private readonly routes: PlaceFeature[],
    private readonly callbacks: RoutePanelCallbacks,
  ) {}

  onAdd(): HTMLElement {
    const details = el('details', 'maplibregl-ctrl map-panel route-panel');
    details.append(el('summary', undefined, `${t(this.lang, 'busLines')} (${this.routes.length})`));
    this.body = el('div', 'route-panel-body');
    details.append(this.body);
    this.details = details;
    this.renderList();
    return details;
  }

  onRemove(): void {
    this.details?.remove();
  }

  /** Selects a route by feature id, e.g. after it was clicked on the map. */
  select(id: string): void {
    const route = this.routes.find((r) => r.properties.id === id);
    if (!route) return;
    if (this.details) this.details.open = true;
    this.renderRoute(route);
    this.callbacks.onSelect(route);
  }

  private clear(): void {
    this.renderList();
    this.callbacks.onSelect(undefined);
  }

  private badge(ref: string | undefined): HTMLElement {
    return el('span', 'route-badge', ref ?? '•');
  }

  private renderList(): void {
    if (!this.body) return;
    const search = el('input', 'route-search');
    search.type = 'search';
    search.placeholder = t(this.lang, 'searchLines');
    search.value = this.query;

    const list = el('ul', 'route-list');
    const fill = () => {
      list.replaceChildren();
      const matches = this.routes.filter((r) => matchesQuery(r.properties, this.query));
      if (matches.length === 0) list.append(el('li', 'route-empty', t(this.lang, 'noLinesFound')));
      for (const route of matches) {
        const button = el('button', 'route-item');
        button.type = 'button';
        const text = el('span', 'route-text');
        text.append(el('span', 'route-title', routeTitle(route.properties, this.lang)));
        const subtitle = routeSubtitle(route.properties);
        if (subtitle) text.append(el('span', 'route-subtitle', subtitle));
        button.append(this.badge(route.properties.ref), text);
        button.addEventListener('click', () => this.select(route.properties.id));
        const item = el('li');
        item.append(button);
        list.append(item);
      }
    };
    search.addEventListener('input', () => {
      this.query = search.value;
      fill();
    });
    fill();
    this.body.replaceChildren(search, list);
  }

  private renderRoute(route: PlaceFeature): void {
    if (!this.body) return;
    const p = route.properties;

    const back = el('button', 'route-back', t(this.lang, 'allLines'));
    back.type = 'button';
    back.addEventListener('click', () => this.clear());

    const header = el('div', 'route-header');
    const text = el('div', 'route-text');
    text.append(el('strong', 'route-title', routeTitle(p, this.lang)));
    const subtitle = routeSubtitle(p);
    if (subtitle) text.append(el('span', 'route-subtitle', subtitle));
    if (p.operator)
      text.append(el('span', 'route-subtitle', `${t(this.lang, 'operator')}: ${p.operator}`));
    header.append(this.badge(p.ref), text);

    const stops = p.stops ?? [];
    const section = el('div', 'route-stops');
    section.append(el('div', 'route-stops-title', `${t(this.lang, 'stops')} (${stops.length})`));
    if (stops.length === 0) {
      section.append(el('p', 'route-empty', t(this.lang, 'noStops')));
    } else {
      const list = el('ol', 'route-stop-list');
      for (const stop of stops) {
        const button = el(
          'button',
          'route-stop',
          displayName({ ...stop, category: 'bus_stop' }, this.lang) ?? t(this.lang, 'unnamed'),
        );
        button.type = 'button';
        button.addEventListener('click', () => this.callbacks.onStopClick(stop));
        const item = el('li');
        item.append(button);
        list.append(item);
      }
      section.append(list);
    }

    this.body.replaceChildren(back, header, section);
  }
}
