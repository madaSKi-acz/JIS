import type { LabelLanguage } from './map/labels';

const MESSAGES = {
  layers: { km: 'ស្រទាប់ផែនទី', en: 'Map layers' },
  openingHours: { km: 'ម៉ោងបើក', en: 'Opening hours' },
  website: { km: 'គេហទំព័រ', en: 'Website' },
  phone: { km: 'ទូរស័ព្ទ', en: 'Phone' },
  operator: { km: 'ប្រតិបត្តិករ', en: 'Operator' },
  route: { km: 'ខ្សែ', en: 'Route' },
  viewOnOsm: { km: 'មើល ឬកែនៅលើ OpenStreetMap', en: 'View or edit on OpenStreetMap' },
  unnamed: { km: 'គ្មានឈ្មោះ', en: 'Unnamed' },
  busLines: { km: 'ខ្សែឡានក្រុង', en: 'Bus lines' },
  searchLines: { km: 'ស្វែងរកលេខ ឬឈ្មោះខ្សែ', en: 'Search by number or name' },
  allLines: { km: '← ខ្សែទាំងអស់', en: '← All lines' },
  stops: { km: 'ចំណត', en: 'Stops' },
  noStops: {
    km: 'ចំណតនៃខ្សែនេះមិនទាន់មាននៅលើ OpenStreetMap នៅឡើយទេ។',
    en: 'This line has no stops mapped in OpenStreetMap yet.',
  },
  noLinesFound: { km: 'រកមិនឃើញខ្សែ', en: 'No lines found' },
  dataMissing: {
    km: 'រកមិនឃើញទិន្នន័យផែនទី។ សូមដំណើរការ pnpm data:build ជាមុនសិន។',
    en: 'Map data not found. Run pnpm data:build first.',
  },
} satisfies Record<string, Record<LabelLanguage, string>>;

export type MessageKey = keyof typeof MESSAGES;

export function t(lang: LabelLanguage, key: MessageKey): string {
  return MESSAGES[key][lang];
}
