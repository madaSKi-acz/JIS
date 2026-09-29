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
  dataMissing: {
    km: 'រកមិនឃើញទិន្នន័យផែនទី។ សូមដំណើរការ pnpm data:build ជាមុនសិន។',
    en: 'Map data not found. Run pnpm data:build first.',
  },
} satisfies Record<string, Record<LabelLanguage, string>>;

export type MessageKey = keyof typeof MESSAGES;

export function t(lang: LabelLanguage, key: MessageKey): string {
  return MESSAGES[key][lang];
}
