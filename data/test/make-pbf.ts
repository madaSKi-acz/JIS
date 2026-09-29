import { writeFile } from 'node:fs/promises';
import { osmBlockToPbfBlobBytes } from '@osmix/pbf';
import type { OsmElement, OsmNode, OsmRelation, OsmWay } from '../scripts/lib/types.ts';

const MEMBER_TYPE = { node: 0, way: 1, relation: 2 } as const;

function delta(values: number[]): number[] {
  return values.map((v, i) => (i === 0 ? v : v - values[i - 1]));
}

/** Writes elements to a real .osm.pbf file so tests exercise the actual PBF reader. */
export async function writePbf(
  path: string,
  elements: OsmElement[],
  timestamp?: number,
): Promise<void> {
  const strings = [''];
  const sid = (s: string) => {
    let i = strings.indexOf(s);
    if (i === -1) i = strings.push(s) - 1;
    return i;
  };
  const tagIds = (tags: Record<string, string> = {}) => {
    const keys: number[] = [];
    const vals: number[] = [];
    for (const [k, v] of Object.entries(tags)) {
      keys.push(sid(k));
      vals.push(sid(v));
    }
    return { keys, vals };
  };

  const nodes = elements.filter((e): e is OsmNode => e.type === 'node');
  const ways = elements.filter((e): e is OsmWay => e.type === 'way');
  const relations = elements.filter((e): e is OsmRelation => e.type === 'relation');

  const keysVals: number[] = [];
  for (const n of nodes) {
    const { keys, vals } = tagIds(n.tags);
    keys.forEach((k, i) => keysVals.push(k, vals[i]));
    keysVals.push(0);
  }

  const groups = [
    {
      nodes: [],
      ways: [],
      relations: [],
      dense: {
        id: delta(nodes.map((n) => n.id)),
        lat: delta(nodes.map((n) => Math.round(n.lat * 1e7))),
        lon: delta(nodes.map((n) => Math.round(n.lon * 1e7))),
        keys_vals: keysVals,
      },
    },
    {
      nodes: [],
      relations: [],
      ways: ways.map((w) => ({ id: w.id, ...tagIds(w.tags), refs: delta(w.refs) })),
    },
    {
      nodes: [],
      ways: [],
      relations: relations.map((r) => ({
        id: r.id,
        ...tagIds(r.tags),
        roles_sid: r.members.map((m) => sid(m.role)),
        memids: delta(r.members.map((m) => m.ref)),
        types: r.members.map((m) => MEMBER_TYPE[m.type]),
      })),
    },
  ];

  const header = await osmBlockToPbfBlobBytes({
    required_features: ['OsmSchema-V0.6', 'DenseNodes'],
    optional_features: [],
    ...(timestamp ? { osmosis_replication_timestamp: timestamp } : {}),
  });
  const data = await osmBlockToPbfBlobBytes({
    stringtable: strings.map((s) => new TextEncoder().encode(s)),
    primitivegroup: groups,
  });
  await writeFile(path, Buffer.concat([header, data]));
}
