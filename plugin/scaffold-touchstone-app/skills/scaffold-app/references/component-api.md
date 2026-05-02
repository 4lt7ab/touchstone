# Component API reference card

Every component you'll compose in a Touchstone app, with the prop shape that matters and the gotchas that catch people. All imports are from `@4lt7ab/touchstone` — the umbrella exports atoms, molecules, organisms, hooks, icons, and themes from a single entry point.

## Atoms

### Surface (the layout primitive)

The foundational primitive. Accepts both **recipe variants** (visual tokens) and **`style`/`className`** (layout escape hatch). Every other layout component is more restrictive.

- `level`: `'none' | 'base' | 'solid' | 'raised' | 'muted' | 'panel' | 'input' | 'overlay' | 'disabled' | 'page'` — background tier from theme
- `padding`: `'none' | 'sm' | 'md' | 'lg'`
- `radius`: `'none' | 'sm' | 'md' | 'lg' | 'full'`
- `glow`: `'none' | 'soft' | 'pulse'` (pulse modulates with theme rhythm)
- `as`: ElementType, `style`, `className`, `onClick`, ARIA props

Use `Surface` whenever you need both a background tier and inline `display: flex/grid` layout. Cards, avatar circles (`width/height` + `display: 'grid', placeItems: 'center'`), inline pills.

### Stack (flex layout, no style escape)

- `direction`: `'row' | 'column'`
- `gap`: `'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`
- `align`: `'start' | 'center' | 'end' | 'stretch' | 'baseline'`
- `justify`: `'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'`
- `wrap`: boolean
- `as`, `className`. **No `style`.**

If you need `flex: 1` on a Stack, you cannot — wrap the Stack in a `<div style={{ flex: 1 }}>`.

### Grid

- `columns`: `number` (fixed equal-width tracks) or `{ min: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }` (responsive auto-fit)
- `gap`, `align`, `justify` (same vocabulary as Stack)
- `as`, `className`

`columns={{ min: 'md' }}` gives a responsive card grid where each card is at least 16rem wide.

### Container (max-width centerer)

- `width`: `'prose' | 'narrow' | 'wide' | 'full'`
  - `prose` = 65ch — long reading
  - `narrow` = 32rem — centered forms
  - `wide` = 72rem — typical full-page
  - `full` = none
- `padding`: `'none' | 'sm' | 'md' | 'lg'`

Use `<Container width="wide" padding="lg">` as the outer wrapper of every page.

### Text

- `as`: ElementType (default `'span'`)
- `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'`
- `weight`: `'regular' | 'medium' | 'semibold' | 'bold'`
- `tone`: `'default' | 'muted' | 'accent' | 'danger'`
- `className`. **No `style`.**

For headings, pass `as="h1"` etc.

### Button

- **`intent`**: `'primary' | 'secondary' | 'ghost' | 'danger'`. NOT `variant`.
- `size`: `'sm' | 'md' | 'lg'`
- `shape`: `'rect' | 'square'` (square is for icon-only)
- `fullWidth`: boolean
- `disabled`, `onClick`, `type`, `aria-*`

Icon + label pattern: `<Button intent="primary" size="sm"><PlusIcon /><span style={{ marginLeft: 8 }}>New</span></Button>`. The icon is a child; spacing comes from the inline span.

### Input

- `type`: `'text' | 'email' | 'password' | 'url' | 'tel' | 'number' | 'search'`
- `value`, `defaultValue`, `placeholder`, `onChange`, `disabled`, `readOnly`, `required`, `autoFocus`, `name`
- `invalid`: boolean (sets `aria-invalid`)
- **No `style`, no `className`.** Width is 100% by default; wrap in a `<div style={{ flex: 1 }}>` to control.

### Textarea

- Same shape as Input (no `style`), plus `rows`.

### Badge

- `tone`: `'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent'`

Status badges, count chips, priority pills.

### ProgressBar (determinate)

- `value: number` (required)
- `min`, `max` (default 0/100)
- `size`: `'sm' | 'md' | 'lg'`
- `tone`: `'accent' | 'success' | 'warning' | 'danger'`
- `aria-label` (or `aria-labelledby`) — required when not adjacent to a label

### Background (decorative full-bleed)

- `pattern`: `'none' | 'grid' | 'dots' | 'mesh'`
- `pulse`: boolean (opacity follows theme rhythm)
- `scene`: `'synthwave' | 'blackhole' | 'neural' | 'pipboy' | 'pacman'` (canvas animation)

