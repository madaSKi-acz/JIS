import { createWriteStream } from 'node:fs';
import { mkdir, rename, rm, stat } from 'node:fs/promises';
import { dirname } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import type { ReadableStream } from 'node:stream/web';

export const CAMBODIA_PBF_URL = 'https://download.geofabrik.de/asia/cambodia-latest.osm.pbf';

export interface DownloadOptions {
  maxAgeDays: number;
  force?: boolean;
  fetchImpl?: typeof fetch;
  now?: number;
}

export async function isFresh(
  path: string,
  maxAgeDays: number,
  now = Date.now(),
): Promise<boolean> {
  try {
    const { mtimeMs } = await stat(path);
    return now - mtimeMs < maxAgeDays * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

/** Downloads `url` to `path` unless a recent enough copy is already there. */
export async function ensureDownloaded(
  url: string,
  path: string,
  { maxAgeDays, force = false, fetchImpl = fetch, now = Date.now() }: DownloadOptions,
): Promise<'cached' | 'downloaded'> {
  if (!force && (await isFresh(path, maxAgeDays, now))) return 'cached';

  const res = await fetchImpl(url);
  if (!res.ok || !res.body)
    throw new Error(`Download failed: ${res.status} ${res.statusText} (${url})`);

  await mkdir(dirname(path), { recursive: true });
  const partial = `${path}.part`;
  try {
    await pipeline(Readable.fromWeb(res.body as ReadableStream), createWriteStream(partial));
    await rename(partial, path);
  } catch (err) {
    await rm(partial, { force: true });
    throw err;
  }
  return 'downloaded';
}
