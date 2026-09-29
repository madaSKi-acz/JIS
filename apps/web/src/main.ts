import 'maplibre-gl/dist/maplibre-gl.css';
import '@fontsource/noto-sans-khmer/400.css';
import './style.css';
import { loadConfig } from './config';
import { createMap } from './map/createMap';
import type { LabelLanguage } from './map/labels';

const config = loadConfig(import.meta.env);
const lang: LabelLanguage = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'km';
document.documentElement.lang = lang;

const container = document.querySelector<HTMLDivElement>('#map');
if (container) createMap(container, config, lang);
