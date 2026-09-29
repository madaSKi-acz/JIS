import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { SAMPLE } from '../../test/sample.ts';
import { writePbf } from '../../test/make-pbf.ts';
import { extractLayers, routeStopIds, type ExtractResult } from './extract.ts';
import { pbfSource, readPbfTimestamp } from './pbf.ts';

const byId = (result: ExtractResult, id: string) =>
  [...result.layers.tourism.features, ...result.layers.transport.features].find(
    (f) => f.properties.id === id,
  );

function checkSample(result: ExtractResult) {
  expect(result.counts).toEqual({
    'tourism/museum': 1,
    'tourism/temple': 1,
    'tourism/heritage': 1,
    'transport/bus_stop': 2,
    'transport/bus_route': 2,
    'transport/ferry_route': 1,
    'transport/railway': 1,
  });
  expect(result.skipped).toBe(1);

  expect(byId(result, 'node/1')).toEqual({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [104.9282, 11.5658] },
    properties: {
      id: 'node/1',
      category: 'museum',
      name: 'National Museum',
      name_km: 'សារមន្ទីរជាតិ',
      website: 'https://example.org',
    },
  });
  expect(byId(result, 'way/100')?.geometry).toEqual({
    type: 'Point',
    coordinates: [104.001, 11.001],
  });
  expect(byId(result, 'relation/1001')?.geometry).toEqual({
    type: 'Point',
    coordinates: [104.001, 11.001],
  });
  expect(byId(result, 'relation/1000')).toMatchObject({
    geometry: {
      type: 'MultiLineString',
      coordinates: [
        [
          [104.92, 11.56],
          [104.925, 11.565],
          [104.93, 11.57],
        ],
      ],
    },
    properties: {
      category: 'bus_route',
      name: 'Line 1',
      ref: '1',
      stops: [
        { id: 'node/2', name: 'Stop A', coordinates: [104.92, 11.56] },
        { id: 'node/3', coordinates: [104.93, 11.57] },
      ],
    },
  });
  expect(byId(result, 'relation/1004')?.properties.stops).toEqual([
    { id: 'node/5', name: 'Platform A', name_km: 'ចំណត A', coordinates: [104.921, 11.561] },
  ]);
  expect(byId(result, 'way/103')).toMatchObject({
    geometry: {
      type: 'MultiLineString',
      coordinates: [
        [
          [104, 11],
          [104.002, 11],
        ],
      ],
    },
    properties: { category: 'ferry_route', name: 'Mekong Crossing' },
  });
  expect(byId(result, 'way/105')).toBeUndefined();
  expect(byId(result, 'node/4')).toBeUndefined();
}

describe('routeStopIds', () => {
  const route = (members: [string, number][]) => ({
    type: 'relation' as const,
    id: 1,
    members: members.map(([role, ref]) => ({ type: 'node' as const, ref, role })),
  });

  it('prefers platforms over stop positions', () => {
    expect(
      routeStopIds(
        route([
          ['stop', 1],
          ['platform', 2],
          ['stop', 3],
          ['platform_exit_only', 4],
        ]),
      ),
    ).toEqual([2, 4]);
  });

  it('falls back to stop positions and drops repeated neighbours', () => {
    expect(
      routeStopIds(
        route([
          ['stop_entry_only', 1],
          ['stop', 1],
          ['', 9],
          ['stop', 3],
        ]),
      ),
    ).toEqual([1, 3]);
  });
});

describe('extractLayers', () => {
  it('builds layers from in-memory elements', async () => {
    checkSample(
      await extractLayers(async function* () {
        yield* SAMPLE;
      }),
    );
  });

  describe('from a real .osm.pbf file', () => {
    let dir: string;
    let file: string;

    beforeAll(async () => {
      dir = await mkdtemp(join(tmpdir(), 'jis-'));
      file = join(dir, 'sample.osm.pbf');
      await writePbf(file, SAMPLE, 1_767_225_600);
    });
    afterAll(() => rm(dir, { recursive: true, force: true }));

    it('produces the same layers', async () => {
      checkSample(await extractLayers(pbfSource(file)));
    });

    it('reads the data timestamp from the header', async () => {
      expect(await readPbfTimestamp(file)).toBe('2026-01-01T00:00:00.000Z');
    });
  });
});
