import { access, copyFile, mkdir, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { CAMBODIA_PBF_URL, ensureDownloaded } from './lib/download.ts';
import { extractLayers } from './lib/extract.ts';
import { pbfSource, readPbfTimestamp } from './lib/pbf.ts';

const DATA_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_INPUT = join(DATA_DIR, 'raw', 'cambodia-latest.osm.pbf');
const OUT_DIR = join(DATA_DIR, 'out');
const WEB_DATA_DIR = resolve(DATA_DIR, '..', 'apps', 'web', 'public', 'data');

const USAGE = `Usage: pnpm data:build [options]

  --input <file>        Use this .osm.pbf instead of data/raw/cambodia-latest.osm.pbf (never downloads)
  --refresh             Download a fresh extract even if the local copy is recent
  --offline             Never download; fail if the extract is missing
  --max-age-days <n>    Re-download when the local extract is older than this (default 7)
  -h, --help            Show this help`;

async function main() {
  const { values } = parseArgs({
    options: {
      input: { type: 'string' },
      refresh: { type: 'boolean', default: false },
      offline: { type: 'boolean', default: false },
      'max-age-days': { type: 'string', default: '7' },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });
  if (values.help) {
    console.log(USAGE);
    return;
  }

  const input = values.input ? resolve(values.input) : DEFAULT_INPUT;
  if (!values.input && !values.offline) {
    const maxAgeDays = Number(values['max-age-days']);
    if (!Number.isFinite(maxAgeDays) || maxAgeDays < 0)
      throw new Error('--max-age-days must be a number');
    console.log(`Checking extract: ${input}`);
    const status = await ensureDownloaded(CAMBODIA_PBF_URL, input, {
      maxAgeDays,
      force: values.refresh,
    });
    console.log(
      status === 'cached' ? '  using local copy' : `  downloaded from ${CAMBODIA_PBF_URL}`,
    );
  }

  try {
    await access(input);
  } catch {
    throw new Error(
      `Extract not found: ${input}\nDownload it from ${CAMBODIA_PBF_URL} into data/raw/, or run without --offline.`,
    );
  }

  const started = Date.now();
  console.log(`Reading ${basename(input)} ...`);
  const dataTimestamp = await readPbfTimestamp(input);
  const { layers, counts, skipped } = await extractLayers(pbfSource(input));

  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(WEB_DATA_DIR, { recursive: true });
  const files: Record<string, unknown> = {
    'tourism.geojson': layers.tourism,
    'transport.geojson': layers.transport,
    'meta.json': {
      generatedAt: new Date().toISOString(),
      dataTimestamp,
      source: values.input ? basename(input) : CAMBODIA_PBF_URL,
      attribution: '© OpenStreetMap contributors (ODbL)',
      counts,
    },
  };
  for (const [name, content] of Object.entries(files)) {
    const outPath = join(OUT_DIR, name);
    await writeFile(outPath, JSON.stringify(content));
    await copyFile(outPath, join(WEB_DATA_DIR, name));
  }

  console.log(
    `\nDone in ${((Date.now() - started) / 1000).toFixed(1)}s. Data as of ${dataTimestamp ?? 'unknown'}.`,
  );
  console.table(Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b))));
  if (skipped > 0)
    console.log(`${skipped} matched elements skipped (geometry outside the extract).`);
  console.log(`Wrote ${Object.keys(files).join(', ')} to data/out/ and apps/web/public/data/`);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
