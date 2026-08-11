import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cloudflare } from '@cloudflare/vite-plugin'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), cloudflare()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('./shared', import.meta.url)),
    },
  },
  build: {
    // Stroke data and the kana set are large-ish static payloads; keep them in
    // their own chunks so the app shell stays small on first paint.
    rollupOptions: {
      output: {
        manualChunks: {
          fsrs: ['ts-fsrs'],
        },
      },
    },
  },
})
