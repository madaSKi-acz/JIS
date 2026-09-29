import type { OsmElement } from '../scripts/lib/types.ts';

/** A tiny Phnom Penh-like dataset covering every geometry path of the pipeline. */
export const SAMPLE: OsmElement[] = [
  {
    type: 'node',
    id: 1,
    lat: 11.5658,
    lon: 104.9282,
    tags: {
      tourism: 'museum',
      name: 'National Museum',
      'name:km': 'សារមន្ទីរជាតិ',
      website: 'https://example.org',
    },
  },
  { type: 'node', id: 2, lat: 11.56, lon: 104.92, tags: { highway: 'bus_stop', name: 'Stop A' } },
  { type: 'node', id: 3, lat: 11.57, lon: 104.93, tags: { highway: 'bus_stop' } },
  {
    type: 'node',
    id: 4,
    lat: 11.58,
    lon: 104.94,
    tags: { amenity: 'cafe', name: 'Not on the map' },
  },
  {
    type: 'node',
    id: 5,
    lat: 11.561,
    lon: 104.921,
    tags: { public_transport: 'platform', name: 'Platform A', 'name:km': 'ចំណត A' },
  },
  { type: 'node', id: 10, lat: 11.0, lon: 104.0 },
  { type: 'node', id: 11, lat: 11.0, lon: 104.002 },
  { type: 'node', id: 12, lat: 11.002, lon: 104.002 },
  { type: 'node', id: 13, lat: 11.002, lon: 104.0 },
  { type: 'node', id: 20, lat: 11.565, lon: 104.925 },
  {
    type: 'way',
    id: 100,
    refs: [10, 11, 12, 13, 10],
    tags: { amenity: 'place_of_worship', religion: 'buddhist', name: 'Wat Test' },
  },
  { type: 'way', id: 101, refs: [2, 20, 3], tags: { highway: 'primary' } },
  { type: 'way', id: 102, refs: [10, 11, 12, 13, 10] },
  { type: 'way', id: 103, refs: [10, 11], tags: { route: 'ferry', name: 'Mekong Crossing' } },
  { type: 'way', id: 104, refs: [12, 13], tags: { railway: 'rail' } },
  { type: 'way', id: 105, refs: [11, 12], tags: { railway: 'abandoned' } },
  {
    type: 'relation',
    id: 1000,
    members: [
      { type: 'node', ref: 2, role: 'stop' },
      { type: 'way', ref: 101, role: '' },
      { type: 'node', ref: 3, role: 'stop' },
    ],
    tags: { type: 'route', route: 'bus', name: 'Line 1', ref: '1' },
  },
  {
    type: 'relation',
    id: 1004,
    members: [
      { type: 'node', ref: 2, role: 'stop' },
      { type: 'node', ref: 5, role: 'platform' },
      { type: 'way', ref: 101, role: '' },
      { type: 'node', ref: 3, role: 'stop' },
    ],
    tags: { type: 'route', route: 'bus', name: 'Line 2', ref: '2' },
  },
  {
    type: 'relation',
    id: 1001,
    members: [{ type: 'way', ref: 102, role: 'outer' }],
    tags: { type: 'multipolygon', historic: 'archaeological_site', name: 'Old Site' },
  },
  {
    type: 'relation',
    id: 1002,
    members: [{ type: 'way', ref: 101, role: '' }],
    tags: { type: 'route', route: 'hiking' },
  },
  {
    type: 'relation',
    id: 1003,
    members: [{ type: 'way', ref: 999, role: '' }],
    tags: { type: 'route', route: 'ferry', name: 'Missing geometry' },
  },
];
