import type { LabelLanguage } from '../map/labels';

export type GroupId = 'tourism' | 'transport';

export interface Category {
  id: string;
  group: GroupId;
  color: string;
  label: Record<LabelLanguage, string>;
}

export const GROUPS: { id: GroupId; label: Record<LabelLanguage, string> }[] = [
  { id: 'tourism', label: { km: 'ទេសចរណ៍', en: 'Tourism' } },
  { id: 'transport', label: { km: 'ការដឹកជញ្ជូន', en: 'Transport' } },
];

/** Must cover every category in data/config/layers.ts (checked by a test). */
export const CATEGORIES: Category[] = [
  {
    id: 'heritage',
    group: 'tourism',
    color: '#92400e',
    label: { km: 'បេតិកភណ្ឌ', en: 'Heritage site' },
  },
  { id: 'temple', group: 'tourism', color: '#ea580c', label: { km: 'វត្ត', en: 'Temple' } },
  { id: 'museum', group: 'tourism', color: '#7c3aed', label: { km: 'សារមន្ទីរ', en: 'Museum' } },
  {
    id: 'attraction',
    group: 'tourism',
    color: '#e11d48',
    label: { km: 'កន្លែងទេសចរណ៍', en: 'Attraction' },
  },
  {
    id: 'viewpoint',
    group: 'tourism',
    color: '#16a34a',
    label: { km: 'ទីកន្លែងមើលទេសភាព', en: 'Viewpoint' },
  },
  {
    id: 'accommodation',
    group: 'tourism',
    color: '#0d9488',
    label: { km: 'កន្លែងស្នាក់នៅ', en: 'Accommodation' },
  },
  {
    id: 'bus_stop',
    group: 'transport',
    color: '#2563eb',
    label: { km: 'ចំណតឡានក្រុង', en: 'Bus stop' },
  },
  {
    id: 'bus_station',
    group: 'transport',
    color: '#1e40af',
    label: { km: 'ស្ថានីយឡានក្រុង', en: 'Bus station' },
  },
  {
    id: 'train_station',
    group: 'transport',
    color: '#334155',
    label: { km: 'ស្ថានីយរថភ្លើង', en: 'Train station' },
  },
  {
    id: 'ferry_terminal',
    group: 'transport',
    color: '#0284c7',
    label: { km: 'កំពង់ផែសាឡាង', en: 'Ferry terminal' },
  },
  {
    id: 'airport',
    group: 'transport',
    color: '#111827',
    label: { km: 'អាកាសយានដ្ឋាន', en: 'Airport' },
  },
  {
    id: 'bus_route',
    group: 'transport',
    color: '#2563eb',
    label: { km: 'ខ្សែរត់ឡានក្រុង', en: 'Bus route' },
  },
  {
    id: 'ferry_route',
    group: 'transport',
    color: '#0284c7',
    label: { km: 'ផ្លូវសាឡាង', en: 'Ferry route' },
  },
  {
    id: 'train_route',
    group: 'transport',
    color: '#334155',
    label: { km: 'ខ្សែរថភ្លើង', en: 'Train route' },
  },
  { id: 'railway', group: 'transport', color: '#64748b', label: { km: 'ផ្លូវដែក', en: 'Railway' } },
];

const BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getCategory(id: string): Category | undefined {
  return BY_ID.get(id);
}

export const FALLBACK_COLOR = '#6b7280';
