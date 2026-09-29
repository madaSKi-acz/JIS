export type LonLat = [number, number];

export function round6(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

export function roundCoord([lon, lat]: LonLat): LonLat {
  return [round6(lon), round6(lat)];
}

/** Average of a way's vertices; the repeated closing vertex of a ring is counted once. */
export function centerOf(coords: LonLat[]): LonLat | undefined {
  if (coords.length === 0) return undefined;
  const first = coords[0];
  const last = coords[coords.length - 1];
  const points =
    coords.length > 1 && first[0] === last[0] && first[1] === last[1]
      ? coords.slice(0, -1)
      : coords;
  let lon = 0;
  let lat = 0;
  for (const [x, y] of points) {
    lon += x;
    lat += y;
  }
  return roundCoord([lon / points.length, lat / points.length]);
}
