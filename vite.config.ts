import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest: manifest as any }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        sidepanel: 'src/sidepanel/index.html',
      },
    },
  },
  define: {
    'import.meta.env.VITE_LLM_ENDPOINT': JSON.stringify(process.env.VITE_LLM_ENDPOINT || ''),
    'import.meta.env.VITE_LLM_API_KEY': JSON.stringify(process.env.VITE_LLM_API_KEY || ''),
    'import.meta.env.VITE_LLM_MODEL': JSON.stringify(process.env.VITE_LLM_MODEL || 'gpt-4'),
  },
})
