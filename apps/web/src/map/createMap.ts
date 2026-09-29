import { Map as MapLibreMap, NavigationControl, ScaleControl, setWorkerUrl } from 'maplibre-gl';
// MapLibre computes its worker URL at runtime, so the bundler must be told to ship the worker.
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import khmerRegular from '@fontsource/noto-sans-khmer/files/noto-sans-khmer-khmer-400-normal.woff2?url';
import khmerBold from '@fontsource/noto-sans-khmer/files/noto-sans-khmer-khmer-700-normal.woff2?url';
import type { AppConfig } from '../config';
import { LanguageSwitch } from '../ui/languageSwitch';
import { khmerFontFaces, textFontNames } from './fonts';
import { labelExpression, nameLabelLayerIds, type LabelLanguage } from './labels';
import { addOutsideMask } from './outsideMask';
import { basemapPoiChanges } from './basemapPois';

/** Fonts used by our own data layers (see layers/dataLayers.ts). */
const DATA_LAYER_FONTS = ['Noto Sans Regular', 'Noto Sans Bold'];

const CAMBODIA_CENTER: [number, number] = [104.9, 12.6];
const CAMBODIA_BOUNDS: [[number, number], [number, number]] = [
  [100.5, 8.5],
  [109.5, 15.5],
];

setWorkerUrl(workerUrl);

export function createMap(
  container: HTMLElement,
  config: AppConfig,
  lang: LabelLanguage,
): MapLibreMap {
  const map = new MapLibreMap({
    container,
    style: config.basemapStyleUrl,
    center: CAMBODIA_CENTER,
    zoom: 6.3,
    minZoom: 5,
    maxBounds: CAMBODIA_BOUNDS,
    hash: true,
    attributionControl: { compact: true },
  });

  map.addControl(new LanguageSwitch(lang), 'top-right');
  map.addControl(new NavigationControl(), 'top-right');
  map.addControl(new ScaleControl(), 'bottom-left');

  map.once('style.load', () => {
    const layers = map.getStyle().layers;
    const fontNames = new Set([...textFontNames(layers), ...DATA_LAYER_FONTS]);
    map.setFontFaces(khmerFontFaces([...fontNames], { regular: khmerRegular, bold: khmerBold }));
    for (const id of nameLabelLayerIds(layers)) {
      map.setLayoutProperty(id, 'text-field', labelExpression(lang));
    }
    const pois = basemapPoiChanges(layers);
    for (const id of pois.hide) map.setLayoutProperty(id, 'visibility', 'none');
    for (const [id, filter] of Object.entries(pois.filters)) map.setFilter(id, filter);
    addOutsideMask(map);
  });

  return map;
}
