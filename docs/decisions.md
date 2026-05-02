# Decisions

**TL;DR:** Append-only log of significant choices and the reasoning behind them. Newest entries at the top. Each entry: date, decision, alternatives considered, reason.

**When to read this:** When something in the codebase surprises you, before you "fix" it.

---

## 2026-05-02 — Adopt the opinionated docs + rules layout

Adopted a fixed `docs/` and `.claude/rules/` scaffold so the repo's structure and behavior are discoverable in known locations. `CLAUDE.md` remains the canonical project doctrine for now; future entries may slim it into a thin index pointing into `docs/`.

**Alternatives considered:** keep all guidance in `CLAUDE.md`; split into many small docs without a fixed layout.

**Reason:** Fixed locations make the repo navigable to both humans and LLMs without cross-referencing chains.

---

## Earlier — Single umbrella package, every leaf private

`@4lt7ab/touchstone` is the only package on npm. Every layer (`@touchstone/atoms`, `@touchstone/themes`, …) is `private: true` and bundled into the umbrella tarball.

**Alternatives considered:** publish each leaf separately so consumers can pick layers.

**Reason:** One install, one stylesheet import, no leaf-package resolution at the consumer's tree. The library is opinionated; the install is opinionated to match.

---

## Earlier — In-house accessibility primitives, no third-party UI deps

`@touchstone/hooks` owns focus, dismiss, disclosure, roving focus, controllable state, compound contexts, and `asChild` (via the in-house `Slot`).

**Alternatives considered:** Radix UI, Headless UI, Ariakit.

**Reason:** Owning the primitives lets every component meet the same a11y bar without inheriting a third-party API surface. The cost is upfront; the payoff is an unconstrained variant API.

---

## Earlier — Vanilla-extract over runtime CSS-in-JS

Vanilla-extract recipes compiled at build time, single `dist/index.css` per package that ships styles, exposed at `./styles.css`.

**Alternatives considered:** Emotion, styled-components, plain CSS Modules.

**Reason:** Static extraction, zero runtime, type-safe theme contract.

---

## Earlier — `BaseComponentProps`, not `HTMLAttributes`

Components extend `{ id?, 'data-testid'? }` and enumerate every other prop explicitly.

**Alternatives considered:** spread `HTMLAttributes` so consumers can pass through any prop.

**Reason:** Prevents `style={...}` and `className=...` overrides that would bypass the recipe and theme contract. Visual tokens always come through the variant API. `Surface` is the deliberate layout-primitive exception.

---

## Earlier — Bun workspaces over Turborepo

Bun + workspaces with `bun run --filter '*'` for topological task running. No Turbo, no cross-run cache.

**Alternatives considered:** pnpm + Turborepo.

**Reason:** Smaller toolchain, fewer moving parts. Cache misses are cheap because the catalogue is small.

---

## Earlier — Human-only release levers

`just bump`, `just set`, `just release` are invoked by a human. The agent never edits `package.json` versions and never publishes.

**Alternatives considered:** Changesets + CI publish.

**Reason:** Releases are infrequent and high-stakes. Keeping the human in the loop is cheaper than wiring up automation that has to be trusted.
