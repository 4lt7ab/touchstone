import { cloneElement, forwardRef, isValidElement } from 'react';
import type { ReactElement, ReactNode, Ref } from 'react';
import type { BaseComponentProps } from '@touchstone/atoms';
import { useControllableState, useHotkey } from '@touchstone/hooks';
import * as styles from './AppShell.css.js';

const DEFAULT_SIDEBAR_HOTKEY = 'mod+b';
const DEFAULT_DRAWER_HOTKEY = 'mod+`';

/**
 * Outer chrome of an application — the layout that holds the header bar,
 * the sidebar nav, and the main content. Three slots: `header` (typically
 * `AppBar`) spans the top, `sidebar` (typically `Sidebar`) takes the
 * leading edge of the body row, and `children` fills the main scroll
 * region. The shell pins itself to `100vh` and the main column owns its
 * scroll, so the header and sidebar stay in place while content scrolls.
 *
 * Each slot is optional — render an `AppShell` with only `children` for
 * a standalone page, or only `sidebar` + `children` for a chrome-less
 * layout. The main region wraps in `<main role="main">`.
 *
 * AppShell owns the sidebar's collapsed state and the drawer's open state.
 * Pass `defaultSidebarCollapsed` / `defaultDrawerOpen` for uncontrolled use,
 * or the matching `sidebarCollapsed` + `onSidebarCollapsedChange` /
 * `drawerOpen` + `onDrawerOpenChange` pairs to control them. By default
 * ⌘B (Ctrl+B off mac) toggles the rail and ⌘\` toggles the drawer; remap
 * with `sidebarHotkey` / `drawerHotkey`, or pass `false` to either to opt
 * out (e.g. an editor that needs ⌘B for bold).
 */
export interface AppShellProps extends BaseComponentProps {
  /** Top slot — typically `AppBar`. */
  header?: ReactNode;
  /** Leading-edge slot — typically `Sidebar`. */
  sidebar?: ReactNode;
  /**
   * Overlay slot — a fully-formed `<Drawer>` summoned with the drawer
   * hotkey. AppShell injects `open` and `onOpenChange` via `cloneElement`,
   * so the inner Drawer behaves as a controlled overlay. Side, size,
   * title, and dismissible all stay on the Drawer itself.
   *
   * IMPORTANT: this must be a `<Drawer>` element directly. Wrapping it in
   * your own component (e.g. `<MyLedger />` returning a Drawer) silently
   * breaks the wiring — `cloneElement` injects onto the outer wrapper, not
   * the inner Drawer, and the open state never reaches the modal. Inline
   * the Drawer at the call site or factor a function (not a component)
   * that returns the Drawer JSX.
   *
   * For drawers triggered from a row or a button — not summoned from a
   * global hotkey — drop a standalone `<Drawer>` anywhere in `children`
   * with its own state. AppShell's drawer slot is for the one always-
   * summonable overlay (notification center, command palette, inspector).
   */
  drawer?: ReactNode;
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
}

export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
  {
    header,
    sidebar,
    drawer,
    children,
    sidebarCollapsed,
    defaultSidebarCollapsed = false,
    onSidebarCollapsedChange,
    sidebarHotkey,
    drawerOpen,
    defaultDrawerOpen = false,
    onDrawerOpenChange,
    drawerHotkey,
    id,
    'data-testid': dataTestId,
  },
  ref,
) {
  const [collapsed, setCollapsed] = useControllableState({
    value: sidebarCollapsed,
    defaultValue: defaultSidebarCollapsed,
    onChange: onSidebarCollapsedChange,
  });

  const [drawerIsOpen, setDrawerIsOpen] = useControllableState({
    value: drawerOpen,
    defaultValue: defaultDrawerOpen,
    onChange: onDrawerOpenChange,
  });

  const sidebarCombo = typeof sidebarHotkey === 'string' ? sidebarHotkey : DEFAULT_SIDEBAR_HOTKEY;
  const drawerCombo = typeof drawerHotkey === 'string' ? drawerHotkey : DEFAULT_DRAWER_HOTKEY;

  useHotkey(sidebarCombo, () => setCollapsed((v) => !v), {
    enabled: sidebar !== undefined && sidebarHotkey !== false,
  });
  useHotkey(drawerCombo, () => setDrawerIsOpen((v) => !v), {
    enabled: drawer !== undefined && drawerHotkey !== false,
  });

  const sidebarSlot =
    isValidElement(sidebar) && typeof sidebar.type !== 'string'
      ? cloneElement(sidebar as ReactElement<{ collapsed?: boolean }>, { collapsed })
      : sidebar;

  const drawerSlot =
    isValidElement(drawer) && typeof drawer.type !== 'string'
      ? cloneElement(
          drawer as ReactElement<{ open?: boolean; onOpenChange?: (open: boolean) => void }>,
          { open: drawerIsOpen, onOpenChange: setDrawerIsOpen },
        )
      : drawer;

  return (
    <div ref={ref as Ref<HTMLDivElement>} id={id} data-testid={dataTestId} className={styles.root}>
      {header ? <div className={styles.headerSlot}>{header}</div> : null}
      <div className={styles.bodyRow}>
        {sidebar ? <div className={styles.sidebarSlot}>{sidebarSlot}</div> : null}
        <main className={styles.main}>{children}</main>
      </div>
      {drawerSlot}
    </div>
  );
});
