import { describe, expect, it } from 'vitest';
import { findLargeFiles, MAX_BYTES } from './check-large-files.mjs';

describe('findLargeFiles', () => {
  it('returns only files over the limit', () => {
    const sizes: Record<string, number> = {
      'a.ts': 100,
      'big.geojson': MAX_BYTES + 1,
      'edge.bin': MAX_BYTES,
    };
    const result = findLargeFiles(Object.keys(sizes), (p: string) => sizes[p]);
    expect(result).toEqual([{ path: 'big.geojson', size: MAX_BYTES + 1 }]);
  });

  it('returns nothing when all files are small', () => {
    expect(findLargeFiles(['a', 'b'], () => 1)).toEqual([]);
  });
});
