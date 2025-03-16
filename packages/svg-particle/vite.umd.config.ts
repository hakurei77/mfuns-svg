import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist/umd',
    lib: {
      entry: resolve('./src/index.ts'),
      name: 'SVGParticle',
      fileName: 'index',
      formats: ['umd'],
    },
    rollupOptions: {
      output: {
        exports: 'named'
      },
    },
  },
});
