# Design tenets

**TL;DR:** Two paired tenets define what Touchstone aims to be. The first decides what's in scope; the second decides what happens when two in-scope components overlap. Apply both when proposing additions, merges, or retirements.

**When to read this:** Before proposing a new component, an envelope, a merge, or a retirement.

---

## 1. Sane defaults that quickstart a real app

A consumer without strong design opinions should install `@4lt7ab/touchstone`, drop in the kit, and have a real-looking, accessible, well-themed application without tuning anything. The zero-config render *is* the demo. Touchstone is the workshop the apprentice walks into and starts striking — not the bench they have to assemble first.

In practice:

- **Anticipate needs, ship the kit.** Every layer carries the components a typical app would otherwise build. Page envelopes (`AppBar`, `Sidebar`, `PageHeader`, dashboard / list / detail wrappers) and nav primitives (`NavItem`, `NavSection`, `NavGroup`) are explicitly in scope, alongside the atoms.
- **Defaults render correctly.** The zero-config call site renders the way a tasteful default would. Opt-in flags default to off; opinionated visuals don't need configuration.
- **Primitive-quality at every tier.** Envelopes carry the same accessibility, focus management, keyboard navigation, and theme-rhythm work as the atoms. Depth is not traded for breadth — a `Sidebar` is held to the same bar as `Dialog`.
- **Composition stays cheap.** Even with envelopes in scope, components compose from the same primitives (`Surface`, `Stack`, `Text`, the hooks). Consumers can reach into the layers and remix without leaving the kit.

## 2. Merge before retire

A component reused across consumers and built to primitive-level quality earns its place — find the duplication, don't cut the utility. When two or more components overlap in responsibility, the move is *merge*, not retire. Retiring destroys utility; merging preserves it while shrinking surface area. A merged component with one extra prop is almost always cheaper than two near-duplicate components.

The atomic-design tier (atom / molecule / organism / envelope) is a taxonomy for reasoning about scope, not a retirement criterion. Demoting an envelope to an organism because it didn't earn its tier is a *merge* (with a smaller relative), not a retire.

When a retirement proposal surfaces, check whether merging would preserve the value first. Prefer merge.

## Building a component family

When a new envelope or compound surface lands — say `AppShell` with `AppBar`, `Sidebar`, `NavItem`, `NavSection`, and `PageHeader` underneath — build bottom-up: the smallest reusable piece first, then the compositions, then the envelope. A `NavItem` that gets reused in three places (a sidebar, a settings menu, a command palette) is built before the envelope that holds it.

The reason isn't aesthetic discipline; it's that top-down hardcodes envelope-specific shapes into the parts. A `NavItem` defined inside `Sidebar` ends up with sidebar-only props baked in, then gets rewritten the first time you want a consistent nav row in a settings drawer. Bottom-up commits the API discipline (focus, selected state, slots, `asChild`) before the composition pulls on it.

In practice:

- **Build the molecule before the organism, the organism before the envelope.** New tiers earn their place by needing to compose finished smaller pieces, not by being scaffolded ahead.
- **Pin the API on each piece in isolation.** Stories, tests, and accessibility work happen at each tier before the next is started.
- **Rough demos stay rough until the parts ship.** It's tempting to scaffold the envelope and stub the parts to "fix" a rough composition page; resist. The composition page is honest signal that the parts are missing — repair it by shipping them, not by faking the envelope.
