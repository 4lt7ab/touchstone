# CLAUDE.md

**TL;DR:** A themed, accessible React component library — Bun + workspaces monorepo of atomic-design layers (tokens → themes → atoms → molecules → organisms) bundled into one umbrella npm package, `@4lt7ab/touchstone`. Internal workspace packages stay private; only the umbrella publishes.

## Where to look

| If you need to... | Read |
|---|---|
| Understand the system | [`docs/architecture.md`](docs/architecture.md) |
| Know what the project does and what's in scope | [`docs/feature-set.md`](docs/feature-set.md) |
| Set up locally, run repo-wide tasks, or read the layout | [`docs/development.md`](docs/development.md) |
| Ship a release | [`docs/deployment-strategy.md`](docs/deployment-strategy.md) |
| Run or write tests | [`docs/testing.md`](docs/testing.md) |
| Match the code style, add a package, or add a component | [`docs/coding-conventions.md`](docs/coding-conventions.md) |
| Propose a component, an envelope, or a merge | [`docs/design-tenets.md`](docs/design-tenets.md) |
| Understand a domain term | [`docs/glossary.md`](docs/glossary.md) |
| Understand why something is the way it is | [`docs/decisions.md`](docs/decisions.md) |

## Rules

All files in `.claude/rules/` apply. Read them before acting in this repo:

- [`commit-rules.md`](.claude/rules/commit-rules.md) — workshop voice, commit structure, pre-commit policy.
- [`human-only-levers.md`](.claude/rules/human-only-levers.md) — workspace versioning and npm publishing are human-only; the agent never edits versions, never runs `just bump`/`set`/`release`, never publishes.
