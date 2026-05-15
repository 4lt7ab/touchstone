import {
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import type { ReactElement, ReactNode, Ref } from 'react';
import type { BaseComponentProps } from '@touchstone/atoms';
import {
  useControllableState,
  useEscapeKey,
  useHotkey,
  useMediaQuery,
  useSnapDrag,
} from '@touchstone/hooks';
import { Toaster } from '@touchstone/molecules';
import type { ToasterProps } from '@touchstone/molecules';
import { ChevronLeftIcon, MenuIcon, XIcon } from '@touchstone/icons';
import { Kbd } from '@touchstone/atoms';
import { Dialog } from '../Dialog/Dialog.js';
import { Drawer } from '../Drawer/Drawer.js';
import { AppShellSlotProvider } from './appShellSlot.js';
import * as styles from './AppShell.css.js';

const DEFAULT_SIDEBAR_HOTKEY = 'mod+b';
const DEFAULT_DRAWER_HOTKEY = 'mod+`';
const DEFAULT_INSPECTOR_HOTKEY = 'mod+i';
const DEFAULT_COMMAND_PALETTE_HOTKEY = 'mod+k';
const DEFAULT_DOCK_HOTKEY = 'mod+j';
const DEFAULT_MOBILE_BREAKPOINT = '(max-width: 959px)';

const STORAGE_SUFFIX_SIDEBAR = 'sidebar-collapsed';
const STORAGE_SUFFIX_INSPECTOR = 'inspector-open';
const STORAGE_SUFFIX_SIDEBAR_WIDTH = 'sidebar-width';
const STORAGE_SUFFIX_INSPECTOR_WIDTH = 'inspector-width';

export type RailWidth = 'sm' | 'md' | 'lg';
const RAIL_WIDTHS: ReadonlyArray<RailWidth> = ['sm', 'md', 'lg'];

// Pixel sizes for the three sidebar presets. `sm` is the iconic / collapsed
// rail (vars.space[16] = 64px) — the resize vocabulary treats "smallest" and
// "collapsed" as the same state, since shrinking the rail past the labels'
// width is never the right look. `md` = 15rem (240px), `lg` = 18rem (288px).
const SIDEBAR_PRESET_PX: Record<RailWidth, number> = {
  sm: 64,
  md: 240,
  lg: 288,
};

// Inspector presets — sized to feel like a sub-app on wider screens. `sm`
// is roughly a phone-portrait width (still useful for short metadata),
// `md` reads like a wide reading column, and `lg` lands near tablet-portrait —
// a focused workspace docked to the trailing edge.
const INSPECTOR_PRESET_PX: Record<RailWidth, number> = {
  sm: 352, // 22rem  — phone-portrait
  md: 576, // 36rem  — reading column
  lg: 768, // 48rem  — tablet-portrait
};

const SIDEBAR_PRESET_PX_LIST = RAIL_WIDTHS.map((w) => SIDEBAR_PRESET_PX[w]);
const INSPECTOR_PRESET_PX_LIST = RAIL_WIDTHS.map((w) => INSPECTOR_PRESET_PX[w]);

function widthNameFromPx(table: Record<RailWidth, number>, px: number): RailWidth {
  let best: RailWidth = 'md';
  let bestDiff = Infinity;
  for (const w of RAIL_WIDTHS) {
    const diff = Math.abs(table[w] - px);
    if (diff < bestDiff) {
      best = w;
      bestDiff = diff;
    }
  }
  return best;
}

function readStoredRailWidth(
  storageKey: string | undefined,
  suffix: string,
): RailWidth | null {
  if (!storageKey) return null;
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(`${storageKey}/${suffix}`);
    if (raw === 'sm' || raw === 'md' || raw === 'lg') return raw;
    return null;
  } catch {
    return null;
  }
}

function writeStoredRailWidth(
  storageKey: string | undefined,
  suffix: string,
  value: RailWidth,
): void {
  if (!storageKey) return;
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(`${storageKey}/${suffix}`, value);
  } catch {
    // ignore — see writeStoredBool for context
  }
}

function readStoredBool(storageKey: string | undefined, suffix: string): boolean | null {
  if (!storageKey) return null;
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(`${storageKey}/${suffix}`);
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    return null;
  } catch {
    return null;
  }
}

function writeStoredBool(
  storageKey: string | undefined,
  suffix: string,
  value: boolean,
): void {
  if (!storageKey) return;
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(`${storageKey}/${suffix}`, String(value));
  } catch {
    // localStorage may be unavailable (Safari private mode, disabled, quota).
    // The toggle still works in-memory — persistence is the only thing lost.
  }
}

