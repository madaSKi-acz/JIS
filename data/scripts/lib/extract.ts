import type { Feature, FeatureCollection, MultiLineString, Point } from 'geojson';
import { LAYER_RULES, type LayerId, type LayerRule } from '../../config/layers.ts';
import { classify } from './classify.ts';
import { centerOf, roundCoord, type LonLat } from './geometry.ts';
import {
  buildProperties,
  namesFrom,
  type FeatureProperties,
  type RouteStop,
} from './properties.ts';
import type { ElementSource, OsmRelation, OsmWay } from './types.ts';

export type LayerFeature = Feature<Point | MultiLineString, FeatureProperties>;

export interface ExtractResult {
  layers: Record<LayerId, FeatureCollection<Point | MultiLineString, FeatureProperties>>;
  /** Feature count per `layer/category`, e.g. `tourism/temple`. */
  counts: Record<string, number>;
  /** Matched elements dropped because their geometry was missing from the extract. */
  skipped: number;
}

interface Matched<T> {
  element: T;
  rule: LayerRule;
}

function geometryWays(relation: OsmRelation, rule: LayerRule): number[] {
  return relation.members
    .filter((m) => m.type === 'way')
    .filter((m) =>
      rule.kind === 'route' ? !m.role.startsWith('platform') : m.role === 'outer' || m.role === '',
    )
    .map((m) => m.ref);
}

const PLATFORM_ROLE = /^platform/;
const STOP_ROLE = /^stop/;

/**
 * A route usually lists each stop twice: the stop position on the road and the platform beside
 * it. Use platforms when the route has any, otherwise stop positions, so each stop appears once.
 */
export function routeStopIds(relation: OsmRelation): number[] {
  const nodes = relation.members.filter((m) => m.type === 'node');
  const platforms = nodes.filter((m) => PLATFORM_ROLE.test(m.role));
  const chosen = platforms.length > 0 ? platforms : nodes.filter((m) => STOP_ROLE.test(m.role));
  return chosen.map((m) => m.ref).filter((id, i, ids) => id !== ids[i - 1]);
}

/**
 * Reads the source three times (relations, then ways, then nodes) so that only the
 * node coordinates actually needed are kept in memory.
 */
export async function extractLayers(
  source: ElementSource,
  rules: LayerRule[] = LAYER_RULES,
): Promise<ExtractResult> {
  const relations: Matched<OsmRelation>[] = [];
  const neededWays = new Set<number>();
  const stopNodes = new Set<number>();
  for await (const el of source()) {
    if (el.type !== 'relation') continue;
    const rule = classify(el, rules);
    if (!rule) continue;
    relations.push({ element: el, rule });
    for (const id of geometryWays(el, rule)) neededWays.add(id);
    if (rule.kind === 'route') for (const id of routeStopIds(el)) stopNodes.add(id);
  }

  const ways: Matched<OsmWay>[] = [];
  const wayRefs = new Map<number, number[]>();
  const neededNodes = new Set<number>();
  for await (const el of source()) {
    if (el.type !== 'way') continue;
    const rule = classify(el, rules);
    if (rule) ways.push({ element: el, rule });
    if (rule || neededWays.has(el.id)) {
      wayRefs.set(el.id, el.refs);
      for (const ref of el.refs) neededNodes.add(ref);
    }
  }

  const layers: ExtractResult['layers'] = {
    tourism: { type: 'FeatureCollection', features: [] },
    transport: { type: 'FeatureCollection', features: [] },
  };
  const counts: Record<string, number> = {};
  const add = (feature: LayerFeature, rule: LayerRule) => {
    layers[rule.layer].features.push(feature);
    const key = `${rule.layer}/${rule.category}`;
    counts[key] = (counts[key] ?? 0) + 1;
  };
  const point = (coordinates: LonLat): Point => ({ type: 'Point', coordinates });

  const nodeCoords = new Map<number, LonLat>();
  const stops = new Map<number, RouteStop>();
  for await (const el of source()) {
    if (el.type !== 'node') continue;
    if (neededNodes.has(el.id)) nodeCoords.set(el.id, [el.lon, el.lat]);
    if (stopNodes.has(el.id)) {
      stops.set(el.id, {
        id: `node/${el.id}`,
        ...namesFrom(el.tags ?? {}),
        coordinates: roundCoord([el.lon, el.lat]),
      });
    }
    const rule = classify(el, rules);
    if (rule && el.tags) {
      add(
        {
          type: 'Feature',
          geometry: point(roundCoord([el.lon, el.lat])),
          properties: buildProperties(el, rule, el.tags),
        },
        rule,
      );
    }
  }

  const coordsOfWay = (id: number): LonLat[] =>
    (wayRefs.get(id) ?? []).flatMap((ref) => {
      const c = nodeCoords.get(ref);
      return c ? [c] : [];
    });

  let skipped = 0;

  for (const { element, rule } of ways) {
    const coords = coordsOfWay(element.id);
    let geometry: Point | MultiLineString | undefined;
    if (rule.kind === 'line') {
      if (coords.length >= 2)
        geometry = { type: 'MultiLineString', coordinates: [coords.map(roundCoord)] };
    } else {
      const center = centerOf(coords);
      if (center) geometry = point(center);
    }
    if (!geometry || !element.tags) {
      skipped++;
      continue;
    }
    add(
      {
        type: 'Feature',
        geometry,
        properties: buildProperties(element, rule, element.tags),
      },
      rule,
    );
  }

  for (const { element, rule } of relations) {
    const memberWays = geometryWays(element, rule);
    let geometry: Point | MultiLineString | undefined;
    if (rule.kind === 'point') {
      const center = centerOf(memberWays.flatMap(coordsOfWay));
      if (center) geometry = point(center);
    } else {
      const lines = memberWays
        .map((id) => coordsOfWay(id).map(roundCoord))
        .filter((line) => line.length >= 2);
      if (lines.length > 0) geometry = { type: 'MultiLineString', coordinates: lines };
    }
    if (!geometry || !element.tags) {
      skipped++;
      continue;
    }
    const properties = buildProperties(element, rule, element.tags);
    if (rule.kind === 'route') {
      const routeStops = routeStopIds(element).flatMap((id) => stops.get(id) ?? []);
      if (routeStops.length > 0) properties.stops = routeStops;
    }
    add({ type: 'Feature', geometry, properties }, rule);
  }

  return { layers, counts, skipped };
}
