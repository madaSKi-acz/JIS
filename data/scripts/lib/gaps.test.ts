import type { FeatureCollection, MultiLineString, Point } from 'geojson';
import { describe, expect, it } from 'vitest';
import { findDataGaps, gapsReport } from './gaps.ts';
import type { FeatureProperties } from './properties.ts';

const collection = (
  props: FeatureProperties[],
): FeatureCollection<Point | MultiLineString, FeatureProperties> => ({
  type: 'FeatureCollection',
  features: props.map((properties) => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [104.9, 11.5] },
    properties,
  })),
});

const transport = collection([
  { id: 'node/1', category: 'bus_stop', name: 'Central Market' },
  { id: 'node/2', category: 'bus_stop', name: 'Central Market', name_km: 'ផ្សារធំថ្មី' },
  { id: 'node/3', category: 'bus_stop', name: 'វត្តភ្នំ' },
  { id: 'node/4', category: 'bus_stop' },
  { id: 'relation/10', category: 'bus_route', ref: '1', name: 'Line 1' },
  {
    id: 'relation/11',
    category: 'bus_route',
    ref: '2',
    stops: [{ id: 'node/1', coordinates: [104.9, 11.5] }],
  },
  { id: 'relation/12', category: 'ferry_route' },
]);

describe('findDataGaps', () => {
  it('finds bus stops without any Khmer name', () => {
    expect(findDataGaps(transport).stopsWithoutKhmerName.map((p) => p.id)).toEqual([
      'node/1',
      'node/4',
    ]);
  });

  it('finds bus routes without stops', () => {
    expect(findDataGaps(transport).routesWithoutStops.map((p) => p.id)).toEqual(['relation/10']);
  });
});

describe('gapsReport', () => {
  it('lists each gap with a link to OpenStreetMap', () => {
    const report = gapsReport(findDataGaps(transport), '2026-09-29');
    expect(report).toContain('## Bus lines without stops (1)');
    expect(report).toContain(
      '- [ ] 1 Line 1: [relation/10](https://www.openstreetmap.org/relation/10)',
    );
    expect(report).toContain('- [ ] unnamed: [node/4](https://www.openstreetmap.org/node/4)');
  });
});
