import { describe, expect, it } from 'vitest';
import { centerOf, roundCoord } from './geometry.ts';

describe('centerOf', () => {
  it('counts the closing vertex of a ring once', () => {
    expect(
      centerOf([
        [0, 0],
        [4, 0],
        [4, 4],
        [0, 4],
        [0, 0],
      ]),
    ).toEqual([2, 2]);
  });

  it('averages an open line and handles a single point', () => {
    expect(
      centerOf([
        [0, 0],
        [2, 2],
      ]),
    ).toEqual([1, 1]);
    expect(centerOf([[1, 2]])).toEqual([1, 2]);
  });

  it('returns undefined for no coordinates', () => {
    expect(centerOf([])).toBeUndefined();
  });
});

describe('roundCoord', () => {
  it('rounds to 6 decimals', () => {
    expect(roundCoord([104.12345678, 11.98765432])).toEqual([104.123457, 11.987654]);
  });
});
