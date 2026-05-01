# Touchstone

A React component library that is the team's measure of quality. A Bun + workspaces monorepo of atomic-design layers (tokens → themes → atoms → molecules → organisms) re-exported through the umbrella `@touchstone/react` package, with Storybook for docs and visual QA.

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
│   ├── themes/             theme contract + light/dark presets (vanilla-extract)
│   ├── icons/              icon components
│   ├── hooks/              shared hooks (focus, dismiss, controllable state, …)
│   ├── atoms/              Surface, Stack, Text, Button, Input, Badge, Divider, Spinner, Skeleton, Switch, Checkbox, Slot
│   ├── molecules/          Field, SegmentedControl, AlertBanner, Disclosure
│   ├── organisms/          Dialog, Popover
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

Repo-level chores that are not part of any single package live in the `justfile`. `just --list` enumerates them; the two to know are `just bump [patch|minor|major]` (the only sanctioned way to move workspace versions) and `just release` (the only sanctioned way to publish to npm — see `scripts/publish.ts`, which builds, asserts a clean tree + lockstep versions, then `bun publish --access public` for each public package in topological order). **Both are human levers** — run them yourself; the agent never runs either (see **Commit rules** below). The release ritual is `just bump <level>` → `/commit` → `just release [--otp <code>] [--dry-run]`.

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
- **Accessible primitives live in `@touchstone/hooks`.** Focus traps, focus return, click-outside, escape-key, scroll lock, disclosure state, roving focus, controllable state, compound contexts, and `asChild` composition (via the in-house `Slot` atom) are all owned in-house. New components compose those hooks; new behavior earns its way into the hooks package alongside a test. The library has no third-party UI dependencies.
- **Storybook is the QA surface.** Every component should have a story under `apps/storybook` covering its variants and a11y states. `addon-a11y` and `addon-themes` are wired up in `.storybook/main.ts` — use them.
- **Components extend `BaseComponentProps`, not `HTMLAttributes`.** `BaseComponentProps` (in `@touchstone/atoms`) is `{ id?, 'data-testid'? }` — every other prop must be explicitly enumerated by the component. This prevents consumers from smuggling `style={...}` or `className=...` overrides that bypass the recipe + theme contract. The exception is `Surface`, which is the layout primitive: it accepts `style` and `className` so consumers can compose flex/grid/gap layouts that the recipe doesn't express. Visual tokens — colors, shadows, radii, font sizes — must always come through the variant API.

## Design tenets

Two tenets, paired. The first decides what doesn't belong in the library; the second decides what happens when two things that *do* belong overlap. Apply both before any retirement or consolidation proposal.

### 1. Keep consumer chrome to an absolute minimum

This is the load-bearing tenet the rest of the library answers to. "Chrome" is everything a consumer has to see, configure, or reason about that isn't the thing they came here to build. Every new component, prop, or API surface has to justify the attention it takes from the consumer.

In practice:

- **Prefer fewer components over more.** A component earns its place by carrying non-trivial behavior (accessibility, focus management, async lifecycles, theme rhythm) that a consumer would otherwise rebuild. Thin wrappers that only arrange layout are documented compositions, not components.
- **Prefer tighter props over more props.** A new prop competes for the consumer's attention every time they read an API table. Before adding one, check whether composition already expresses the same thing. Before keeping a prop, check whether it's still earning the documentation real estate.
- **Defaults do the work.** Opt-in flags default to off, and the zero-config call site renders correctly. Opt-outs are a last resort — if a behavior is opt-out by default, it's chrome the consumer never asked for.
- **No chrome in the consumer's app shell.** The library renders inside the consumer's app, not around it. Page envelopes (AppShell, DataTablePage, DetailPage) are deliberately not in scope — let the consuming app own its layout.
- **When a choice belongs to the consumer, return it to them.** A component that presets a layout the consumer would naturally compose themselves is chrome.

This tenet is why the right move on a "we could fold these into one richer component" proposal is usually yes — and the right move on a "let's add another flag" proposal is usually no.

### 2. Merge before retire

A component reused across projects earns its place — find the duplication, don't cut the utility. When two or more components pass the reuse-and-quality test (the component is reused across consumers *and* it's built to primitive-level quality) and they overlap in responsibility, the move is *merge*, not retire. Retiring destroys utility; merging preserves it while shrinking surface area. A merged component with one extra prop is almost always cheaper than two near-duplicate components.

This tenet is the counterweight to tenet 1. Chrome still goes — but before a retirement proposal, run the two-clause test. If the component passes, the question isn't "retire or keep," it's "keep or merge."

The atomic-design tier (atom / molecule / organism) is a taxonomy for reasoning about scope, not a retirement criterion. Demoting an organism to a molecule because it didn't earn its tier is a *merge* (with a smaller relative), not a retire.

