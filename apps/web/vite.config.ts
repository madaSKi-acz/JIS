import { defineConfig } from 'vite';

export default defineConfig({
  envDir: '../..',
  // GitHub Pages serves the site from /<repo>/; set BASE_PATH=/JIS/ when building for it.
  base: process.env.BASE_PATH ?? '/',
  // Pre-bundling moves maplibre-gl and breaks the relative URL it uses to load its worker.
  optimizeDeps: { exclude: ['maplibre-gl'] },
  worker: { format: 'es' },
});
