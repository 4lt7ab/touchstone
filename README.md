# Touchstone

A React component library that is the team's measure of quality.

Touchstone is an opinionated, atomic-design component library delivered as a pnpm + Turborepo monorepo. Each layer (tokens → themes → atoms → molecules → organisms) is published as its own package and re-exported through the umbrella `@touchstone/react` package.

## Stack

| Concern               | Choice                                               |
| --------------------- | ---------------------------------------------------- |
| Package manager       | Bun (workspaces)                                     |
| Task runner           | `bun run --filter` (topological, no cross-run cache) |
| Language              | TypeScript (strict, project references)              |
| Styling / theming     | Vanilla Extract + recipes, type-safe theme contract  |
| Accessible primitives | Radix UI                                             |
| Bundler               | tsup (esbuild) + `@vanilla-extract/esbuild-plugin`   |
| Tests                 | Vitest + Testing Library + jsdom                     |
| Lint / format         | ESLint flat config + Prettier                        |
| Docs / QA             | Storybook 8 (Vite framework) + autodocs + a11y       |

## Layout

```
touchstone/
├─ apps/
│  └─ storybook/                # docs and visual QA for every package
├─ packages/
│  ├─ tokens/                   # raw scales (color, space, font, radius)
│  ├─ themes/                   # theme contract + light/dark presets
│  ├─ icons/                    # icon components
│  ├─ hooks/                    # shared hooks
│  ├─ atoms/                    # Surface, Text, Button, Input
│  ├─ molecules/                # Field
│  ├─ organisms/                # placeholder for future organisms
│  └─ react/                    # umbrella re-export — install this
└─ tooling/
   ├─ tsconfig/                 # base + library tsconfigs
   ├─ eslint-config/            # shared ESLint flat config
   └─ tsup-config/              # shared tsup preset (vanilla-extract aware)
```

## Common scripts

```bash
bun install             # install workspace deps
bun run build           # build every package (`bun run --filter '*' build`)
bun run test            # run Vitest in every package
bun run typecheck       # tsc -b solution build
bun run lint            # ESLint everywhere
bun run storybook       # start Storybook dev server
```

`bun run --filter` honors the workspace dependency graph, so layers build in
topological order (tokens → themes → atoms → molecules → react). There is no
Turbo-style cross-run cache; everything re-runs from scratch each invocation.

## Status

Scaffold + thin vertical slice (Button → Field). The full component catalogue and release tooling (Changesets, CI publish, visual regression) are deferred.
