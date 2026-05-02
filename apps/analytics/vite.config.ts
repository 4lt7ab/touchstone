import { defineConfig } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  esbuild: {
    jsx: 'automatic',
  },
  server: {
    port: Number(process.env.PORT ?? 5174),
  },
});
