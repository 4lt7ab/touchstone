# Development

**TL;DR:** Bun + workspaces, asdf for tool pins, `bun run --filter` for topological per-package tasks, `just` for repo-level chores. Every library package follows the same shape and inter-package deps go through `workspace:*`.

**When to read this:** When cloning the repo, setting up a local environment, navigating the layout, or running repo-wide tasks.

---

## Layout

```
touchstone/
├── .tool-versions          asdf pins (nodejs, bun, just)
├── package.json            bun workspace root + repo-wide scripts
├── tsconfig.json           solution-style root with project references
├── tsconfig.base.json      shared strict TS settings
├── eslint.config.js        flat ESLint config root
├── .prettierrc             repo-wide formatter config
├── packages/               workspace members (the library itself)
│   ├── tokens/             raw scales (color, space, font, radius, zIndex)
│   ├── themes/             theme contract + presets (vanilla-extract)
│   ├── icons/              icon components
│   ├── hooks/              shared hooks (focus, dismiss, controllable state, …)
│   ├── atoms/              Surface, Stack, Text, Button, Input, Badge, Divider, Spinner, Skeleton, Switch, Checkbox, Slot
│   ├── molecules/          Field, SegmentedControl, AlertBanner, Disclosure
│   ├── organisms/          Dialog, Popover
│   └── react/              umbrella — bundled and published as @4lt7ab/touchstone
├── apps/
│   └── storybook/          docs and visual QA for every package
└── tooling/                shared build/lint config (not published)
    ├── tsconfig/           base + library tsconfigs
    ├── eslint-config/      shared ESLint flat config
    └── tsup-config/        shared tsup preset (vanilla-extract aware)
```

Every library package follows the same shape: `package.json`, `src/`, `tsup.config.ts`, `tsconfig.json`, and (where applicable) `vitest.config.ts` + `vitest.setup.ts`. Inter-package deps go through `workspace:*` ranges.

## Bootstrap

These commands are not runnable from inside the agent — paste them yourself.

```bash
asdf plugin add nodejs || true
asdf plugin add bun || true
asdf install
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

## Repo-level chores

Repo chores that aren't part of any single package live in the `justfile`. `just --list` enumerates them; the three to know are:

- `just bump [patch|minor|major]` — increment every workspace version in lockstep.
- `just set <version>` — force every workspace version to a literal value (one-off resets).
- `just release` — the only sanctioned way to publish to npm. See `scripts/publish.ts`, which builds, asserts a clean tree + lockstep versions, then runs `bun publish --access public` for each public package in topological order.

All three are **human levers** — run them yourself; the agent never runs any of them. See `.claude/rules/human-only-levers.md` for the full prohibition. The release ritual is `just bump <level>` → `/commit` → `just release [--otp <code>] [--dry-run]`.
