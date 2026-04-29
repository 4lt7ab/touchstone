import { defineConfig } from 'tsup';
import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';

/**
 * Shared tsup preset for @touchstone/* packages.
 *
 * Each package can call `createConfig({ entry, external })` from its own
 * `tsup.config.ts` to get a consistent build:
 *   - ESM only
 *   - emits .d.ts via tsup
 *   - vanilla-extract .css.ts files compile to a single dist/styles.css
 *   - react / react-dom always external
 *
 * The `dts.compilerOptions` override turns off composite/incremental at the
 * tsup layer; the package tsconfig keeps composite=true so `tsc -b` from the
 * root drives a fast, project-reference-aware typecheck.
 */
export function createConfig(options = {}) {
  const { entry = ['src/index.ts'], external = [] } = options;

  return defineConfig({
    entry,
    format: ['esm'],
    target: 'es2022',
    dts: {
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
    external: ['react', 'react-dom', /^@touchstone\//, ...external],
    esbuildPlugins: [vanillaExtractPlugin()],
  });
}