Render at the App root, `aria-hidden`, fixed-position. Render conditionally only when the active theme has a `scene`.

### Switch / Checkbox / Radio / RadioGroup

Form controls. `checked`/`defaultChecked`, `onCheckedChange`, `disabled`, `aria-label`. `RadioGroup` is the parent for `Radio` and owns `value`/`onValueChange`.

### Skeleton / Spinner / Divider

Loading and visual primitives. Skeleton has `width`, `height`, `radius`. Spinner has `size`. Divider has `orientation`.

## Molecules

### Field (label + hint + error wrapper)

- `label`: string (required)
- `hint`: string
- `error`: string (overrides hint visually, sets `aria-invalid`)
- `id`: string
- `children`: a single form control element

Field clones its child to inject `id`, `aria-labelledby`, and `aria-describedby`. Pass `<Input>`, `<Textarea>`, `<SegmentedControl>`, or any other control as the single child.

### SegmentedControl

- `options`: `{ value, label, disabled? }[]`
- `value` / `defaultValue` / `onValueChange`
- `size`: `'sm' | 'md'`
- `aria-label` **required** (or `aria-labelledby`)

Arrow keys move BOTH focus AND selection (different from Tabs).

### NavSection / NavItem

- `NavSection label="..."` wraps a flat list of `NavItem`. Implements roving-focus keyboard nav (arrow keys, Home/End).
- `NavItem`:
  - `selected`: boolean — current-page highlight, auto-applies `aria-current="page"`
  - `icon`, `trailing`: ReactNode slots
  - `disabled`, `size`, `tone`, `onClick`, `asChild`
  - When `asChild`, wraps a `<a>` or router `<Link>` with NavItem styling.

The roving-focus only works when each child is a NavItem (or another component that accepts `selected` + `tabIndex` + `onKeyDown`).

### PageHeader

- `title` (required), `description`
- `meta`: ReactNode (inline near title — typically `Badge`)
- `actions`: ReactNode (trailing buttons)
- `breadcrumbs`: ReactNode (renders above)
- `as`: heading level
- `divider`: boolean

Used inside `DataTablePage.Header` (which is a thin wrapper around PageHeader) and standalone on Dashboard / Team pages.

### Breadcrumbs

- `Breadcrumbs` root, `Breadcrumbs.Item` children
- `Item current` for the last crumb (renders as text, `aria-current="page"`)
- `Item asChild` to wrap a `<a>` or router `<Link>`

CSS generates the `/` separator; do not write it manually.

### Pagination

- `page` / `defaultPage` / `pageCount` / `onPageChange`
- `siblingCount` (default 1), `boundaryCount` (default 1)
- `size`: `'sm' | 'md'`
- `disabled`, `aria-label`

1-indexed. Roving-focus keyboard nav.

### EmptyState

Compound: `EmptyState` root with `level: 'section' | 'page'` (page = vh-tall takeover); children are `EmptyState.Icon`, `.Title`, `.Description`, `.Actions`.

### Table

Semantic `<table>` primitive. Compound:

- `Table` root: `density: 'comfortable' | 'compact'`, `striped`, `stickyHeader`
- `Table.Header / .Body / .Footer` → `<thead> / <tbody> / <tfoot>`
- `Table.Row`: `selected` (sets `aria-selected` + visual highlight)
- `Table.HeaderCell`: `scope` (default `'col'`), `sortable`, `sortDirection: 'asc' | 'desc' | null`, `onSortChange`, `align`
- `Table.Cell`: `colSpan`, `rowSpan`, `align`
- `Table.SelectCell`: `checked`, `onCheckedChange`, `disabled`, `aria-label`
- `Table.SelectAllCell`: `checked`, `indeterminate`, `onCheckedChange`, `disabled`, `aria-label`

Spread `useTableSort.getColumnProps(key)` onto a HeaderCell to make it sortable. Use SelectCell/SelectAllCell with `useTableSelection` for selection.

### AlertBanner

- `tone`: `'info' | 'success' | 'warning' | 'danger'`
- `title`, `children` (description)

### Toaster + toast()

Render `<Toaster />` once at the App root. Anywhere in the tree, call `toast({ tone, title, description, duration, action })` to dispatch. The toast() function is module-level; no provider needed.

### Disclosure

