import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import WindiCSS from 'vite-plugin-windicss';

export default defineConfig({
  plugins: [sveltekit(), WindiCSS()],
});
