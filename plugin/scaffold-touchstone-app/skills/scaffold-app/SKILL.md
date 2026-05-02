---
name: scaffold-app
description: Scaffold a Touchstone-shaped React application using @4lt7ab/touchstone — either greenfield (a brand-new Vite project) or additive (the AppShell envelope and pages added to a project that already has Touchstone installed). Use this whenever the user asks to set up, scaffold, bootstrap, generate, or "stand up" anything that involves @4lt7ab/touchstone, the Touchstone component library, the touchstone kit, an admin app, a dashboard app, a CRM, project management, billing, support, observability, settings page, e-commerce, or any other product-shaped React frontend where they want the components wired up. Use when the user says "make a beautiful UI with these components", "I want a touchstone app", "show me what a real Touchstone frontend looks like", "scaffold pages for my touchstone app", or anything that points at the kit's full envelope tier (AppShell + AppBar + Sidebar + DataTablePage + DetailPage + Tabs + Dialog + Menu). Use even when the user does not say "scaffold" or "Vite" explicitly — phrases like "I have @4lt7ab/touchstone installed, now what?" or "give me a CRM with Touchstone" should trigger this. Do NOT use for: writing or modifying components inside the Touchstone library itself (that's a contributor task with different conventions); generic React scaffolding that doesn't involve Touchstone; pure styling questions; one-off bug fixes.
---

# Scaffold a Touchstone application

`@4lt7ab/touchstone` is a React component library — atoms, molecules, organisms, hooks, twelve themes, all in one published umbrella. This skill takes that kit and produces a real-looking application: a Vite + React project with the `AppShell` envelope, four to five pages spanning the envelope tier, mocked data, and the theme switcher hooked up. The result is the shape a team would otherwise spend a sprint typing.

## Two scopes

Decide with the user which they want. Most paths split here.

- **Greenfield.** No project yet. Create a fresh Vite + React + TypeScript app with `@4lt7ab/touchstone` installed, theme mounting, the shell, and the pages. Phase 1 onward.
- **Additive.** They already have a Vite + React app (or are willing to use one), and `@4lt7ab/touchstone` may or may not be installed. Add the shell and pages on top. Skip Phase 1, run a check in Phase 2, then Phase 3 onward.

Greenfield is the common case and is what the rest of this skill assumes. Notes for the additive path are at the bottom.

## Output shape

```
<app-name>/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── data/
    │   └── mock.ts
    ├── shell/
    │   ├── AppShellLayout.tsx
    │   └── icons.tsx
    └── pages/
        ├── Dashboard.tsx
        ├── <Entity>List.tsx        (DataTablePage)
        ├── <Entity>Detail.tsx      (DetailPage with Tabs)
        ├── <Other>List.tsx         (DataTablePage with row selection)
        └── Team.tsx                (Grid of cards)
```

## Phase 0 — Frame the app

Before writing code, agree on:

- **App name** (kebab-case directory).
- **Domain.** PM (projects + tasks + people)? CRM (accounts + deals + contacts)? Admin (servers + alerts + operators)? Pick two list-shaped entities and one of them becomes the detail surface.
- **Page list (4–5).** Map them to envelopes:
  - **Dashboard** — KPIs in `Surface` cards, progress bars, an activity feed.
  - **<entity>-list** — `DataTablePage`. Filters, sorted columns, pagination.
  - **<entity>-detail** — `DetailPage` with `Tabs`, right panel, breadcrumbs, an actions menu.
  - **<other>-list** — second `DataTablePage`, this one with row selection (`useTableSelection`).
  - **Team / People** (or similar) — `Grid` of `Surface` cards.

Push back on more than five pages on the first pass. The four envelope shapes above are the minimum to honestly cover the kit; ship them first, then iterate.

## Phase 1 — Greenfield setup

Read **references/snippets.md** for fixed-content templates. The files to write:

