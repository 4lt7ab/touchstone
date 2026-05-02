# Architecture

**TL;DR:** Touchstone is an atomic-design React component library shipped as a Bun + workspaces monorepo. Layers (tokens → themes → atoms → molecules → organisms) are private workspace packages, all bundled into one umbrella package for distribution.

**When to read this:** Before making structural changes to the workspace, adding a new package, or moving code between layers.

---

## Layering

Atomic-design layering is enforced by dependency direction: tokens → themes → atoms → molecules → organisms → react. An atom must not import a molecule. Sibling-to-sibling imports inside a tier require justification.

## Distribution

The umbrella `@4lt7ab/touchstone` is the only published package. Every leaf package (`@touchstone/*`) is `private: true`. The umbrella's bundler config rolls every workspace dependency — JS and CSS — into a single tarball, so consumers install one package and import one stylesheet.

## Theming

A single theme contract (`vars.*`) defined in `@touchstone/themes` is read by every styled component. Components must not hardcode visual values; they read tokens through the contract. Theme presets are class-based and applied at the root.

## Styling

Vanilla-extract recipes live next to each component as `*.css.ts`. Recipes own variants, sizes, and stateful styles. Raw `style` / `globalStyle` is reserved for what recipes can't express. Packages that ship CSS expose a `./styles.css` subpath export and set `sideEffects` on their CSS files so consumer tree-shakers preserve them.

## Accessibility primitives

`@touchstone/hooks` owns focus traps, focus return, click-outside, escape-key, scroll lock, disclosure state, roving focus, controllable state, compound contexts, and `asChild` composition (via the in-house `Slot` atom). New behavior earns its way into the hooks package alongside a test. The library has no third-party UI dependencies.

## Component contract

Components extend `BaseComponentProps` (`{ id?, 'data-testid'? }`), not `HTMLAttributes`. Each prop is explicitly enumerated. The single layout-primitive exception (`Surface`) accepts `style` and `className` so consumers can compose flex / grid / gap. Visual tokens always come through the variant API.

## Build graph

A solution-style `tsc -b` from the root drives the project-reference graph; each leaf composes via re-export rather than re-bundle. Each leaf builds with `tsup` using the shared preset in `tooling/tsup-config/`. Leaves keep `react`, `react-dom`, and `@touchstone/*` external. The umbrella is the deliberate exception: it bundles every workspace dep into one self-contained `dist/index.js` + `dist/index.css`.
