import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/playground/',
  plugins: [
    vue(),
    WindiCSS(),
  ],
  build: {
    rollupOptions: {
      // plugins: [visualizer({ gzipSize: true })],
    }
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
})
