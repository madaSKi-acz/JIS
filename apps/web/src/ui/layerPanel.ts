import type { IControl } from 'maplibre-gl';
import { t } from '../i18n';
import { CATEGORIES, GROUPS, type Category, type GroupId } from '../layers/categories';
import type { LabelLanguage } from '../map/labels';

export type GroupState = 'all' | 'some' | 'none';

export function groupState(categories: Category[], enabled: ReadonlySet<string>): GroupState {
  const on = categories.filter((c) => enabled.has(c.id)).length;
  return on === 0 ? 'none' : on === categories.length ? 'all' : 'some';
}

/** Categories of a group that have at least one feature, in registry order. */
export function visibleCategories(group: GroupId, counts: Record<string, number>): Category[] {
  return CATEGORIES.filter((c) => c.group === group && (counts[c.id] ?? 0) > 0);
}

export class LayerPanel implements IControl {
  private container?: HTMLElement;
  private readonly enabled: Set<string>;

  constructor(
    private readonly lang: LabelLanguage,
    private readonly counts: Record<string, number>,
    private readonly onChange: (enabled: ReadonlySet<string>) => void,
  ) {
    this.enabled = new Set(CATEGORIES.map((c) => c.id));
  }

  onAdd(): HTMLElement {
    const details = document.createElement('details');
    details.className = 'maplibregl-ctrl layer-panel';
    details.open = window.matchMedia('(min-width: 640px)').matches;

    const summary = document.createElement('summary');
    summary.textContent = t(this.lang, 'layers');
    details.append(summary);

    const numberFormat = new Intl.NumberFormat(this.lang === 'km' ? 'km-KH' : 'en');

    for (const group of GROUPS) {
      const categories = visibleCategories(group.id, this.counts);
      if (categories.length === 0) continue;

      const fieldset = document.createElement('fieldset');
      const groupBox = this.checkbox(group.label[this.lang], 'layer-group');
      fieldset.append(groupBox.label);

      const categoryBoxes = categories.map((category) => {
        const box = this.checkbox(category.label[this.lang], 'layer-category', category.color);
        const count = document.createElement('span');
        count.className = 'layer-count';
        count.textContent = numberFormat.format(this.counts[category.id]);
        box.label.append(count);
        box.input.addEventListener('change', () => {
          if (box.input.checked) this.enabled.add(category.id);
          else this.enabled.delete(category.id);
          syncGroup();
          this.onChange(this.enabled);
        });
        fieldset.append(box.label);
        return box;
      });

      const syncGroup = () => {
        const state = groupState(categories, this.enabled);
        groupBox.input.checked = state === 'all';
        groupBox.input.indeterminate = state === 'some';
      };

      groupBox.input.addEventListener('change', () => {
        for (const [i, category] of categories.entries()) {
          categoryBoxes[i].input.checked = groupBox.input.checked;
          if (groupBox.input.checked) this.enabled.add(category.id);
          else this.enabled.delete(category.id);
        }
        syncGroup();
        this.onChange(this.enabled);
      });

      syncGroup();
      details.append(fieldset);
    }

    this.container = details;
    return details;
  }

  onRemove(): void {
    this.container?.remove();
  }

  private checkbox(text: string, className: string, color?: string) {
    const label = document.createElement('label');
    label.className = className;
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = true;
    label.append(input);
    if (color) {
      const swatch = document.createElement('span');
      swatch.className = 'layer-swatch';
      swatch.style.background = color;
      label.append(swatch);
    }
    const name = document.createElement('span');
    name.className = 'layer-name';
    name.textContent = text;
    label.append(name);
    return { label, input };
  }
}
