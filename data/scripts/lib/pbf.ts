import { createOSMStream } from 'osm-pbf-parser-node';
import type { ElementSource, OsmElement } from './types.ts';

const OPTIONS = { withInfo: false, withTags: true };

export function pbfSource(path: string): ElementSource {
  return async function* () {
    for await (const item of createOSMStream(path, OPTIONS)) {
      if ('type' in (item as object)) yield item as OsmElement;
    }
  };
}

/** The extract's "data as of" time from the PBF header, if the file has one. */
export async function readPbfTimestamp(path: string): Promise<string | undefined> {
  for await (const item of createOSMStream(path, OPTIONS)) {
    const seconds = (item as { osmosis_replication_timestamp?: number })
      .osmosis_replication_timestamp;
    return seconds ? new Date(seconds * 1000).toISOString() : undefined;
  }
  return undefined;
}
