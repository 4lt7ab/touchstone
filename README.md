# Touchstone

A themed, accessible React component library — the team's measure of quality. Atomic-design layers (tokens → themes → atoms → molecules → organisms) compose through one umbrella package, so consumers install one thing and get a real-looking, accessible app on first render.

## Install

```bash
bun add @4lt7ab/touchstone
```

```ts
import '@4lt7ab/touchstone/styles.css';
import { Button, Stack, warmSandTheme } from '@4lt7ab/touchstone';
```

The umbrella bundles every layer — JS and CSS — into a single tarball and a single stylesheet. No leaf-package resolution at the consumer's tree.

## Use cases

- Quickstart a real-feeling, themed, accessible React app without designing the kit first.
- Adopt opinionated atomic-design primitives and compose page envelopes (`Sidebar`, `PageHeader`, …) on top of them.
- Switch theming through a single `vars.*` contract — pick a preset from the catalogue (`warmSand`, `slate`, `moss`, `coral`, `synthwave`, `terminal`, `pipboy`, `neural`, `blackhole`, `pacman`) or add your own.

## Examples

- [Storybook](apps/storybook) — every component, every variant, every a11y state. `bun run storybook`.
- [Umbrella package source](packages/react) — the only package consumers install.

## Documentation

- [Architecture](docs/architecture.md)
- [Feature set](docs/feature-set.md)
- [Development](docs/development.md)
- [Deployment strategy](docs/deployment-strategy.md)
- [Testing](docs/testing.md)
- [Coding conventions](docs/coding-conventions.md)
- [Design tenets](docs/design-tenets.md)
- [Decisions](docs/decisions.md)
- [Glossary](docs/glossary.md)
