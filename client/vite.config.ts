import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '127.0.0.3',
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    manifest: false,
  },
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }
    ]
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/variables.scss";`
      }
    } 
  }
})
