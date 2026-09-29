import { describe, expect, it } from 'vitest';
import { loadConfig } from './config';

describe('loadConfig', () => {
  it('uses defaults when env is empty', () => {
    expect(loadConfig({})).toEqual({
      dataUrl: '/data',
      basemapStyleUrl: 'https://tiles.openfreemap.org/styles/liberty',
    });
  });

  it('reads values from env and strips trailing slashes from the data URL', () => {
    const config = loadConfig({
      VITE_DATA_URL: 'https://example.org/jis-data/',
      VITE_BASEMAP_STYLE_URL: 'https://example.org/style.json',
    });
    expect(config.dataUrl).toBe('https://example.org/jis-data');
    expect(config.basemapStyleUrl).toBe('https://example.org/style.json');
  });

  it('puts data next to the app when it is served from a sub-path', () => {
    expect(loadConfig({ BASE_URL: '/JIS/' }).dataUrl).toBe('/JIS/data');
  });
});
