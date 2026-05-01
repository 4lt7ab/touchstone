import { defineConfig } from 'tsup';
import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';

/**
 * Bespoke build for the umbrella. Unlike every other package, this one
 * **bundles** its workspace deps so the published artifact is self-contained:
 * leaf packages stay `private: true` and never reach npm — consumers install
 * `@4lt7ab/touchstone` and get atoms, themes, molecules, organisms, hooks,
 * icons, and tokens inside one tarball, plus a single concatenated `dist/index.css`.
 *
 * `@vanilla-extract/*` stays external (the umbrella declares it as a runtime
 * dependency), so the recipe runtime resolves through the consumer's
 * node_modules like any other library.
 */
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'es2022',
  dts: {
    resolve: [/^@touchstone\//],
    compilerOptions: {
      composite: false,
      incremental: false,
      declarationMap: false,
    },
  },
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  minify: false,
  external: ['react', 'react-dom'],
  esbuildPlugins: [vanillaExtractPlugin()],
});
