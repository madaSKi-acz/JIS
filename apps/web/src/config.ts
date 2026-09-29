export interface AppConfig {
  dataUrl: string;
  basemapStyleUrl: string;
}

const DEFAULT_BASEMAP = 'https://tiles.openfreemap.org/styles/liberty';

/** By default data sits next to the app, so it works at `/` locally and at `/JIS/` on GitHub Pages. */
export function loadConfig(env: Record<string, string | undefined>): AppConfig {
  const defaultDataUrl = `${env.BASE_URL ?? '/'}data`;
  return {
    dataUrl: (env.VITE_DATA_URL || defaultDataUrl).replace(/\/+$/, ''),
    basemapStyleUrl: env.VITE_BASEMAP_STYLE_URL || DEFAULT_BASEMAP,
  };
}
