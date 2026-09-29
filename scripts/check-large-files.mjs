#!/usr/bin/env node
// Fails if any git-tracked file exceeds the size limit. Map data belongs in data/out (gitignored).
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const MAX_BYTES = 10 * 1024 * 1024;

export function findLargeFiles(files, sizeOf, maxBytes = MAX_BYTES) {
  return files.map((path) => ({ path, size: sizeOf(path) })).filter((f) => f.size > maxBytes);
}

function trackedFiles() {
  return execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
}

function sizeOnDisk(path) {
  try {
    return statSync(path).size;
  } catch {
    return 0; // deleted in the working tree
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const large = findLargeFiles(trackedFiles(), sizeOnDisk);
  if (large.length > 0) {
    console.error(`Files larger than ${MAX_BYTES / 1024 / 1024} MB are not allowed in the repo:`);
    for (const f of large) console.error(`  ${f.path} (${(f.size / 1024 / 1024).toFixed(1)} MB)`);
    console.error('Generated map data goes in data/out/ (gitignored). See CONTRIBUTING.md.');
    process.exit(1);
  }
  console.log('No large files found.');
}
