import { defineConfig } from 'vite'

export default defineConfig({
  // Relative base so the built site works on any host (GitHub Pages subpaths included)
  base: './',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
  },
})
