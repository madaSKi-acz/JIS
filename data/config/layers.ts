/**
 * Which OpenStreetMap tags go into which map layer.
 *
 * Rules are checked top to bottom and the first match wins.
 * `match` lists tags that must ALL be present: a list of allowed values, or '*' for any value.
 * Tag reference: https://wiki.openstreetmap.org/wiki/Map_features
 */

export type LayerId = 'tourism' | 'transport';

/**
 * - `point`: nodes, ways and multipolygon relations, shown as map markers
 * - `line`: ways drawn as lines (ferry crossings, railway tracks)
 * - `route`: route relations (e.g. a bus line made of many road segments)
 */
export type GeometryKind = 'point' | 'line' | 'route';

export interface LayerRule {
  layer: LayerId;
  category: string;
  kind: GeometryKind;
  match: Record<string, string[] | '*'>;
}

export const LAYER_RULES: LayerRule[] = [
  // --- tourism ---
  {
    layer: 'tourism',
    category: 'heritage',
    kind: 'point',
    match: { historic: ['archaeological_site', 'ruins', 'monument', 'temple'] },
  },
  {
    layer: 'tourism',
    category: 'temple',
    kind: 'point',
    match: { amenity: ['place_of_worship'], religion: ['buddhist'] },
  },
  {
    layer: 'tourism',
    category: 'museum',
    kind: 'point',
    match: { tourism: ['museum', 'gallery'] },
  },
  {
    layer: 'tourism',
    category: 'attraction',
    kind: 'point',
    match: { tourism: ['attraction', 'theme_park', 'zoo', 'aquarium'] },
  },
  { layer: 'tourism', category: 'viewpoint', kind: 'point', match: { tourism: ['viewpoint'] } },
  {
    layer: 'tourism',
    category: 'accommodation',
    kind: 'point',
    match: { tourism: ['hotel', 'guest_house', 'hostel', 'motel', 'resort', 'apartment'] },
  },

  // --- transport: stops and stations ---
  { layer: 'transport', category: 'bus_stop', kind: 'point', match: { highway: ['bus_stop'] } },
  {
    layer: 'transport',
    category: 'bus_stop',
    kind: 'point',
    match: { public_transport: ['platform'], bus: ['yes'] },
  },
  {
    layer: 'transport',
    category: 'bus_station',
    kind: 'point',
    match: { amenity: ['bus_station'] },
  },
  {
    layer: 'transport',
    category: 'train_station',
    kind: 'point',
    match: { railway: ['station', 'halt'] },
  },
  {
    layer: 'transport',
    category: 'ferry_terminal',
    kind: 'point',
    match: { amenity: ['ferry_terminal'] },
  },
  // Only airports with an IATA code, so small private airstrips are left out.
  {
    layer: 'transport',
    category: 'airport',
    kind: 'point',
    match: { aeroway: ['aerodrome'], iata: '*' },
  },

  // --- transport: lines (single ways) ---
  { layer: 'transport', category: 'ferry_route', kind: 'line', match: { route: ['ferry'] } },
  { layer: 'transport', category: 'railway', kind: 'line', match: { railway: ['rail'] } },

  // --- transport: routes (relations with type=route) ---
  {
    layer: 'transport',
    category: 'bus_route',
    kind: 'route',
    match: { type: ['route'], route: ['bus'] },
  },
  {
    layer: 'transport',
    category: 'ferry_route',
    kind: 'route',
    match: { type: ['route'], route: ['ferry'] },
  },
  {
    layer: 'transport',
    category: 'train_route',
    kind: 'route',
    match: { type: ['route'], route: ['train'] },
  },
];

/** Tags copied into feature properties when present (besides name, name:km, name:en). */
export const EXTRA_PROPERTIES = [
  'opening_hours',
  'website',
  'phone',
  'operator',
  'ref',
  'network',
  'from',
  'to',
  'wikipedia',
] as const;
