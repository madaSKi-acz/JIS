import { mkdtemp, readFile, rm, utimes, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ensureDownloaded } from './download.ts';

const DAY = 24 * 60 * 60 * 1000;

describe('ensureDownloaded', () => {
  let dir: string;
  let file: string;
  const okFetch = () => vi.fn(async () => new Response('new data')) as unknown as typeof fetch;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'jis-dl-'));
    file = join(dir, 'raw', 'extract.osm.pbf');
  });
  afterEach(() => rm(dir, { recursive: true, force: true }));

  it('downloads when the file is missing', async () => {
    const fetchImpl = okFetch();
    expect(await ensureDownloaded('https://x/y', file, { maxAgeDays: 7, fetchImpl })).toBe(
      'downloaded',
    );
    expect(await readFile(file, 'utf8')).toBe('new data');
  });

  it('keeps a recent local copy', async () => {
    await ensureDownloaded('https://x/y', file, { maxAgeDays: 7, fetchImpl: okFetch() });
    const fetchImpl = okFetch();
    expect(await ensureDownloaded('https://x/y', file, { maxAgeDays: 7, fetchImpl })).toBe(
      'cached',
    );
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('re-downloads a stale copy or when forced', async () => {
    await ensureDownloaded('https://x/y', file, { maxAgeDays: 7, fetchImpl: okFetch() });
    const old = new Date(Date.now() - 8 * DAY);
    await utimes(file, old, old);
    expect(
      await ensureDownloaded('https://x/y', file, { maxAgeDays: 7, fetchImpl: okFetch() }),
    ).toBe('downloaded');
    expect(
      await ensureDownloaded('https://x/y', file, {
        maxAgeDays: 7,
        force: true,
        fetchImpl: okFetch(),
      }),
    ).toBe('downloaded');
  });

  it('leaves the existing file untouched when the download fails', async () => {
    await ensureDownloaded('https://x/y', file, { maxAgeDays: 7, fetchImpl: okFetch() });
    await writeFile(file, 'old data');
    const failing = vi.fn(
      async () => new Response('nope', { status: 503 }),
    ) as unknown as typeof fetch;
    await expect(
      ensureDownloaded('https://x/y', file, { maxAgeDays: 7, force: true, fetchImpl: failing }),
    ).rejects.toThrow('503');
    expect(await readFile(file, 'utf8')).toBe('old data');
  });
});
