export interface AppConfig {
  dataUrl: string;
  basemapStyleUrl: string;
}

const DEFAULTS: AppConfig = {
  dataUrl: '/data',
  basemapStyleUrl: 'https://tiles.openfreemap.org/styles/liberty',
};

export function loadConfig(env: Record<string, string | undefined>): AppConfig {
  return {
    dataUrl: (env.VITE_DATA_URL || DEFAULTS.dataUrl).replace(/\/+$/, ''),
    basemapStyleUrl: env.VITE_BASEMAP_STYLE_URL || DEFAULTS.basemapStyleUrl,
  };
}
