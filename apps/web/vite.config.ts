import { defineConfig } from 'vite';

export default defineConfig({
  envDir: '../..',
  // Pre-bundling moves maplibre-gl and breaks the relative URL it uses to load its worker.
  optimizeDeps: { exclude: ['maplibre-gl'] },
  worker: { format: 'es' },
});
