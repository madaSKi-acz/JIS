import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['apps/**/*.test.ts', 'data/**/*.test.ts', 'scripts/**/*.test.ts'],
  },
});
