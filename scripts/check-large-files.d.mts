export const MAX_BYTES: number;
export function findLargeFiles(
  files: string[],
  sizeOf: (path: string) => number,
  maxBytes?: number,
): { path: string; size: number }[];
