# Testing

**TL;DR:** Vitest + Testing Library + jsdom, co-located with the source. Storybook is the visual and a11y QA surface.

**When to read this:** Before writing or running tests, or wiring up a new package's test setup.

---

## Test categories

- **Unit / component tests** — Vitest + `@testing-library/react` + jsdom. Co-located as `*.test.ts(x)` next to the component or hook they cover.
- **Hook tests** — same stack, exercising hooks through small host components or `renderHook`.
- **Storybook stories** — every component has a story under `apps/storybook` covering its variants and a11y states. The Storybook a11y addon and themes addon are part of the QA surface.

## Conventions

- Tests describe behavior, not implementation. Prefer Testing Library queries that mirror what a user perceives or does (role / label / text), not implementation-coupled selectors.
- Co-location is the rule: test files live next to the source they cover, never under a separate `tests/` tree.
- New accessibility behavior earns a hook in `@touchstone/hooks` and a test alongside it.
- Each library package owns its own `vitest.config.ts` and `vitest.setup.ts`.

## Invocation

Repo-wide: `bun run test`. Per-package: `bun run --filter @touchstone/<name> test`. There is no cross-run cache — every invocation re-runs from scratch.

## Out of scope

No automated visual regression yet. No e2e harness. Cross-browser checks happen in Storybook by hand.
