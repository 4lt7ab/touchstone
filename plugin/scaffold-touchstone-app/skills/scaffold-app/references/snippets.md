# Snippets

Fixed templates for the small files that vary only by app name. Copy these verbatim, substituting `<app-name>` and your route names.

Everything is imported from `@4lt7ab/touchstone` — the umbrella ships atoms, molecules, organisms, hooks, icons, and themes in one package, with one CSS file (`@4lt7ab/touchstone/styles.css`).

## package.json

```json
{
  "name": "<app-name>",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview --port 4173",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@4lt7ab/touchstone": "^0.0.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.5.3",
    "vite": "^5.3.4"
  }
}
```

`private: true` keeps it from being accidentally published. The `@4lt7ab/touchstone` version range should track whatever the user wants pinned — `^0.0.1` is fine for a scaffold.

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    "esModuleInterop": true,
    "allowImportingTsExtensions": false,
    "isolatedModules": true,
    "skipLibCheck": true,
    "noEmit": true,
    "resolveJsonModule": true
  },
  "include": ["src", "vite.config.ts"]
}
```

Mirrors Touchstone's own strictness. `noUncheckedIndexedAccess` catches off-by-one bugs early; `verbatimModuleSyntax` keeps `import type` honest.

## vite.config.ts

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  server: {
    port: Number(process.env.PORT ?? 5173),
  },
});
```

No plugins needed. The published `@4lt7ab/touchstone` package ships pre-compiled CSS, so consumers do not need `@vanilla-extract/vite-plugin`. Vite's built-in esbuild handles JSX via `esbuild: { jsx: 'automatic' }`. Trade-off: no React Fast Refresh; full reload on edits is fine for a scaffold and keeps the dependency tree tiny.

If the user later wants Fast Refresh, they can `bun add -d @vitejs/plugin-react` and `import react from '@vitejs/plugin-react'` here. It's not required.

## index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><App Name></title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## src/main.tsx

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import '@4lt7ab/touchstone/styles.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('root element missing');

document.body.style.margin = '0';
document.body.style.minHeight = '100vh';
document.body.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

The `import '@4lt7ab/touchstone/styles.css'` is the entire kit's CSS — themes, atoms, molecules, organisms — in one file. Order does not matter because nothing else has been loaded yet; just keep it before the `<App />` render.

## src/App.tsx — theme array and shell

```tsx
import { useEffect, useMemo, useState } from 'react';
import {
  Background,
  Toaster,
  ThemeRhythmProvider,
  blackholeTheme,
  coralTheme,
  darkTheme,
  lightTheme,
  mossTheme,
  neuralTheme,
  pacmanTheme,
  pipboyTheme,
  rhythms,
  slateTheme,
  synthwaveTheme,
  terminalTheme,
  vars,
  warmSandTheme,
} from '@4lt7ab/touchstone';
import { AppShellLayout } from './shell/AppShellLayout.js';
import { Dashboard } from './pages/Dashboard.js';
// ...other page imports

export type Route =
  | { name: 'dashboard' }
  | { name: '<entity>-list' }
  | { name: '<entity>-detail'; id: string }
  | { name: '<other>-list' }
  | { name: 'team' };

export interface ThemeOption {
  key: string;
  label: string;
  className: string;
  scene?: 'synthwave' | 'blackhole' | 'neural' | 'pipboy' | 'pacman';
}

const themeOptions: ThemeOption[] = [
  { key: 'light', label: 'Light', className: lightTheme },
  { key: 'dark', label: 'Dark', className: darkTheme },
  { key: 'slate', label: 'Slate', className: slateTheme },
  { key: 'warm-sand', label: 'Warm sand', className: warmSandTheme },
  { key: 'moss', label: 'Moss', className: mossTheme },
  { key: 'coral', label: 'Coral', className: coralTheme },
  { key: 'synthwave', label: 'Synthwave', className: synthwaveTheme, scene: 'synthwave' },
  { key: 'terminal', label: 'Terminal', className: terminalTheme },
  { key: 'pipboy', label: 'Pip-Boy', className: pipboyTheme, scene: 'pipboy' },
  { key: 'neural', label: 'Neural', className: neuralTheme, scene: 'neural' },
  { key: 'blackhole', label: 'Blackhole', className: blackholeTheme, scene: 'blackhole' },
  { key: 'pacman', label: 'Pac-Man', className: pacmanTheme, scene: 'pacman' },
];

export function App() {
  const [route, setRoute] = useState<Route>({ name: 'dashboard' });
  const [themeKey, setThemeKey] = useState<string>('light');

  const theme = useMemo(
    () => themeOptions.find((t) => t.key === themeKey) ?? themeOptions[0]!,
    [themeKey],
  );

  useEffect(() => {
    document.body.className = theme.className;
    document.body.style.background = vars.color.bgPage;
    document.body.style.color = vars.color.fg;
  }, [theme]);

  const rhythmName = themeKey as keyof typeof rhythms;
  const rhythm = rhythmName in rhythms ? rhythms[rhythmName] : null;

  return (
    <ThemeRhythmProvider rhythm={rhythm}>
      {theme.scene && <Background scene={theme.scene} pulse />}
      <AppShellLayout
        route={route}
        onNavigate={setRoute}
        themeOptions={themeOptions}
        themeKey={themeKey}
        onThemeChange={setThemeKey}
      >
        {/* page switch on route.name */}
      </AppShellLayout>
      <Toaster />
    </ThemeRhythmProvider>
  );
}
```

Every Touchstone export sits on the umbrella — components, hooks (`ThemeRhythmProvider`, `useTableSort`, etc.), themes, and the `vars` token contract. One import statement does it.

