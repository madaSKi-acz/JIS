import 'maplibre-gl/dist/maplibre-gl.css';
import '@fontsource/noto-sans-khmer/400.css';
import './style.css';
import { loadConfig } from './config';
import { t } from './i18n';
import { addDataLayers } from './layers/dataLayers';
import { countByCategory, DataNotFoundError, loadLayerData } from './layers/data';
import { createMap } from './map/createMap';
import type { LabelLanguage } from './map/labels';
import { LayerPanel } from './ui/layerPanel';

const config = loadConfig(import.meta.env);
const lang: LabelLanguage = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'km';
document.documentElement.lang = lang;

function showMessage(text: string) {
  const box = document.createElement('div');
  box.className = 'map-message';
  box.setAttribute('role', 'alert');
  box.textContent = text;
  document.body.append(box);
}

const container = document.querySelector<HTMLDivElement>('#map');
if (container) {
  const map = createMap(container, config, lang);
  const mapLoaded = new Promise<void>((resolve) => map.once('load', () => resolve()));

  Promise.all([loadLayerData(config.dataUrl), mapLoaded])
    .then(([data]) => {
      const layers = addDataLayers(map, data, lang);
      map.addControl(
        new LayerPanel(lang, countByCategory(data), (enabled) =>
          layers.setEnabledCategories(enabled),
        ),
        'top-left',
      );
    })
    .catch((err: unknown) => {
      console.error(err);
      showMessage(err instanceof DataNotFoundError ? t(lang, 'dataMissing') : String(err));
    });
}
