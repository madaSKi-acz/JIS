import { describe, expect, it } from 'vitest';
import { collection, type PlaceFeature, type PlaceProperties } from '../layers/data';
import { anchor, buildIndex, normalize, searchPlaces } from './search';

const place = (props: Partial<PlaceProperties>, coordinates = [104.9, 11.5]): PlaceFeature => ({
  type: 'Feature',
  geometry: { type: 'Point', coordinates },
  properties: { id: `node/${props.name ?? 0}`, category: 'temple', ...props },
});

const data = {
  tourism: collection([
    place({ name: 'វត្តភ្នំ', name_en: 'Wat Phnom' }),
    place({ name: 'Phnom Penh Night Market' }),
    place({ name: 'Wat Ounalom', name_km: 'វត្តឧណ្ណាលោម' }),
    place({ name: 'Museum of Phnom' }),
    place({ category: 'viewpoint' }),
  ]),
  transport: collection([
    place({ name: 'Phnom Penh Railway Station', category: 'railway_station' }),
    {
      type: 'Feature',
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          [
            [104, 11],
            [105, 12],
          ],
        ],
      },
      properties: { id: 'relation/1', category: 'bus_route', name: 'Phnom Line' },
    },
  ]),
};

const names = (query: string) =>
  searchPlaces(buildIndex(data), query).map((r) => r.entry.feature.properties.name);

describe('normalize', () => {
  it('ignores case and extra spaces but keeps Khmer marks', () => {
    expect(normalize('  Wat   PHNOM ')).toBe('wat phnom');
    expect(normalize('វត្តភ្នំ')).toBe('វត្តភ្នំ');
  });
});

describe('anchor', () => {
  it('uses the point itself or the middle of a line', () => {
    expect(anchor({ type: 'Point', coordinates: [1, 2] })).toEqual([1, 2]);
    expect(
      anchor({
        type: 'LineString',
        coordinates: [
          [0, 0],
          [2, 4],
        ],
      }),
    ).toEqual([1, 2]);
    expect(anchor({ type: 'LineString', coordinates: [] })).toBeUndefined();
  });
});

describe('buildIndex', () => {
  it('skips unnamed places and bus lines', () => {
    expect(buildIndex(data)).toHaveLength(5);
  });
});

describe('searchPlaces', () => {
  it('matches Khmer and English names', () => {
    expect(names('វត្តភ្នំ')).toEqual(['វត្តភ្នំ']);
    expect(names('wat phnom')).toEqual(['វត្តភ្នំ']);
    expect(names('ឧណ្ណាលោម')).toEqual(['Wat Ounalom']);
  });

  it('ranks exact, then prefix, then word start, then anywhere', () => {
    expect(names('phnom')).toEqual([
      'Phnom Penh Night Market',
      'Phnom Penh Railway Station',
      'វត្តភ្នំ',
      'Museum of Phnom',
    ]);
    expect(names('hnom')).toHaveLength(4);
  });

  it('returns nothing for an empty query and respects the limit', () => {
    expect(names('  ')).toEqual([]);
    expect(searchPlaces(buildIndex(data), 'p', 2)).toHaveLength(2);
  });
});
