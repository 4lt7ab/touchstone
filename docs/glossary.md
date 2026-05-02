# Glossary

**TL;DR:** Domain terms specific to this codebase. Alphabetical.

**When to read this:** When a term in the code or docs feels load-bearing and unfamiliar.

---

**Atom** — Smallest reusable component (`Surface`, `Stack`, `Text`, `Button`, …). Imports from tokens / themes / hooks; never from molecules or up.

**Atomic-design layering** — The dependency direction tokens → themes → atoms → molecules → organisms → react. Enforced socially, not by tooling.

**`BaseComponentProps`** — `{ id?, 'data-testid'? }`. The minimal prop contract every component extends, in place of `HTMLAttributes`. Keeps consumers from smuggling `style` / `className` past the recipe.

**Envelope** — A page-shaped composition (`AppShell`, `Sidebar`, `PageHeader`). Held to the same primitive-quality bar as atoms.

**Leaf package** — Any private workspace package under `packages/` other than the umbrella (`@touchstone/atoms`, `@touchstone/themes`, …). Never published.

**Lockstep versions** — Every workspace `package.json` version moves together via `just bump` or `just set`. The release script asserts this before publishing.

**Merge before retire** — When two components overlap in responsibility, prefer merging (with one extra prop) over retiring one. Preserves utility, shrinks surface area.

**Molecule** — A composition of atoms (`Field`, `SegmentedControl`, `AlertBanner`, `Disclosure`).

**Organism** — A larger composition with stateful behavior (`Dialog`, `Popover`).

**Recipe** — A vanilla-extract recipe (`@vanilla-extract/recipes`). Owns variants, sizes, and stateful styles. Lives next to the component as `*.css.ts`.

**`Slot`** — In-house atom that implements `asChild` composition. Used by components that delegate their root element.

**`Surface`** — Layout-primitive atom. The only component allowed to accept `style` and `className`, so consumers can compose flex / grid / gap.

**Theme contract** — The `vars.*` object defined in `@touchstone/themes` via `createThemeContract`. Every theme preset is a class that fills it in. Every styled component reads through it.

**Umbrella** — `packages/react`, published as `@4lt7ab/touchstone`. The only package consumers install. Bundles every leaf into one tarball + one stylesheet.

**Workshop voice** — The commit-message style used in this repo. Lowercase poetic title, indented 3–4 line verse in craft allegory (bench, anvil, ledger, mould, recipe, apprentice, hammer, forge, shelf, vessel, scroll, chamber, dye, stone), `Co-Authored-By` trailer.

**Zero-config render** — The visual default a consumer gets by installing `@4lt7ab/touchstone`, importing `styles.css`, and dropping in the kit without tuning anything. The zero-config render is the demo.