- `package.json` — dependencies on `@4lt7ab/touchstone`, `react`, `react-dom`. No vanilla-extract Vite plugin needed (the published package ships pre-compiled CSS).
- `tsconfig.json` — strict, ESM, `react-jsx` JSX transform.
- `vite.config.ts` — minimal. Just `defineConfig({})`. Vite's built-in esbuild handles JSX.
- `index.html` — boilerplate with `<div id="root"></div>` and `<script type="module" src="/src/main.tsx">`.

After writing, run the install. Prefer `bun` if it's on the user's PATH; fall back to `npm`. Tell the user which you chose.

```bash
cd <app-name>
bun install   # or: npm install
```

If install fails, surface the error to the user — don't paper over it.

## Phase 2 — Theme mounting and routing

Read **references/snippets.md** for the `App.tsx` template. The pieces that must be right:

- **Twelve themes**, all imported from `@4lt7ab/touchstone`: `lightTheme`, `darkTheme`, `slateTheme`, `warmSandTheme`, `mossTheme`, `coralTheme`, `synthwaveTheme`, `terminalTheme`, `pipboyTheme`, `neuralTheme`, `blackholeTheme`, `pacmanTheme`. Each export is a CSS class name string.
- **Five themes have animated canvas scenes**: `synthwave`, `pipboy`, `neural`, `blackhole`, `pacman`. When one of those is active, render `<Background scene="..." pulse />` at the App root.
- **Apply a theme** by setting `document.body.className = themeClass` inside a `useEffect`. Also set `document.body.style.background = vars.color.bgPage` and `document.body.style.color = vars.color.fg` so the page edges adopt the theme.
- **Wrap the tree** in `<ThemeRhythmProvider rhythm={rhythms[themeKey] ?? null}>` so the glow-pulse hooks have a heartbeat to read from.
- **Render `<Toaster />` once** at the root so any `toast()` call lands somewhere.
- **Routing is plain `useState`** over a discriminated union — no router library on the first pass. Detail variants carry an `id` field. URLs do not change as the user navigates; that's fine for a scaffold and easy to swap for a real router later.

The `import '@4lt7ab/touchstone/styles.css';` line in `main.tsx` brings in the entire kit's CSS. One import, all twelve themes available.

## Phase 3 — App shell

`src/shell/AppShellLayout.tsx` composes the envelope. Read **references/snippets.md** for the theme-options array (verbose but copy-pastable) and the new-entity dialog skeleton.

Five facts that bite if forgotten:

- **`<AppShell>` takes named slot props**, not compound children: `<AppShell header={<AppBar/>} sidebar={<Sidebar/>}>{children}</AppShell>`. Do not write `<AppShell><AppBar/>...`.
- **Sidebar widths are `'sm' | 'md' | 'lg'`** — `'narrow'` is for `Container`, not `Sidebar`. The words look similar; the prop values are not interchangeable.
- **`NavItem selected={...}`** is the current-page highlight. It auto-applies `aria-current="page"`. Do not invent a parallel active state.
- **`Menu.Trigger` and `Dialog.Trigger` wrap a single child element** and inject the click handler. Do not pass a fragment.
- **`Input` and `Stack` do NOT accept `style`.** Wrap them in a native `<div style={...}>` for layout. `Surface` does accept `style` and `className` — it is the layout primitive when you also need a background tier.

Inline icons go in `src/shell/icons.tsx`. The kit's icon set is intentionally small (just `CheckIcon` and `XIcon`); a typical app needs Home / Folder / List / People / Plus / Search / Palette / More icons. Hand-write small inline SVGs — see snippets.md for a 9-icon starter set with a shared `baseProps`.

## Phase 4 — Pages

Read **references/component-api.md** before writing pages. It's the prop reference for every component you'll compose. The high-frequency ones:

