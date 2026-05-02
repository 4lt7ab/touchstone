# Feature set

**TL;DR:** A themed, accessible React component library with atomic-design layering. Currently a thin vertical slice across every layer; the catalogue is intentionally small and grows under explicit design tenets.

**When to read this:** Before proposing a new component, or to confirm whether a capability is in scope.

---

## In scope

- Atomic-design tiers (tokens, themes, icons, hooks, atoms, molecules, organisms) with a single umbrella package as the consumer surface.
- Multiple class-based theme presets reading a single `vars.*` contract; the zero-config render is the demo.
- In-house accessibility primitives (focus, dismiss, disclosure, roving focus, controllable state, compound contexts, `asChild` via the in-house `Slot`).
- Page-envelope components (e.g. `AppShell`, `Sidebar`, `PageHeader`, `NavItem`) — held to the same primitive-quality bar as atoms.
- Storybook stories for every component, covering variants and a11y states.

## Currently shipped

- Atoms — `Surface`, `Stack`, `Text`, `Button`, `Input`, `Badge`, `Divider`, `Spinner`, `Skeleton`, `Switch`, `Checkbox`, `Slot`.
- Molecules — `Field`, `SegmentedControl`, `AlertBanner`, `Disclosure`.
- Organisms — `Dialog`, `Popover`.
- Themes — `warmSand` (default), `slate`, `moss`, `coral`, `synthwave`, `terminal`, `pipboy`, `neural`, `blackhole`, `pacman`.
- Icons — `CheckIcon`, `XIcon` (proof-of-life).

## Out of scope (for now)

- Third-party UI dependencies of any kind — accessibility is owned in-house.
- CI publishing, Changesets, automated visual regression.
- Anything that hardcodes design tokens outside the `vars` contract.

## Posture toward growth

Two design tenets pair: "sane defaults that quickstart a real app" and "merge before retire". New components earn their place by reusing existing primitives and meeting the same a11y bar. Overlapping responsibilities are merged (with one extra prop), not retired. Envelopes are built bottom-up — smallest reusable piece first, then compositions, then the envelope.
