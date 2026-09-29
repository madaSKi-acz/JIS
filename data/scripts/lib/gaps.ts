import type { FeatureCollection, MultiLineString, Point } from 'geojson';
import type { FeatureProperties } from './properties.ts';

const KHMER = /[ក-៿]/;
const OSM = 'https://www.openstreetmap.org';

export interface DataGaps {
  /** Bus stops with no Khmer name, neither in `name:km` nor in a Khmer `name`. */
  stopsWithoutKhmerName: FeatureProperties[];
  /** Bus routes whose relation has no stop or platform members. */
  routesWithoutStops: FeatureProperties[];
}

/** Finds data worth fixing in OpenStreetMap (see issues "good first issue" + "data"). */
export function findDataGaps(
  transport: FeatureCollection<Point | MultiLineString, FeatureProperties>,
): DataGaps {
  const props = transport.features.map((f) => f.properties);
  return {
    stopsWithoutKhmerName: props.filter(
      (p) => p.category === 'bus_stop' && !p.name_km && !KHMER.test(p.name ?? ''),
    ),
    routesWithoutStops: props.filter((p) => p.category === 'bus_route' && !p.stops?.length),
  };
}

const osmLink = (p: FeatureProperties) => `[${p.id}](${OSM}/${p.id})`;
const label = (p: FeatureProperties) =>
  [p.ref, p.name ?? p.name_en].filter(Boolean).join(' ') || 'unnamed';

/** A Markdown checklist that contributors can work through. */
export function gapsReport(gaps: DataGaps, dataTimestamp?: string): string {
  const lines = [
    '# Data to fix in OpenStreetMap',
    '',
    `Data as of ${dataTimestamp ?? 'unknown'}. Guide: docs/fix-data-in-osm.md`,
    '',
    `## Bus lines without stops (${gaps.routesWithoutStops.length})`,
    '',
    'Add each stop to the route relation, in the order the bus visits them, with role `platform`.',
    '',
    ...gaps.routesWithoutStops.map((p) => `- [ ] ${label(p)}: ${osmLink(p)}`),
    '',
    `## Bus stops without a Khmer name (${gaps.stopsWithoutKhmerName.length})`,
    '',
    'Add a `name:km` tag.',
    '',
    ...gaps.stopsWithoutKhmerName.map((p) => `- [ ] ${label(p)}: ${osmLink(p)}`),
    '',
  ];
  return lines.join('\n');
}