When a retirement proposal surfaces, check the test first. Passing components merge; failing components retire.

## Adding a new package

1. `mkdir -p packages/<name>/src` and create `tsconfig.json`, `tsup.config.ts`, and a `package.json` mirroring an existing leaf package (e.g. `packages/atoms`).
2. Set `"name": "@touchstone/<name>"`, `"type": "module"`, the same `exports` block, and `sideEffects` if the package ships CSS.
3. Add it as a `workspace:*` dependency wherever it should be consumed; if it should be re-exported from the umbrella, add the export in `packages/react/src/index.ts`.
4. Add a `{ "path": "./packages/<name>" }` reference in the root `tsconfig.json` so it joins the solution build.
5. `bun install` to register it in the workspace.

## Adding a new component

1. Create a folder under the appropriate atomic-design layer (`packages/atoms/src/Foo/`, `packages/molecules/src/Foo/`, etc.).
2. Component in `Foo.tsx`, recipe in `Foo.css.ts`, public surface re-exported from the package's `src/index.ts`.
3. Read all visual values from `vars.*` (no hardcoded design tokens). Compose hooks from `@touchstone/hooks` (focus, dismiss, disclosure, roving focus, …) for accessible behavior — no third-party UI deps.
4. Co-locate tests as `Foo.test.tsx` next to the component; vitest + jsdom + Testing Library are already configured at the package level.
5. Add a story under `apps/storybook` covering the main variants and a11y states.

## Things that are stubbed

- **Thin vertical slice only.** Each layer ships a representative set, not the target catalogue — atoms covers the common primitives, molecules a handful of compositions, organisms ships Dialog and Popover. Future additions earn their place per the design tenets.
- **Release tooling is local-only.** Publishing goes through `just release` (see `scripts/publish.ts`); there is no CI publish, no Changesets, and no visual regression yet. The repo root is `private: true` and workspace versions move in lockstep via `just bump`. Both levers are human-only — never the agent.
- **Icons package has two icons** (`CheckIcon`, `XIcon`) as proof-of-life.
- **Hooks package owns the in-house accessibility primitives** (focus trap, focus return, click-outside, escape-key, scroll lock, disclosure, roving focus, controllable state, compound contexts, anchored positioning); new behavior lands here alongside a test when a component needs it.

## Style

- TypeScript: strict + `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `moduleResolution: Bundler`, `jsx: react-jsx`. ESM only; use `import type` for type-only imports.
- React: function components and hooks, no class components. `forwardRef` where a ref is part of the public surface.
- Lint/format: ESLint flat config (typescript-eslint, react, react-hooks, jsx-a11y) + Prettier. Run `bun run format` before committing.
- Tests: Vitest + Testing Library + jsdom. Co-locate tests next to source as `*.test.ts(x)`.
- No comments unless the *why* is non-obvious.

## Commit rules

One commit per coherent change, in the workshop voice. Use `/commit` to wrap a session — it commits the working tree as a single change. It does **not** touch versions: workspace bumps are a human lever (`just bump`) and must be run before `/commit` if a release is intended. If a bump is in the working tree, it rides along; if not, no version moves.

**Voice.** Lowercase poetic title in workshop / craft allegory; blank line; a 3–4 line verse, indented two spaces, describing the change as a parable; blank line; a `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` trailer. Vocabulary lives around bench, anvil, ledger, mould, recipe, apprentice, hammer, forge, shelf, vessel, scroll, chamber, dye, stone. Speak to the substance of the staged diff, not the file list. Mention version bumps only when they are the principal change.

**Structure.**
- Stage explicit paths — never `git add -A` / `git add .`.
- **Versioning is human-only.** The agent must never edit a `"version"` field in `package.json` (no `Edit`, no `Write`), never run `just bump`, and never run `npm version` / `bun version`. Workspace bumps go through `just bump <patch|minor|major>` (see `justfile` → `scripts/bump-versions.ts`), which a human invokes when a release is intended. The agent only carries the resulting diff into a commit alongside everything else.
- **Publishing is human-only.** The agent must never run `just release`, `bun publish`, or `npm publish` — not even with `--dry-run`. Releases go through `just release` (see `scripts/publish.ts`), which a human invokes after `just bump` and `/commit`. The npm registry is downstream of this repo; the agent never reaches it.
- Never include secrets, build artifacts, editor / OS junk, or harness state under `.claude/` (other than checked-in `commands/`, `agents/`, `skills/`, and `settings.json`).
- No `--amend`, no `--no-verify`, no `--no-gpg-sign`, no tag creation, no `-i` flags. Never push as part of a commit.
- If a pre-commit hook fails, fix the root cause and make a **new** commit.