/**
 * Outer chrome of an application — the layout that holds the header bar,
 * the sidebar nav, the main content, and an optional trailing inspector
 * panel. Five slots: `header` (typically `AppBar`) spans the top, `sidebar`
 * (typically `Sidebar`) takes the leading edge of the body row, `children`
 * fills the main scroll region, `inspector` docks to the trailing edge for
 * details / context panels, and the `drawer` / `commandPalette` overlay
 * slots host always-summonable surfaces. The shell pins itself to `100vh`
 * and the main column owns its scroll, so the header, sidebar, and
 * inspector stay in place while content scrolls.
 *
 * Each slot is optional — render an `AppShell` with only `children` for a
 * standalone page, or any combination of the others. The main region wraps
 * in `<main role="main">`, prefixed by a focusable skip-to-content link
 * that becomes visible only when keyboard-focused.
 *
 * AppShell owns the sidebar's collapsed state, the inspector's open state,
 * and the drawer's open state. Pass `defaultSidebarCollapsed` /
 * `defaultInspectorOpen` / `defaultDrawerOpen` for uncontrolled use, or the
 * matching controlled pairs to drive them externally. By default ⌘B
 * toggles the rail, ⌘I toggles the inspector, ⌘\` toggles the drawer, and
 * ⌘K toggles the command palette; remap with `sidebarHotkey` /
 * `inspectorHotkey` / `drawerHotkey` / `commandPaletteHotkey`, or pass
 * `false` to any of them to opt out (e.g. an editor that needs ⌘B for bold).
 *
 * Responsive: below `mobileBreakpoint` (default `(max-width: 959px)`) the
 * persistent sidebar disappears and a hamburger trigger takes its place —
 * tapping it slides the sidebar in as an overlay with a backdrop. Click
 * the backdrop, press Escape, or pick an item to dismiss. The sidebar's
 * `collapsed` state is force-overridden to `false` while the overlay is
 * shown so labels are visible. The inspector is hidden entirely on mobile
 * — consumers wanting a mobile-equivalent should render that content
 * elsewhere (a route, a drawer, a bottom sheet) on small viewports.
 *
 * Toaster: by default the shell renders a `<Toaster>` inside its root, so
 * `toast(...)` calls from anywhere in the tree just work. Pass `toaster={false}`
 * to suppress (e.g. when the consumer already mounts one) or
 * `toaster={{ placement, max, dismissLabel }}` to customize.
 *
 * Persistence: pass `storageKey` to scope sidebar and inspector toggle
 * state under namespaced `localStorage` keys (`<storageKey>/sidebar-collapsed`
 * and `<storageKey>/inspector-open`). Initial paint reads from storage
 * synchronously — no flicker — and writes happen on every toggle.
 * Controlled props (`sidebarCollapsed`, `inspectorOpen`) opt out of
 * persistence so the parent stays the source of truth.
 */
