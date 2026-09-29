import { describe, expect, it } from 'vitest';
import {
  collection,
  countByCategory,
  DataNotFoundError,
  filterByCategory,
  loadLayerData,
  splitByGeometry,
  type PlaceFeature,
} from './data';

const point = (category: string): PlaceFeature => ({
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [104, 11] },
  properties: { id: 'node/1', category },
});
const line = (category: string): PlaceFeature => ({
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
  properties: { id: 'way/1', category },
});

describe('splitByGeometry / filterByCategory / countByCategory', () => {
  const transport = collection([point('bus_stop'), line('bus_route'), point('airport')]);

  it('separates points from lines', () => {
    const { points, lines } = splitByGeometry(transport);
    expect(points.map((f) => f.properties.category)).toEqual(['bus_stop', 'airport']);
    expect(lines.map((f) => f.properties.category)).toEqual(['bus_route']);
  });

  it('keeps only enabled categories', () => {
    expect(filterByCategory(transport.features, new Set(['airport']))).toHaveLength(1);
  });

  it('counts features per category across layers', () => {
    expect(countByCategory({ tourism: collection([point('temple')]), transport })).toEqual({
      temple: 1,
      bus_stop: 1,
      bus_route: 1,
      airport: 1,
    });
  });
});

describe('loadLayerData', () => {
  const json = (body: unknown) =>
    new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } });

  it('loads both layers from the data URL', async () => {
    const urls: string[] = [];
    const fetchImpl = (async (url: string) => {
      urls.push(url);
      return json(collection([point('temple')]));
    }) as unknown as typeof fetch;
    const data = await loadLayerData('https://example.org/data', fetchImpl);
    expect(urls).toEqual([
      'https://example.org/data/tourism.geojson',
      'https://example.org/data/transport.geojson',
    ]);
    expect(data.tourism.features).toHaveLength(1);
  });

  it('reports missing data, including the dev server answering with index.html', async () => {
    const html = (async () =>
      new Response('<!doctype html>', {
        headers: { 'content-type': 'text/html' },
      })) as unknown as typeof fetch;
    await expect(loadLayerData('/data', html)).rejects.toBeInstanceOf(DataNotFoundError);
    const missing = (async () => new Response('', { status: 404 })) as unknown as typeof fetch;
    await expect(loadLayerData('/data', missing)).rejects.toBeInstanceOf(DataNotFoundError);
  });
});
