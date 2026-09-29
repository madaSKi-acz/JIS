import 'maplibre-gl/dist/maplibre-gl.css';
import '@fontsource/noto-sans-khmer/400.css';
import './style.css';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { loadConfig } from './config';
import { t } from './i18n';
import { readStoredLanguage, resolveLanguage } from './language';
import { addDataLayers } from './layers/dataLayers';
import { countByCategory, DataNotFoundError, loadLayerData, type LayerData } from './layers/data';
import { createMap } from './map/createMap';
import type { LabelLanguage } from './map/labels';
import { RouteHighlight } from './routes/routeHighlight';
import { busRoutes, routeBounds } from './routes/routes';
import { LayerPanel } from './ui/layerPanel';
import { onePanelAtATimeOnPhones } from './ui/panels';
import { RoutePanel } from './ui/routePanel';

const config = loadConfig(import.meta.env);
const lang: LabelLanguage = resolveLanguage(location.search, readStoredLanguage());
document.documentElement.lang = lang;
document.title = t(lang, 'appTitle');

function showMessage(text: string, kind: 'error' | 'loading' = 'error'): HTMLElement {
  const box = document.createElement('div');
  box.className = `map-message map-message-${kind}`;
  box.setAttribute('role', kind === 'error' ? 'alert' : 'status');
  box.textContent = text;
  document.body.append(box);
  return box;
}

function setUpData(map: MapLibreMap, data: LayerData) {
  const routes = busRoutes(data);
  const routePanel = new RoutePanel(lang, routes, {
    onSelect(route) {
      layers.setDimmed(!!route);
      if (!route) {
        highlight.clear();
        return;
      }
      highlight.show(route);
      const bounds = routeBounds(route);
      if (bounds) map.fitBounds(bounds, { padding: 60, maxZoom: 15 });
    },
    onStopClick: (stop) => map.flyTo({ center: stop.coordinates, zoom: 16 }),
  });
  const layers = addDataLayers(map, data, lang, { onRouteClick: (id) => routePanel.select(id) });
  const highlight = new RouteHighlight(map, lang);

  map.addControl(
    new LayerPanel(lang, countByCategory(data), (enabled) => layers.setEnabledCategories(enabled)),
    'top-left',
  );
  if (routes.length > 0) map.addControl(routePanel, 'top-left');
  onePanelAtATimeOnPhones([...document.querySelectorAll<HTMLDetailsElement>('details.map-panel')]);
}

const container = document.querySelector<HTMLDivElement>('#map');
if (container) {
  const map = createMap(container, config, lang);
  const mapLoaded = new Promise<void>((resolve) => map.once('load', () => resolve()));

  const loading = showMessage(t(lang, 'loading'), 'loading');

  Promise.all([loadLayerData(config.dataUrl), mapLoaded])
    .then(([data]) => setUpData(map, data))
    .catch((err: unknown) => {
      console.error(err);
      showMessage(err instanceof DataNotFoundError ? t(lang, 'dataMissing') : String(err));
    })
    .finally(() => loading.remove());
}