- **`Button intent`**, not `variant`: `'primary' | 'secondary' | 'ghost' | 'danger'`.
- **`Container width`**: `'prose' | 'narrow' | 'wide' | 'full'`. Use `wide` for full pages, `narrow` for centered forms.
- **`Badge tone`**: `'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent'`.
- **`DataTablePage rowCount={n}`** drives a context that branches between `.Table`/`.Pagination` and `.Empty`. `.Pagination` is a slot — wrap a `<Pagination ... />` inside it.
- **`DetailPage.Actions`** is portaled into the header's trailing slot. Declare it inline as a child of `<DetailPage>`, not nested inside `.Header`.
- **`Tabs`** needs matching `value` strings on `Tabs.Trigger` and `Tabs.Panel` siblings. Render panels as siblings of the list, not inside it.
- **`useTableSort.getColumnProps(key)`** spreads onto `Table.HeaderCell` to make a column sortable. **`useTableSelection`** returns `{ selectedIds, isSelected, toggle, toggleAll, allSelected, someSelected, clear }` — wire `allSelected`/`someSelected` to `Table.SelectAllCell.checked` and `Table.SelectAllCell.indeterminate`.

When you want to navigate from a row click, use a real `<button type="button" onClick={...}>` styled with `all: 'unset'` rather than fighting `Text as="button"`. Cells are leaf nodes; the click target is yours.

For mock data (`src/data/mock.ts`), generate 6–8 entities of each list type and 6–8 people. Anchor relative-time helpers to a fixed "now" constant — without it, "1d ago" drifts every reload and the demo reads inconsistently. Include tone resolvers (`statusTone`, `priorityTone`) that map domain values to component tones; they plug straight into `Badge tone={...}` and `ProgressBar tone={...}`.

## Phase 5 — Verify

Typecheck:

```bash
cd <app-name>
npx tsc --noEmit -p .
```

Should be clean.

Then start the dev server:

```bash
bun run dev   # or: npm run dev
```

Vite cold-starts quickly. Open the printed URL.

Walk every page:

- Dashboard renders without console errors.
- The list page filters and sorts.
- The detail page shows tabs, meta, the right panel, and the actions menu opens.
- The second list page has working row selection — check + uncheck a row, indeterminate state on the header cell.
- The team / grid page lays out.
- The theme menu cycles. Try Light → Dark → Synthwave (the easiest tell — pink accents, dark background, canvas scene visible at the page edges).

If you have access to browser preview tools (`mcp__Claude_Preview__preview_*`), screenshot each page and check `preview_console_logs` filtered to `error`. Without them, ask the user to confirm each page renders and report any console errors.

## Phase 6 — Hand off

Tell the user, in this order:

1. The dev server is running at the URL Vite printed.
2. The five pages live at `src/pages/*.tsx`. Mock data is at `src/data/mock.ts`.
3. The theme switcher is in `src/shell/AppShellLayout.tsx` — twelve themes, five with animated backgrounds.
4. To swap a theme as the default, change the initial state in `src/App.tsx` (`useState<string>('light')`).
5. To swap routing for `react-router-dom` later, the discriminated union in `src/App.tsx` is the seam — replace the `useState<Route>` with router state and the page components don't change.

Don't auto-commit. The user's repo, the user's commits.

## Additive-mode notes

If the user already has a Vite + React + TypeScript app and wants to add Touchstone on top:

1. Skip Phase 1 file generation.
2. Confirm `@4lt7ab/touchstone` is installed (`grep '@4lt7ab/touchstone' package.json`); install if missing.
3. Confirm `import '@4lt7ab/touchstone/styles.css'` is at the project's entry point. Add if missing.
4. Generate `src/shell/AppShellLayout.tsx`, `src/shell/icons.tsx`, the page components, and `src/data/mock.ts` as Phase 3 onward describes.
5. Wire the AppShell into the user's existing root component, replacing or wrapping their current layout.
6. Same verify step (Phase 5).

If their project is not Vite — Next.js, Remix, Astro — call that out: this skill targets Vite. The component imports work the same, but the entry-point wiring (where to mount theme classes, how to import CSS, how to handle "use client") needs a different shape. Offer to do the Vite version, or talk through their setup.

## References

- **references/snippets.md** — fixed templates: package.json, tsconfig, vite.config, index.html, main.tsx, App.tsx with the 12-theme array, the new-entity dialog form, the theme switcher menu, the icons.tsx pattern.
- **references/component-api.md** — prop reference card for every component you compose, organized by atomic-design tier with the high-friction gotchas highlighted.
