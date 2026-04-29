# Touchstone

A React component library that is the team's measure of quality. A Bun + workspaces monorepo of atomic-design layers (tokens → themes → atoms → molecules → organisms) re-exported through the umbrella `@touchstone/react` package, with Storybook for docs and visual QA.

## Layout

```
touchstone/
├── .tool-versions          asdf pins (nodejs, bun)
├── package.json            bun workspace root + repo-wide scripts
├── tsconfig.json           solution-style root with project references
├── tsconfig.base.json      shared strict TS settings
├── eslint.config.js        flat ESLint config root
├── .prettierrc             repo-wide formatter config
├── packages/               workspace members (the library itself)
│   ├── tokens/             raw scales (color, space, font, radius, zIndex)
│   ├── themes/             theme contract + light/dark presets (vanilla-extract)
│   ├── icons/              icon components
│   ├── hooks/              shared hooks (useMergedRefs, useControllableState)
│   ├── atoms/              Box, Text, Button, Input
│   ├── molecules/          Field
│   ├── organisms/          placeholder for future organisms
│   └── react/              umbrella re-export — install this
├── apps/
│   └── storybook/          docs and visual QA for every package
└── tooling/                shared build/lint config (not published)
    ├── tsconfig/           base + library tsconfigs
    ├── eslint-config/      shared ESLint flat config
    └── tsup-config/        shared tsup preset (vanilla-extract aware)
```

Every library package follows the same shape: `package.json`, `src/`, `tsup.config.ts`, `tsconfig.json`, and (where applicable) `vitest.config.ts` + `vitest.setup.ts`. Inter-package deps go through `workspace:*` ranges in `dependencies`.

## Bootstrap

These tool versions and install steps are not runnable from inside Claude — paste them yourself.

```bash
# from the repo root, with asdf already installed:
asdf plugin add nodejs || true
asdf plugin add bun || true
asdf install

# install all workspace deps:
bun install
```

The repo pins `bun@1.3.11` via the root `packageManager` field and `nodejs 22.11.0` via `.tool-versions`. The `engines` field requires `node >=20` and `bun >=1.3`.

## Common commands

```bash
bun install              # install all workspace deps
bun run build            # build every package (`bun run --filter '*' build`)
bun run dev              # tsup --watch in every buildable package
bun run test             # vitest run in every package
bun run typecheck        # tsc -b --pretty (solution-style build)
bun run lint             # eslint in every package
bun run storybook        # storybook dev server on :6006
bun run build-storybook  # storybook static export
bun run format           # prettier --write across the repo
bun run format:check     # prettier --check across the repo
bun run clean            # rm dist + node_modules everywhere
```

`bun run --filter '*' <task>` walks the workspace dependency graph topologically, so layers build in order (tokens → themes → atoms → molecules → react). There is no Turbo-style cross-run cache — every invocation re-runs from scratch. Run a single package's task with `bun run --filter @touchstone/atoms test`.

## Build flow

Each library package is built with `tsup` using the shared preset at `tooling/tsup-config/index.js`:

- ESM only, target `es2022`
- `.d.ts` emitted by tsup (the source-of-truth typecheck still runs through `tsc -b` from the root)
- vanilla-extract `*.css.ts` files are compiled by `@vanilla-extract/esbuild-plugin` into a single `dist/index.css` — packages that ship styles expose them at the `./styles.css` subpath export and set `sideEffects: ["**/*.css", "**/*.css.js"]` so the CSS survives consumer tree-shaking
- `react`, `react-dom`, and any `@touchstone/*` import are always external, so workspace deps stay un-bundled and the umbrella package composes via re-export rather than re-bundle

`tsc -b` from the root drives the project-reference graph defined in `tsconfig.json`. Each package's tsconfig keeps `composite: true`; the tsup `dts` build overrides composite/incremental so it can emit cleanly without fighting the solution build.

## Architecture conventions

- **Atomic-design layering is enforced by dependency direction.** tokens → themes → atoms → molecules → organisms → react. Never import upward (an atom must not import a molecule), and never sideways across siblings without a real reason.
- **`@touchstone/react` is the only package consumers should install.** It re-exports every other package; the leaf packages can still be installed individually but that is a deliberate choice, not a default. The umbrella's `src/index.ts` is the public surface — anything not re-exported from there is implementation detail.
- **Theming flows through one place.** `@touchstone/themes` defines the `vars` contract via `createThemeContract`, plus `lightTheme` / `darkTheme` class-based presets. Everything visual reads from `vars.*` — components must not hardcode colors, spacing, font scales, radii, or z-indices.
- **Styling is vanilla-extract recipes.** Variants, sizes, and stateful styles live in `*.css.ts` next to the component. Recipes (`@vanilla-extract/recipes`) handle variant props; raw `style`/`globalStyle` is reserved for things recipes can't express.
- **Accessible primitives come from Radix.** When a component needs focus management, dismiss/escape behavior, or composed semantics, reach for `@radix-ui/react-*` (and `@radix-ui/react-slot` for `asChild` composition) before rolling our own.
- **Storybook is the QA surface.** Every component should have a story under `apps/storybook` covering its variants and a11y states. `addon-a11y` and `addon-themes` are wired up in `.storybook/main.ts` — use them.

## Adding a new package

1. `mkdir -p packages/<name>/src` and create `tsconfig.json`, `tsup.config.ts`, and a `package.json` mirroring an existing leaf package (e.g. `packages/atoms`).
2. Set `"name": "@touchstone/<name>"`, `"type": "module"`, the same `exports` block, and `sideEffects` if the package ships CSS.
3. Add it as a `workspace:*` dependency wherever it should be consumed; if it should be re-exported from the umbrella, add the export in `packages/react/src/index.ts`.
4. Add a `{ "path": "./packages/<name>" }` reference in the root `tsconfig.json` so it joins the solution build.
5. `bun install` to register it in the workspace.

## Adding a new component

1. Create a folder under the appropriate atomic-design layer (`packages/atoms/src/Foo/`, `packages/molecules/src/Foo/`, etc.).
2. Component in `Foo.tsx`, recipe in `Foo.css.ts`, public surface re-exported from the package's `src/index.ts`.
3. Read all visual values from `vars.*` (no hardcoded design tokens). Compose Radix primitives where applicable.
4. Co-locate tests as `Foo.test.tsx` next to the component; vitest + jsdom + Testing Library are already configured at the package level.
5. Add a story under `apps/storybook` covering the main variants and a11y states.

## Things that are stubbed

- **Thin vertical slice only.** atoms ships Box / Text / Button / Input; molecules ships Field; organisms is an empty placeholder. The full catalogue is intentionally deferred.
- **No release tooling.** No Changesets, no CI publish, no visual regression yet. Versions are all `0.0.0` and the repo root is `private: true`.
- **Icons package has two icons** (`CheckIcon`, `XIcon`) as proof-of-life.
- **Hooks package has two hooks** (`useMergedRefs`, `useControllableState`).

## Style

- TypeScript: strict + `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `moduleResolution: Bundler`, `jsx: react-jsx`. ESM only; use `import type` for type-only imports.
- React: function components and hooks, no class components. `forwardRef` where a ref is part of the public surface.
- Lint/format: ESLint flat config (typescript-eslint, react, react-hooks, jsx-a11y) + Prettier. Run `bun run format` before committing.
- Tests: Vitest + Testing Library + jsdom. Co-locate tests next to source as `*.test.ts(x)`.
- No comments unless the *why* is non-obvious.