export interface AppShellProps extends BaseComponentProps {
  /** Top slot — typically `AppBar`. */
  header?: ReactNode;
  /** Leading-edge slot — typically `Sidebar`. */
  sidebar?: ReactNode;
  /** Trailing-edge slot — typically a details / inspector panel. */
  inspector?: ReactNode;
  /**
   * Overlay slot — a `<Drawer>` summoned with the drawer hotkey. AppShell
   * exposes its open/onOpenChange pair through a slot context, so the inner
   * Drawer auto-wires without `cloneElement`. Wrap the Drawer in your own
   * component if you want — the Drawer reads the context wherever it ends
   * up in the tree. Side, size, title, and dismissible all stay on the
   * Drawer itself.
   *
   * For drawers triggered from a row or a button — not summoned from a
   * global hotkey — drop a standalone `<Drawer>` anywhere in `children`
   * with its own `open` / `onOpenChange`. Those explicit props win over
   * the slot context, so the standalone Drawer keeps its own state.
   */
  drawer?: ReactNode;
  /**
   * Always-summonable `<CommandPalette>`. AppShell exposes its
   * open/onOpenChange pair through a slot context — the palette auto-wires.
   * Pass explicit `open` / `onOpenChange` to take over the wiring.
   */
  commandPalette?: ReactNode;
  /**
   * Always-summonable `<Dock>`. Non-modal panel that floats at the bottom
   * of the viewport — for logs, transport bars, mini-players, status
   * footers. AppShell exposes its open/onOpenChange pair through a slot
   * context — the Dock auto-wires.
   */
  dock?: ReactNode;
  /** Main content area — your page. */
  children?: ReactNode;
  /** Controlled collapsed state for the sidebar rail. */
  sidebarCollapsed?: boolean;
  /** Initial collapsed state when uncontrolled. @default false */
  defaultSidebarCollapsed?: boolean;
  /** Fires when the user toggles the rail (hotkey or external trigger). */
  onSidebarCollapsedChange?: (collapsed: boolean) => void;
  /**
   * Combo that toggles the sidebar rail. Pass `false` to disable the
   * binding (the rail still works through `sidebarCollapsed`). See
   * `useHotkey` for the combo grammar. @default 'mod+b'
   */
  sidebarHotkey?: string | false;
  /** Controlled open state for the inspector panel. */
  inspectorOpen?: boolean;
  /** Initial open state when uncontrolled. @default true */
  defaultInspectorOpen?: boolean;
  /** Fires when the inspector opens or closes (hotkey or external trigger). */
  onInspectorOpenChange?: (open: boolean) => void;
  /**
   * Combo that toggles the inspector. Pass `false` to disable. See
   * `useHotkey` for the combo grammar. @default 'mod+i'
   */
  inspectorHotkey?: string | false;
  /**
   * Show a drag handle between the sidebar and main column that snaps to
   * `sm | md | lg` presets. Pointer + keyboard accessible. @default false
   */
  sidebarResize?: boolean;
  /** Controlled sidebar width preset. */
  sidebarWidth?: RailWidth;
  /** Initial sidebar width preset when uncontrolled. @default 'md' */
  defaultSidebarWidth?: RailWidth;
  /** Fires when the sidebar width snaps to a new preset. */
  onSidebarWidthChange?: (width: RailWidth) => void;
  /**
   * Show a drag handle between main and the inspector that snaps to
   * `sm | md | lg` presets. @default false
   */
  inspectorResize?: boolean;
  /** Controlled inspector width preset. */
  inspectorWidth?: RailWidth;
  /** Initial inspector width preset when uncontrolled. @default 'md' */
  defaultInspectorWidth?: RailWidth;
  /** Fires when the inspector width snaps to a new preset. */
  onInspectorWidthChange?: (width: RailWidth) => void;
  /** Controlled open state for the drawer. */
  drawerOpen?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultDrawerOpen?: boolean;
  /** Fires when the drawer opens or closes (hotkey, Escape, outside-click, external trigger). */
  onDrawerOpenChange?: (open: boolean) => void;
  /**
   * Combo that toggles the drawer. Pass `false` to disable the binding
   * (the drawer still works through `drawerOpen`). See `useHotkey` for
   * the combo grammar. @default 'mod+\`'
   */
  drawerHotkey?: string | false;
  /** Controlled open state for the command palette. */
  commandPaletteOpen?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultCommandPaletteOpen?: boolean;
  /** Fires when the command palette opens or closes. */
  onCommandPaletteOpenChange?: (open: boolean) => void;
  /**
   * Combo that toggles the command palette. Pass `false` to disable. See
   * `useHotkey` for the combo grammar. @default 'mod+k'
   */
  commandPaletteHotkey?: string | false;
  /** Controlled open state for the dock. */
  dockOpen?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultDockOpen?: boolean;
  /** Fires when the dock opens or closes. */
  onDockOpenChange?: (open: boolean) => void;
  /**
   * Combo that toggles the dock. Pass `false` to disable the binding (the
   * dock still works through `dockOpen`). See `useHotkey` for the combo
   * grammar. @default 'mod+j'
   */
  dockHotkey?: string | false;
  /**
   * Below this media query the persistent sidebar collapses into a
   * hamburger-summoned overlay. @default '(max-width: 959px)'
   */
  mobileBreakpoint?: string;
  /** Controlled open state for the mobile overlay. */
  mobileMenuOpen?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultMobileMenuOpen?: boolean;
  /** Fires when the mobile overlay opens or closes. */
  onMobileMenuOpenChange?: (open: boolean) => void;
  /** Accessible label for the open-menu button. @default 'Open menu' */
  openMenuLabel?: string;
  /** Accessible label for the close-menu button. @default 'Close menu' */
  closeMenuLabel?: string;
  /**
   * Skip-to-content link rendered as the shell's first focusable element.
   * Pass `false` to suppress, or an object to customize the visible label.
   * @default { label: 'Skip to content' }
   */
  skipLink?: false | { label?: string };
  /**
   * Default-on Toaster rendered inside the shell. Pass `false` to suppress
   * (e.g. when the consumer mounts one elsewhere), or pass `ToasterProps`
   * to customize placement, max stack depth, and dismiss label.
   */
  toaster?: false | ToasterProps;
  /**
   * Namespace under which sidebar and inspector toggle state is persisted
   * in `localStorage`. Keys are `<storageKey>/sidebar-collapsed` and
   * `<storageKey>/inspector-open`. Without `storageKey` the shell behaves
   * exactly as before — pure in-memory state.
   */
  storageKey?: string;
  /**
   * Render a sticky expand affordance on the trailing edge when an
   * `inspector` is provided but currently closed. Clicking it opens the
   * panel. Without this the only way to surface the inspector is the
   * hotkey, which is invisible to a cold viewer. @default true
   */
  inspectorEdgeTab?: boolean;
  /** Accessible label for the inspector edge tab. @default 'Open inspector' */
  inspectorEdgeTabLabel?: string;
  /**
   * What to do with the inspector on viewports below `mobileBreakpoint`.
   * `'hidden'` (default) hides the panel outright — the consumer is expected
   * to surface that content elsewhere (a route, a sheet) on small screens.
   * `'drawer'` mounts the inspector content inside an edge-anchored Drawer
   * controlled by the same open state, with the edge tab visible as the
   * summon affordance. Note: switching the prop or crossing the breakpoint
   * remounts the inspector tree (its own internal state is reset). @default 'hidden'
   */
  mobileInspector?: 'hidden' | 'drawer';
  /**
   * Title shown on the mobile-inspector Drawer header when
   * `mobileInspector="drawer"`. @default 'Inspector'
   */
  mobileInspectorTitle?: string;
  /**
   * Visual rhythm of the main column. `default` matches the prior shell
   * (vars.space[6] padding + gap); `comfortable` is generous;
   * `compact` is tight (data-dense pages). @default 'default'
   */
  mainDensity?: 'comfortable' | 'default' | 'compact';
  /**
   * Render the main column with built-in padding + gap. Set `false` for
   * consumers that own their own inner layout (chat columns, full-bleed
   * canvases, viewer surfaces). @default true
   */
  mainPadding?: boolean;
  /**
   * Consumer-supplied rows for the keyboard shortcuts dialog. The shell
   * automatically lists its own hotkeys (sidebar, inspector, drawer,
   * command palette); these append to that list under a "This app"
   * heading.
   */
  keyboardHints?: ReadonlyArray<{ keys: string; description: string }>;
  /**
   * Combo that opens the keyboard shortcuts cheat-sheet. Pass `false` to
   * disable. See `useHotkey` for the combo grammar. @default 'shift+?'
   */
  keyboardHintsHotkey?: string | false;
}

