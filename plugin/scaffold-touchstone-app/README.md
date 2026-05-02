# scaffold-touchstone-app

A Claude Code plugin for [@4lt7ab/touchstone](https://github.com/4lt7ab/touchstone) — the React component library that's the team's measure of quality. Use it to scaffold a real-feeling Touchstone application without typing the wiring yourself.

## What the plugin does

Ask Claude something like "scaffold a CRM-shaped Touchstone app" or "I want a Touchstone admin dashboard" and Claude will:

- Lay down a Vite + React + TypeScript project (or extend an existing one).
- Install `@4lt7ab/touchstone`, mount its CSS, and hook up the twelve included themes (light, dark, slate, warm-sand, moss, coral, synthwave, terminal, pip-boy, neural, blackhole, pac-man) — including the five with animated canvas backgrounds.
- Compose the `AppShell` envelope: `AppBar` with brand and theme menu, `Sidebar` with `NavSection` + `NavItem`, a centered main content area, and a `Toaster` at the root.
- Generate four to five real pages that exercise the full library: a Dashboard, a `DataTablePage` list view with filters and pagination, a `DetailPage` with `Tabs` and a sticky right panel, a second list with row selection, and a Team / Grid view.
- Seed mock data so the demo reads as a product, not a Storybook clone.
- Verify the app builds and runs.

The result is the same shape as `apps/pm/` in the Touchstone repo — a starting point a team can fork instead of typing AppShell wiring from scratch.

## Install

The plugin is hosted in the Touchstone repo, which doubles as a Claude Code marketplace.

```text
/plugin marketplace add 4lt7ab/touchstone
/plugin install scaffold-touchstone-app@touchstone
/reload-plugins
```

After install, the skill triggers contextually — you usually don't need to invoke it by name. Claude will pick it up when you ask for a Touchstone app, a beautiful frontend with these components, a CRM/billing/dashboard demo, or anything else app-shaped.

If you want to invoke it explicitly: the namespaced form is `/scaffold-touchstone-app:scaffold-app`.

## Prerequisites

The plugin assumes the user is running Claude Code in a directory where they want the app to live. Inside the conversation, Claude will install dependencies via `bun` (preferred) or `npm` — both work. Node 20+ is recommended.

If you're a Touchstone contributor working inside the touchstone monorepo itself, **don't use this plugin** — there's a project-level skill at `.claude/skills/scaffold-demo-app/` that's tuned for the monorepo's workspace conventions and the sandbox quirks. This plugin is for consumers.

## What the scaffolded app looks like

Twelve themes, five pages, full envelope-tier composition. The `apps/pm/` directory in the Touchstone repo is the canonical reference — every page the plugin generates is a slimmed-down sibling of those.

The file layout the plugin produces:

```
my-touchstone-app/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── data/mock.ts
    ├── shell/AppShellLayout.tsx
    ├── shell/icons.tsx
    └── pages/
        ├── Dashboard.tsx
        ├── <Entity>List.tsx
        ├── <Entity>Detail.tsx
        ├── <Other>List.tsx
        └── Team.tsx
```

## Versioning

The plugin tracks the major+minor of `@4lt7ab/touchstone`. Updates to the component library that change prop shapes will land in matched plugin releases. Pin to a specific plugin version if you depend on a specific kit version.

## License

MIT, same as Touchstone.
