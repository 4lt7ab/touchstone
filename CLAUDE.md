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
