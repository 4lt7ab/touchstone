# Touchstone

A themed, accessible React component library for teams who want a real-looking app on first render. Atomic-design layers (tokens → themes → atoms → molecules → organisms) compose through one umbrella package — install one thing, get the whole kit and a catalogue of themes to switch between.

<p align="center">
  <img src="docs/media/warm-sand.png" alt="Touchstone Analytics in the warm sand theme" width="32%" />
  <img src="docs/media/synthwave.png" alt="Touchstone Analytics in the synthwave theme" width="32%" />
  <img src="docs/media/terminal.png" alt="Touchstone Analytics in the terminal theme" width="32%" />
</p>

<p align="center"><sub>The same demo app — <code>warmSand</code>, <code>synthwave</code>, <code>terminal</code> — swapped by changing one CSS class.</sub></p>

## Install

```bash
bun add @4lt7ab/touchstone
```

```tsx
import '@4lt7ab/touchstone/styles.css';
import { Button, Stack, warmSandTheme } from '@4lt7ab/touchstone';

export function App() {
  return (
    <div className={warmSandTheme}>
      <Stack gap="md">
        <Button>Press me</Button>
      </Stack>
    </div>
  );
}
```

A theme export is a CSS class. Apply it to any wrapping element — the document body, a route shell, a single panel — and everything below it picks up that theme's `vars.*` contract. Swap the class to swap the theme.

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
