import type { Map as MapLibreMap } from 'maplibre-gl';
// Maki icons, CC0 (https://github.com/mapbox/maki).
import airport from '@mapbox/maki/icons/airport.svg?raw';
import attraction from '@mapbox/maki/icons/attraction.svg?raw';
import bus from '@mapbox/maki/icons/bus.svg?raw';
import ferry from '@mapbox/maki/icons/ferry.svg?raw';
import lodging from '@mapbox/maki/icons/lodging.svg?raw';
import monument from '@mapbox/maki/icons/monument.svg?raw';
import museum from '@mapbox/maki/icons/museum.svg?raw';
import rail from '@mapbox/maki/icons/rail.svg?raw';
import buddhist from '@mapbox/maki/icons/religious-buddhist.svg?raw';
import viewpoint from '@mapbox/maki/icons/viewpoint.svg?raw';
import { CATEGORIES, FALLBACK_COLOR } from './categories';

export const MAKI: Record<string, string> = {
  airport,
  attraction,
  bus,
  ferry,
  lodging,
  monument,
  museum,
  rail,
  'religious-buddhist': buddhist,
  viewpoint,
};

/** Marker size in CSS pixels; images are drawn at 2x for sharp high-DPI screens. */
export const MARKER_SIZE = 26;
const PIXEL_RATIO = 2;

export const FALLBACK_ICON = 'jis-icon-fallback';
export const iconImageId = (category: string) => `jis-icon-${category}`;

/** The shapes inside a Maki SVG, without the outer <svg> element. */
export function svgBody(svg: string): string {
  return /<svg[^>]*>([\s\S]*)<\/svg>/.exec(svg)?.[1].trim() ?? '';
}

/** A coloured disc with a white outline and the (15×15) Maki icon in white on top. */
export function markerSvg(color: string, makiSvg?: string): string {
  const px = MARKER_SIZE * PIXEL_RATIO;
  const icon = makiSvg
    ? `<g transform="translate(5.5 5.5)" fill="#ffffff">${svgBody(makiSvg)}</g>`
    : '';
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 26 26">`,
    `<circle cx="13" cy="13" r="12" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>`,
    icon,
    `</svg>`,
  ].join('');
}

async function addSvgImage(map: MapLibreMap, id: string, svg: string): Promise<void> {
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  await img.decode();
  if (!map.hasImage(id)) map.addImage(id, img, { pixelRatio: PIXEL_RATIO });
}

/** Adds one marker image per point category, plus a plain one for anything else. */
export async function addMarkerImages(map: MapLibreMap): Promise<void> {
  await Promise.all([
    addSvgImage(map, FALLBACK_ICON, markerSvg(FALLBACK_COLOR)),
    ...CATEGORIES.filter((c) => c.icon).map((c) =>
      addSvgImage(map, iconImageId(c.id), markerSvg(c.color, MAKI[c.icon ?? ''])),
    ),
  ]);
}