## New-entity Dialog form pattern

Lives inside `AppShellLayout`. Demonstrates `Dialog` (controlled), `Field` + `Input`/`Textarea`/`SegmentedControl`, and `toast()`.

```tsx
import {
  Button, Dialog, Field, Input, Textarea, SegmentedControl, Stack, toast,
} from '@4lt7ab/touchstone';
import { PlusIcon } from './icons.js';

function New<Entity>Dialog() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'planning' | 'active'>('planning');
  const [open, setOpen] = useState(false);

  const submit = () => {
    if (!name.trim()) {
      toast({ tone: 'warning', title: 'Name required' });
      return;
    }
    toast({ tone: 'success', title: '<Entity> created', description: `${name} — ${status}` });
    setName(''); setDescription(''); setStatus('planning'); setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button intent="primary" size="sm">
          <PlusIcon />
          <span style={{ marginLeft: 8 }}>New <entity></span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content title="New <entity>" description="Spin up a <entity> with mocked defaults.">
        <Stack direction="column" gap="md">
          <Field label="Name" hint="A short, memorable handle">
            <Input value={name} onChange={(e) => setName(e.currentTarget.value)} autoFocus />
          </Field>
          <Field label="Description" hint="One or two sentences">
            <Textarea value={description} onChange={(e) => setDescription(e.currentTarget.value)} rows={3} />
          </Field>
          <Field label="Initial status">
            <SegmentedControl
              aria-label="Initial status"
              value={status}
              onValueChange={(v) => setStatus(v)}
              options={[
                { value: 'planning', label: 'Planning' },
                { value: 'active', label: 'Active' },
              ]}
            />
          </Field>
          <Stack direction="row" justify="end" gap="sm">
            <Dialog.Close><Button intent="ghost">Cancel</Button></Dialog.Close>
            <Button intent="primary" onClick={submit}>Create <entity></Button>
          </Stack>
        </Stack>
      </Dialog.Content>
    </Dialog>
  );
}
```

## Theme switcher Menu pattern

```tsx
import { Badge, Button, Menu } from '@4lt7ab/touchstone';
import { PaletteIcon } from './icons.js';

function ThemeMenu({ options, selected, onChange }: ThemeMenuProps) {
  return (
    <Menu>
      <Menu.Trigger>
        <Button intent="ghost" size="sm">
          <PaletteIcon />
          <span style={{ marginLeft: 8 }}>
            {options.find((t) => t.key === selected)?.label ?? 'Theme'}
          </span>
        </Button>
      </Menu.Trigger>
      <Menu.Content side="bottom" align="end" aria-label="Theme">
        {options.map((opt) => (
          <Menu.Item
            key={opt.key}
            trailing={opt.key === selected ? <Badge tone="accent">·</Badge> : undefined}
            onSelect={() => onChange(opt.key)}
          >
            {opt.label}
          </Menu.Item>
        ))}
      </Menu.Content>
    </Menu>
  );
}
```

## src/shell/icons.tsx — inline SVG set

The kit's icon package ships only `CheckIcon` and `XIcon`. Bundle your own. This 9-icon set covers the typical sidebar / app-bar needs; adapt to the product shape (a CRM might prefer a Building icon, an observability app a Wave icon — keep the same size/stroke parameters so they read as one family).

```tsx
import type { SVGProps } from 'react';

const baseProps: SVGProps<SVGSVGElement> = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const HomeIcon = () => (
  <svg {...baseProps}>
    <path d="M3 11l9-8 9 8v10a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z" />
  </svg>
);
export const FolderIcon = () => (
  <svg {...baseProps}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);
export const ListIcon = () => (
  <svg {...baseProps}>
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
export const PeopleIcon = () => (
  <svg {...baseProps}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
export const PlusIcon = () => (
  <svg {...baseProps}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
export const SearchIcon = () => (
  <svg {...baseProps}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
export const PaletteIcon = () => (
  <svg {...baseProps}>
    <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
    <path d="M12 22a10 10 0 1 1 10-10c0 4-3 5-5 5h-2a2 2 0 0 0-2 2 2 2 0 0 1-2 2 1 1 0 0 0 1 1z" />
  </svg>
);
export const MoreIcon = () => (
  <svg {...baseProps}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);
export const InboxIcon = () => (
  <svg {...baseProps}>
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);
```

## Mock data shape

The pattern that worked for the canonical PM example:

```ts
// src/data/mock.ts
export type EntityStatus = 'planning' | 'active' | 'blocked' | 'done';

export interface Person {
  id: string;
  name: string;
  role: string;
  initials: string;
}
export interface Entity {
  id: string;
  name: string;
  description: string;
  status: EntityStatus;
  ownerId: string;
  dueDate: string;
  progress: number;
}

export const people: Person[] = [
  /* 6-8 entries */
];
export const entities: Entity[] = [
  /* 6-8 entries */
];

const NOW = new Date('2026-05-01T00:00:00Z').getTime(); // anchor

export function formatRelative(iso: string): string {
  const hours = Math.round((NOW - new Date(iso).getTime()) / 36e5);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.round(days / 7)}w ago`;
}

export function statusTone(
  s: EntityStatus,
): 'neutral' | 'success' | 'warning' | 'danger' | 'accent' {
  if (s === 'done') return 'success';
  if (s === 'active') return 'accent';
  if (s === 'blocked') return 'danger';
  return 'neutral';
}
```

The fixed `NOW` constant is the trick — without it, "1d ago" drifts every reload and the demo reads inconsistently. Pick a date in the recent past so the activity feed still says recent things.
