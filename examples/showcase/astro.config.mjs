import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind()
  ],
  site: 'https://ai-portfolio-showcase.vercel.app',
  base: '/',
  output: 'static',
  compressHTML: true,
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto'
  },
  vite: {
    define: {
      __SITE_URL__: JSON.stringify('https://ai-portfolio-showcase.vercel.app')
    }
  }
});