Compound: `Disclosure` (open/onOpenChange) > `Disclosure.Trigger` + `Disclosure.Content`. For collapsible sections.

## Organisms

### AppShell (named slot props — NOT children compound)

```tsx
<AppShell header={<AppBar />} sidebar={<Sidebar />}>
  Main content
</AppShell>
```

- `header`, `sidebar`: ReactNode slot props
- `children`: main content (becomes `<main>`)

The slots stay fixed; main scrolls.

### AppBar

- `brand`: leading slot
- `children`: center slot
- `actions`: trailing slot
- `sticky`: boolean
- `divider`: boolean (default true)
- `aria-label`

Renders `<header role="banner">`.

### Sidebar

- `header`, `children`, `footer`: vertical slots
- **`width: 'sm' | 'md' | 'lg'`** — NOT `'narrow'` (that's Container)
- `divider`, `aria-label`

Renders `<nav>`. Body (`children`) scrolls; header/footer pinned.

### Tabs (compound, controlled or uncontrolled)

```tsx
<Tabs defaultValue="overview">
  <Tabs.List aria-label="...">
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="overview">...</Tabs.Panel>
  <Tabs.Panel value="activity">...</Tabs.Panel>
</Tabs>
```

- Manual activation: arrow keys move focus; Enter/Space activates.
- `Tabs.Trigger value` and `Tabs.Panel value` must match.
- Panels are siblings of the list, not nested inside.

### Dialog (compound, modal, focus-trapped)

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Trigger>
    <Button>Open</Button>
  </Dialog.Trigger>
  <Dialog.Content title="Title" description="Optional">
    {/* body */}
    <Dialog.Close>
      <Button intent="ghost">Cancel</Button>
    </Dialog.Close>
  </Dialog.Content>
</Dialog>
```

- `Dialog.Trigger` and `Dialog.Close` wrap a **single child element** and inject `onClick`. Do not nest a fragment.
- `Dialog.Content title` is required. Portals to `document.body`, focus-trapped, scroll-locked.
- `dismissible={false}` requires explicit `Dialog.Close`.

### Menu (compound, anchored, non-modal)

```tsx
<Menu>
  <Menu.Trigger><Button>Actions</Button></Menu.Trigger>
  <Menu.Content side="bottom" align="end">
    <Menu.Item icon={<Edit/>} onSelect={...}>Edit</Menu.Item>
    <Menu.Separator />
    <Menu.Item tone="danger" onSelect={...}>Delete</Menu.Item>
  </Menu.Content>
</Menu>
```

- `Menu.Trigger` wraps a single child element.
- `Menu.Content`: `side`, `align`, `offset`, `aria-label`.
- `Menu.Item`: `icon`, `trailing`, `tone: 'default' | 'danger'`, `disabled`, `onSelect` (called before menu closes).
- Closes on Tab, click outside, or Escape.

### Popover

Same compound shape as Menu but for arbitrary content (not a list of items). `Popover.Trigger` + `Popover.Content`.

### DataTablePage (the list-page envelope)

```tsx
<DataTablePage rowCount={rows.length}>
  <DataTablePage.Header title="..." actions={...} divider />
  <DataTablePage.FilterBar><Filters /></DataTablePage.FilterBar>
  <DataTablePage.Table>
    <Table>...</Table>
  </DataTablePage.Table>
  <DataTablePage.Pagination>
    <Pagination ... />
  </DataTablePage.Pagination>
  <DataTablePage.Empty>
    <EmptyState ... />
  </DataTablePage.Empty>
</DataTablePage>
```

- `rowCount` drives a context that hides `.Empty` when populated and hides `.Table`/`.Pagination` when empty.
- `.Header` is a thin wrapper around `PageHeader` — same prop shape (`title`, `description`, `actions`, `meta`, `breadcrumbs`, `divider`).
- `.Pagination` is a slot — wrap a `<Pagination ... />` inside it; the slot only handles layout/visibility.

### DetailPage (the detail-page envelope)

```tsx
<DetailPage>
  <DetailPage.Header title="..." subtitle="..." />
  <DetailPage.Actions>
    <Button>Save</Button>
  </DetailPage.Actions>
  <DetailPage.Meta>
    <DetailPage.MetaItem label="Status">
      <Badge>Active</Badge>
    </DetailPage.MetaItem>
    <DetailPage.MetaItem label="Owner">Ada Lovelace</DetailPage.MetaItem>
  </DetailPage.Meta>
  <DetailPage.Body>{/* tabs etc. */}</DetailPage.Body>
  <DetailPage.RightPanel aria-label="Details">
    <Surface>...</Surface>
  </DetailPage.RightPanel>
</DetailPage>
```

- `.Actions` is **portaled into the header's trailing slot** at render time. Declare it inline as a child of `<DetailPage>`, not nested inside `.Header`.
- `.RightPanel` is sticky on ≥960px viewports and stacks below the body on narrower screens.
- `.MetaItem label` is the small caps label; children are the value.

## Hooks

### useControllableState

```ts
const [value, setValue] = useControllableState<T>({ value, defaultValue, onChange });
```

Standard controlled/uncontrolled state primitive. Used internally by Disclosure, Dialog, Menu.

### useTableSort

```ts
const sort = useTableSort<SortKey>({ defaultSort: { key: 'dueDate', direction: 'asc' } });
// Spread onto sortable headers:
<Table.HeaderCell {...sort.getColumnProps('dueDate')}>Due</Table.HeaderCell>
// sort.sort: { key, direction } | null. Read it to compute the sorted view.
```

The asc → desc → none cycle is owned by the cell; the hook only learns the result.

### useTableSelection

```ts
const selection = useTableSelection<string>({ rowIds: visible.map((r) => r.id) });
// selection.selectedIds, isSelected(id), toggle(id), toggleAll(),
// allSelected, someSelected, clear()
```

`toggleAll` flips every row in the current view (paginated/filtered-aware). Wire `selection.allSelected` and `selection.someSelected` to `Table.SelectAllCell.checked` and `Table.SelectAllCell.indeterminate`.

### ThemeRhythmProvider + useThemeRhythm + useGlowPulse

`<ThemeRhythmProvider rhythm={rhythms[themeKey] ?? null}>` wraps the App so animated themes have a heartbeat. `useGlowPulse()` and `useThemeRhythm()` are consumed internally by `Surface glow="pulse"` and `Background pulse`. You usually do not call them directly.

### useDisclosure / useFocusTrap / useFocusReturn / useClickOutside / useEscapeKey / useScrollLock / useRovingFocus / useAnchoredPosition

Accessibility primitives used internally by Dialog, Menu, Popover, Tabs, NavSection. Compose them when building a new compound component; rarely needed in app code.

## Theme exports

All twelve themes are CSS class name strings exported from `@4lt7ab/touchstone`:

`lightTheme`, `darkTheme`, `slateTheme`, `warmSandTheme`, `mossTheme`, `coralTheme`, `synthwaveTheme`, `terminalTheme`, `pipboyTheme`, `neuralTheme`, `blackholeTheme`, `pacmanTheme`.

The `vars` export is the theme contract — `vars.color.bgPage`, `vars.color.fg`, `vars.font.size.md`, etc. Use it when you need to read a token value at runtime (e.g., setting `document.body.style.background`). For static styling inside a component, prefer the recipe variants (`Surface level="panel"`) over `vars` references.

The `rhythms` object maps theme keys to optional heartbeat configurations for the five animated themes. Pass `rhythms[themeKey] ?? null` to `<ThemeRhythmProvider rhythm={...}>` so glow-pulse hooks tick.

## High-friction gotchas, condensed

1. **`Input` and `Stack` reject `style`.** Wrap in `<div style={...}>`. `Surface` accepts `style`.
2. **`Button` uses `intent`**, not `variant`.
3. **`Sidebar width`** is `'sm' | 'md' | 'lg'`. **`Container width`** is `'prose' | 'narrow' | 'wide' | 'full'`. Same prop name, different vocabularies.
4. **`AppShell`** uses named slot props (`header`, `sidebar`), not compound children.
5. **`NavItem selected`** is the active-page prop. Do not invent a parallel active state.
6. **`DataTablePage.Pagination`** is a slot; wrap a `<Pagination ... />` inside it.
7. **`DetailPage.Actions`** is portaled into the header — declare inline at the root level of `<DetailPage>`, not nested in `.Header`.
8. **`Dialog.Trigger` / `Menu.Trigger` / `Dialog.Close`** wrap a single child element and inject `onClick`. No fragments.
9. **`Tabs.Trigger value` and `Tabs.Panel value`** must match. Panels are siblings of the list.
10. **The kit's icon export ships only `CheckIcon` and `XIcon`.** Bundle inline SVGs in `src/shell/icons.tsx` for everything else.
