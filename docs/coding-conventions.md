# Coding conventions

**TL;DR:** TypeScript strict, ESM-only, functional React, vanilla-extract recipes for styling, no third-party UI deps, no comments unless the *why* is non-obvious.

**When to read this:** Before opening a PR, adding a component, or changing shared tooling.

---

## TypeScript

Strict mode plus `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `moduleResolution: Bundler`, and `jsx: react-jsx`. ESM only. Use `import type` for type-only imports. Each leaf package keeps `composite: true` so it joins the solution build.

## React

Function components and hooks. No class components. `forwardRef` where a ref is part of the public surface.

## Component shape

Each component lives in its own folder under the appropriate atomic-design layer: `Foo.tsx` for the component, `Foo.css.ts` for the recipe, `Foo.test.tsx` co-located, public surface re-exported from the package's `src/index.ts`.

## Styling

Vanilla-extract recipes for variants, sizes, and stateful styles. Visual values come from `vars.*` — never hardcoded. Raw `style` / `globalStyle` is reserved for what recipes can't express.

## Props contract

Components extend `BaseComponentProps` (`{ id?, 'data-testid'? }`), not `HTMLAttributes`. Every prop is explicitly enumerated. `Surface` is the layout-primitive exception and accepts `style` + `className` for layout composition.

## Imports and dependency direction

Inter-package deps go through `workspace:*` ranges. Atomic-design tiers import only downward (tokens ← themes ← atoms ← molecules ← organisms ← react). Sideways imports inside a tier require a real reason.

## Lint and format

ESLint flat config (typescript-eslint, react, react-hooks, jsx-a11y) + Prettier. Run `bun run format` before committing. Bypassing hooks (`--no-verify`) is forbidden — fix the root cause and write a new commit.

## Comments

No comments unless the *why* is non-obvious. The code and types should carry the *what*.