export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
  {
    header,
    sidebar,
    inspector,
    drawer,
    commandPalette,
    dock,
    children,
    sidebarCollapsed,
    defaultSidebarCollapsed = false,
    onSidebarCollapsedChange,
    sidebarHotkey,
    inspectorOpen,
    defaultInspectorOpen = true,
    onInspectorOpenChange,
    inspectorHotkey,
    sidebarResize = false,
    sidebarWidth,
    defaultSidebarWidth = 'md',
    onSidebarWidthChange,
    inspectorResize = false,
    inspectorWidth,
    defaultInspectorWidth = 'md',
    onInspectorWidthChange,
    drawerOpen,
    defaultDrawerOpen = false,
    onDrawerOpenChange,
    drawerHotkey,
    commandPaletteOpen,
    defaultCommandPaletteOpen = false,
    onCommandPaletteOpenChange,
    commandPaletteHotkey,
    dockOpen,
    defaultDockOpen = false,
    onDockOpenChange,
    dockHotkey,
    mobileBreakpoint = DEFAULT_MOBILE_BREAKPOINT,
    mobileMenuOpen,
    defaultMobileMenuOpen = false,
    onMobileMenuOpenChange,
    openMenuLabel = 'Open menu',
    closeMenuLabel = 'Close menu',
    skipLink,
    toaster,
    storageKey,
    inspectorEdgeTab = true,
    inspectorEdgeTabLabel = 'Open inspector',
    mobileInspector = 'hidden',
    mobileInspectorTitle = 'Inspector',
    mainDensity = 'default',
    mainPadding = true,
    keyboardHints,
    keyboardHintsHotkey,
    id,
    'data-testid': dataTestId,
  },
  ref,
) {
  const reactId = useId();
  const baseId = id ?? reactId;
  const mainId = `${baseId}-main`;

  // Storage hydration runs once at mount via a lazy initializer so the
  // first paint matches the stored value (no flicker). Controlled props
  // override storage entirely — the parent stays the source of truth.
  const storageKeyRef = useRef(storageKey);
  const [initialSidebarCollapsed] = useState<boolean>(() => {
    const stored = readStoredBool(storageKeyRef.current, STORAGE_SUFFIX_SIDEBAR);
    return stored ?? defaultSidebarCollapsed;
  });
  const [initialInspectorOpen] = useState<boolean>(() => {
    const stored = readStoredBool(storageKeyRef.current, STORAGE_SUFFIX_INSPECTOR);
    return stored ?? defaultInspectorOpen;
  });
  const [initialSidebarWidth] = useState<RailWidth>(() => {
    const stored = readStoredRailWidth(storageKeyRef.current, STORAGE_SUFFIX_SIDEBAR_WIDTH);
    return stored ?? defaultSidebarWidth;
  });
  const [initialInspectorWidth] = useState<RailWidth>(() => {
    const stored = readStoredRailWidth(storageKeyRef.current, STORAGE_SUFFIX_INSPECTOR_WIDTH);
    return stored ?? defaultInspectorWidth;
  });

  const handleSidebarChange = (next: boolean): void => {
    if (sidebarCollapsed === undefined) {
      writeStoredBool(storageKey, STORAGE_SUFFIX_SIDEBAR, next);
    }
    onSidebarCollapsedChange?.(next);
  };

  const handleInspectorChange = (next: boolean): void => {
    if (inspectorOpen === undefined) {
      writeStoredBool(storageKey, STORAGE_SUFFIX_INSPECTOR, next);
    }
    onInspectorOpenChange?.(next);
  };

  const handleSidebarWidthChange = (next: RailWidth): void => {
    if (sidebarWidth === undefined) {
      writeStoredRailWidth(storageKey, STORAGE_SUFFIX_SIDEBAR_WIDTH, next);
    }
    onSidebarWidthChange?.(next);
  };

  const handleInspectorWidthChange = (next: RailWidth): void => {
    if (inspectorWidth === undefined) {
      writeStoredRailWidth(storageKey, STORAGE_SUFFIX_INSPECTOR_WIDTH, next);
    }
    onInspectorWidthChange?.(next);
  };

  const [collapsed, setCollapsed] = useControllableState({
    value: sidebarCollapsed,
    defaultValue: initialSidebarCollapsed,
    onChange: handleSidebarChange,
  });

  const [inspectorIsOpen, setInspectorIsOpen] = useControllableState({
    value: inspectorOpen,
    defaultValue: initialInspectorOpen,
    onChange: handleInspectorChange,
  });

  const [currentSidebarWidth, setSidebarWidthState] = useControllableState<RailWidth>({
    value: sidebarWidth,
    defaultValue: initialSidebarWidth,
    onChange: handleSidebarWidthChange,
  });

  const [currentInspectorWidth, setInspectorWidthState] = useControllableState<RailWidth>({
    value: inspectorWidth,
    defaultValue: initialInspectorWidth,
    onChange: handleInspectorWidthChange,
  });

  const sidebarDrag = useSnapDrag({
    presets: SIDEBAR_PRESET_PX_LIST,
    value: SIDEBAR_PRESET_PX[currentSidebarWidth],
    onChange: (px) => setSidebarWidthState(widthNameFromPx(SIDEBAR_PRESET_PX, px)),
    'aria-label': 'Resize sidebar',
  });

  const inspectorDrag = useSnapDrag({
    presets: INSPECTOR_PRESET_PX_LIST,
    value: INSPECTOR_PRESET_PX[currentInspectorWidth],
    onChange: (px) => setInspectorWidthState(widthNameFromPx(INSPECTOR_PRESET_PX, px)),
    reverse: true,
    'aria-label': 'Resize inspector',
  });

  const [drawerIsOpen, setDrawerIsOpen] = useControllableState({
    value: drawerOpen,
    defaultValue: defaultDrawerOpen,
    onChange: onDrawerOpenChange,
  });

  const [commandPaletteIsOpen, setCommandPaletteIsOpen] = useControllableState({
    value: commandPaletteOpen,
    defaultValue: defaultCommandPaletteOpen,
    onChange: onCommandPaletteOpenChange,
  });

  const [dockIsOpen, setDockIsOpen] = useControllableState({
    value: dockOpen,
    defaultValue: defaultDockOpen,
    onChange: onDockOpenChange,
  });

  const [mobileOpen, setMobileOpen] = useControllableState({
    value: mobileMenuOpen,
    defaultValue: defaultMobileMenuOpen,
    onChange: onMobileMenuOpenChange,
  });

  const isMobile = useMediaQuery(mobileBreakpoint);

  // On mobile the inspector either disappears entirely (default) or slides
  // in as an edge-anchored Drawer summoned from the edge tab. Computed once
  // so the body slot, edge tab CSS hint, and the auto-Drawer agree.
  const inspectorInDrawer = isMobile && mobileInspector === 'drawer';

  // Auto-close the mobile overlay when the viewport resizes back to desktop —
  // otherwise an open overlay would linger as a hidden, focus-stealing layer.
  useEffect(() => {
    if (!isMobile && mobileOpen) setMobileOpen(false);
  }, [isMobile, mobileOpen, setMobileOpen]);

  useEscapeKey(() => setMobileOpen(false), Boolean(sidebar) && isMobile && mobileOpen);

  const sidebarCombo = typeof sidebarHotkey === 'string' ? sidebarHotkey : DEFAULT_SIDEBAR_HOTKEY;
  const inspectorCombo =
    typeof inspectorHotkey === 'string' ? inspectorHotkey : DEFAULT_INSPECTOR_HOTKEY;
  const drawerCombo = typeof drawerHotkey === 'string' ? drawerHotkey : DEFAULT_DRAWER_HOTKEY;
  const commandPaletteCombo =
    typeof commandPaletteHotkey === 'string'
      ? commandPaletteHotkey
      : DEFAULT_COMMAND_PALETTE_HOTKEY;
  const dockCombo = typeof dockHotkey === 'string' ? dockHotkey : DEFAULT_DOCK_HOTKEY;

  // Remember the last non-collapsed width so ⌘B with resize on swings back
  // to where you left it instead of always landing on `md`.
  const lastExpandedWidthRef = useRef<RailWidth>(
    initialSidebarWidth === 'sm' ? 'md' : initialSidebarWidth,
  );
  useEffect(() => {
    if (currentSidebarWidth !== 'sm') {
      lastExpandedWidthRef.current = currentSidebarWidth;
    }
  }, [currentSidebarWidth]);

  useHotkey(
    sidebarCombo,
    () => {
      if (sidebarResize) {
        // Resize mode: ⌘B toggles between sm (collapsed) and the last
        // non-sm width. The collapse boolean and the width state are
        // unified — at sm the rail is iconic, anywhere else it's labeled.
        if (currentSidebarWidth === 'sm') {
          setSidebarWidthState(lastExpandedWidthRef.current);
        } else {
          setSidebarWidthState('sm');
        }
      } else {
        setCollapsed((v) => !v);
      }
    },
    { enabled: sidebar !== undefined && sidebarHotkey !== false },
  );
  useHotkey(inspectorCombo, () => setInspectorIsOpen((v) => !v), {
    enabled: inspector !== undefined && inspectorHotkey !== false,
  });
  useHotkey(drawerCombo, () => setDrawerIsOpen((v) => !v), {
    enabled: drawer !== undefined && drawerHotkey !== false,
  });
  useHotkey(commandPaletteCombo, () => setCommandPaletteIsOpen((v) => !v), {
    enabled: commandPalette !== undefined && commandPaletteHotkey !== false,
  });
  useHotkey(dockCombo, () => setDockIsOpen((v) => !v), {
    enabled: dock !== undefined && dockHotkey !== false,
  });

  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);
  const cheatSheetCombo =
    typeof keyboardHintsHotkey === 'string' ? keyboardHintsHotkey : 'shift+?';
  useHotkey(cheatSheetCombo, () => setCheatSheetOpen((v) => !v), {
    enabled: keyboardHintsHotkey !== false,
    ignoreWhenTyping: true,
  });

  const shellHints: Array<{ keys: string; description: string }> = [];
  if (sidebar !== undefined && sidebarHotkey !== false) {
    shellHints.push({
      keys: sidebarCombo,
      description: sidebarResize ? 'Collapse / expand sidebar' : 'Toggle sidebar',
    });
  }
  if (inspector !== undefined && inspectorHotkey !== false) {
    shellHints.push({ keys: inspectorCombo, description: 'Toggle inspector' });
  }
  if (drawer !== undefined && drawerHotkey !== false) {
    shellHints.push({ keys: drawerCombo, description: 'Toggle drawer' });
  }
  if (commandPalette !== undefined && commandPaletteHotkey !== false) {
    shellHints.push({ keys: commandPaletteCombo, description: 'Open command palette' });
  }
  if (dock !== undefined && dockHotkey !== false) {
    shellHints.push({ keys: dockCombo, description: 'Toggle dock' });
  }
  if (keyboardHintsHotkey !== false) {
    shellHints.push({ keys: cheatSheetCombo, description: 'Show keyboard shortcuts' });
  }

  // On mobile the overlay always shows the full sidebar (with labels) —
  // the persistent-rail collapsed mode doesn't make sense as an overlay.
  // When resize is on, picking the smallest preset (`sm`) is the same as
  // collapsing the rail — the labels stop fitting below `md`, so the kit
  // treats "smallest" and "iconic" as one state.
  const sidebarAtMinWidth = sidebarResize && currentSidebarWidth === 'sm';
  const effectiveCollapsed = isMobile ? false : collapsed || sidebarAtMinWidth;

  const sidebarSlot =
    isValidElement(sidebar) && typeof sidebar.type !== 'string'
      ? cloneElement(
          sidebar as ReactElement<{ collapsed?: boolean; width?: RailWidth }>,
          sidebarResize
            ? { collapsed: effectiveCollapsed, width: currentSidebarWidth }
            : { collapsed: effectiveCollapsed },
        )
      : sidebar;

  const drawerSlot = drawer ? (
    <AppShellSlotProvider value={{ open: drawerIsOpen, onOpenChange: setDrawerIsOpen }}>
      {drawer}
    </AppShellSlotProvider>
  ) : null;

  const commandPaletteSlot = commandPalette ? (
    <AppShellSlotProvider
      value={{ open: commandPaletteIsOpen, onOpenChange: setCommandPaletteIsOpen }}
    >
      {commandPalette}
    </AppShellSlotProvider>
  ) : null;

  const dockSlot = dock ? (
    <AppShellSlotProvider value={{ open: dockIsOpen, onOpenChange: setDockIsOpen }}>
      {dock}
    </AppShellSlotProvider>
  ) : null;

  const showMenuTrigger = sidebar !== undefined;
  const triggerLabel = mobileOpen ? closeMenuLabel : openMenuLabel;
  const triggerInHeader = showMenuTrigger && Boolean(header);
  const triggerStandalone = showMenuTrigger && !header;

  const handleMenuTriggerClick = (): void => {
    setMobileOpen((v) => !v);
  };

  const skipLinkLabel =
    skipLink === false ? null : (skipLink?.label ?? 'Skip to content');

  const toasterEnabled = toaster !== false;
  const toasterProps: ToasterProps = toaster ? toaster : {};

  return (
    <div ref={ref as Ref<HTMLDivElement>} id={id} data-testid={dataTestId} className={styles.root}>
      {skipLinkLabel !== null ? (
        <a href={`#${mainId}`} className={styles.skipLink}>
          {skipLinkLabel}
        </a>
      ) : null}
      {header || triggerInHeader ? (
        <div className={styles.headerRow}>
          {triggerInHeader ? (
            <button
              type="button"
              className={styles.menuTrigger}
              aria-label={triggerLabel}
              aria-expanded={mobileOpen}
              aria-controls={id ? `${id}-sidebar` : undefined}
              onClick={handleMenuTriggerClick}
            >
              {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>
          ) : null}
          {header ? <div className={styles.headerSlot}>{header}</div> : null}
        </div>
      ) : null}
      {triggerStandalone ? (
        <button
          type="button"
          className={`${styles.menuTrigger} ${styles.menuTriggerStandalone}`}
          aria-label={triggerLabel}
          aria-expanded={mobileOpen}
          aria-controls={id ? `${id}-sidebar` : undefined}
          onClick={handleMenuTriggerClick}
        >
          {mobileOpen ? <XIcon /> : <MenuIcon />}
        </button>
      ) : null}
      <div className={styles.bodyRow}>
        {sidebar ? (
          <>
            {isMobile && mobileOpen ? (
              <button
                type="button"
                aria-label="Dismiss menu"
                className={styles.backdrop}
                onClick={() => setMobileOpen(false)}
              />
            ) : null}
            <div
              id={id ? `${id}-sidebar` : undefined}
              className={styles.sidebarSlot}
              data-mobile-open={isMobile && mobileOpen ? 'true' : undefined}
              style={
                sidebarResize && sidebarDrag.isDragging
                  ? ({
                      ['--touchstone-sidebar-rail-width' as string]: `${sidebarDrag.previewSize}px`,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              {sidebarSlot}
            </div>
            {sidebarResize ? (
              <div
                className={styles.resizeHandle}
                data-dragging={sidebarDrag.isDragging ? 'true' : undefined}
                {...sidebarDrag.handleProps}
              />
            ) : null}
          </>
        ) : null}
        <main id={mainId} className={styles.main({ density: mainDensity, padded: mainPadding })}>
          {children}
        </main>
        {inspector && inspectorResize && inspectorIsOpen ? (
          <div
            className={styles.resizeHandle}
            data-dragging={inspectorDrag.isDragging ? 'true' : undefined}
            {...inspectorDrag.handleProps}
          />
        ) : null}
        {inspector && !inspectorInDrawer ? (
          <div
            id={id ? `${id}-inspector` : undefined}
            className={styles.inspectorSlot}
            data-open={inspectorIsOpen ? 'true' : 'false'}
            style={
              inspectorResize
                ? {
                    width: inspectorDrag.isDragging
                      ? `${inspectorDrag.previewSize}px`
                      : `${INSPECTOR_PRESET_PX[currentInspectorWidth]}px`,
                  }
                : undefined
            }
          >
            {inspector}
          </div>
        ) : null}
        {inspector && inspectorEdgeTab && !inspectorIsOpen ? (
          <button
            type="button"
            className={styles.inspectorEdgeTab}
            aria-label={inspectorEdgeTabLabel}
            aria-expanded={false}
            aria-controls={id ? `${id}-inspector` : undefined}
            data-mobile-summon={inspectorInDrawer ? 'true' : undefined}
            onClick={() => setInspectorIsOpen(true)}
          >
            <ChevronLeftIcon size={14} />
          </button>
        ) : null}
      </div>
      {inspector && inspectorInDrawer ? (
        <Drawer open={inspectorIsOpen} onOpenChange={setInspectorIsOpen}>
          <Drawer.Content
            title={mobileInspectorTitle}
            side="right"
            size="md"
            data-testid={id ? `${id}-mobile-inspector` : undefined}
          >
            {inspector}
          </Drawer.Content>
        </Drawer>
      ) : null}
      {drawerSlot}
      {commandPaletteSlot}
      {dockSlot}
      {keyboardHintsHotkey !== false ? (
        <Dialog open={cheatSheetOpen} onOpenChange={setCheatSheetOpen}>
          <Dialog.Content title="Keyboard shortcuts" size="sm">
            <KeyboardHintList hints={shellHints} consumerHints={keyboardHints} />
          </Dialog.Content>
        </Dialog>
      ) : null}
      {toasterEnabled ? <Toaster {...toasterProps} /> : null}
    </div>
  );
});

interface KeyboardHintListProps {
  hints: ReadonlyArray<{ keys: string; description: string }>;
  consumerHints?: ReadonlyArray<{ keys: string; description: string }>;
}

function KeyboardHintList({ hints, consumerHints }: KeyboardHintListProps): React.JSX.Element {
  return (
    <div className={styles.hintList}>
      {hints.length > 0 ? (
        <KeyboardHintGroup heading="Shell" rows={hints} />
      ) : null}
      {consumerHints && consumerHints.length > 0 ? (
        <KeyboardHintGroup heading="This app" rows={consumerHints} />
      ) : null}
    </div>
  );
}

function KeyboardHintGroup({
  heading,
  rows,
}: {
  heading: string;
  rows: ReadonlyArray<{ keys: string; description: string }>;
}): React.JSX.Element {
  return (
    <section className={styles.hintGroup} aria-labelledby={`hint-group-${heading}`}>
      <h3 id={`hint-group-${heading}`} className={styles.hintGroupHeading}>
        {heading}
      </h3>
      <dl className={styles.hintRows}>
        {rows.map((row) => (
          <div key={`${row.keys}-${row.description}`} className={styles.hintRow}>
            <dt className={styles.hintDescription}>{row.description}</dt>
            <dd className={styles.hintKeys}>
              {formatComboForDisplay(row.keys).map((token, i) => (
                <Kbd key={`${row.keys}-${i}`} size="sm">
                  {token}
                </Kbd>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function formatComboForDisplay(combo: string): string[] {
  const mac =
    typeof navigator !== 'undefined' && /mac|iphone|ipad|ipod/i.test(navigator.platform);
  return combo.split('+').map((raw) => {
    const t = raw.toLowerCase().trim();
    if (t === 'mod' || t === 'cmd' || t === 'meta') return mac ? '⌘' : 'Ctrl';
    if (t === 'ctrl' || t === 'control') return 'Ctrl';
    if (t === 'shift') return '⇧';
    if (t === 'alt' || t === 'option' || t === 'opt') return mac ? '⌥' : 'Alt';
    if (t === 'enter' || t === 'return') return '↵';
    if (t === 'escape' || t === 'esc') return 'Esc';
    if (t === 'arrowleft') return '←';
    if (t === 'arrowright') return '→';
    if (t === 'arrowup') return '↑';
    if (t === 'arrowdown') return '↓';
    if (t === '`') return '`';
    if (t.length === 1) return t.toUpperCase();
    return raw;
  });
}
