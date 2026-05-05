import { cloneElement, forwardRef, isValidElement, useEffect } from 'react';
import type { ReactElement, ReactNode, Ref } from 'react';
import type { BaseComponentProps } from '@touchstone/atoms';
import {
  useControllableState,
  useEscapeKey,
  useHotkey,
  useMediaQuery,
} from '@touchstone/hooks';
import { MenuIcon, XIcon } from '@touchstone/icons';
import * as styles from './AppShell.css.js';

const DEFAULT_SIDEBAR_HOTKEY = 'mod+b';
const DEFAULT_DRAWER_HOTKEY = 'mod+`';
const DEFAULT_MOBILE_BREAKPOINT = '(max-width: 959px)';

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
 *
 * Responsive: below `mobileBreakpoint` (default `(max-width: 959px)`) the
 * persistent sidebar disappears and a hamburger trigger takes its place —
 * tapping it slides the sidebar in as an overlay with a backdrop. Click
 * the backdrop, press Escape, or pick an item to dismiss. The sidebar's
 * `collapsed` state is force-overridden to `false` while the overlay is
 * shown so labels are visible. Pass `mobileMenuOpen` / `onMobileMenuOpenChange`
 * to control it externally; otherwise it manages itself.
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
    mobileBreakpoint = DEFAULT_MOBILE_BREAKPOINT,
    mobileMenuOpen,
    defaultMobileMenuOpen = false,
    onMobileMenuOpenChange,
    openMenuLabel = 'Open menu',
    closeMenuLabel = 'Close menu',
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

  const [mobileOpen, setMobileOpen] = useControllableState({
    value: mobileMenuOpen,
    defaultValue: defaultMobileMenuOpen,
    onChange: onMobileMenuOpenChange,
  });

  const isMobile = useMediaQuery(mobileBreakpoint);

  // Auto-close the mobile overlay when the viewport resizes back to desktop —
  // otherwise an open overlay would linger as a hidden, focus-stealing layer.
  useEffect(() => {
    if (!isMobile && mobileOpen) setMobileOpen(false);
  }, [isMobile, mobileOpen, setMobileOpen]);

  useEscapeKey(() => setMobileOpen(false), Boolean(sidebar) && isMobile && mobileOpen);

  const sidebarCombo = typeof sidebarHotkey === 'string' ? sidebarHotkey : DEFAULT_SIDEBAR_HOTKEY;
  const drawerCombo = typeof drawerHotkey === 'string' ? drawerHotkey : DEFAULT_DRAWER_HOTKEY;

  useHotkey(sidebarCombo, () => setCollapsed((v) => !v), {
    enabled: sidebar !== undefined && sidebarHotkey !== false,
  });
  useHotkey(drawerCombo, () => setDrawerIsOpen((v) => !v), {
    enabled: drawer !== undefined && drawerHotkey !== false,
  });

  // On mobile the overlay always shows the full sidebar (with labels) —
  // the persistent-rail collapsed mode doesn't make sense as an overlay.
  const effectiveCollapsed = isMobile ? false : collapsed;

  const sidebarSlot =
    isValidElement(sidebar) && typeof sidebar.type !== 'string'
      ? cloneElement(sidebar as ReactElement<{ collapsed?: boolean }>, {
          collapsed: effectiveCollapsed,
        })
      : sidebar;

  const drawerSlot =
    isValidElement(drawer) && typeof drawer.type !== 'string'
      ? cloneElement(
          drawer as ReactElement<{ open?: boolean; onOpenChange?: (open: boolean) => void }>,
          { open: drawerIsOpen, onOpenChange: setDrawerIsOpen },
        )
      : drawer;

  const showMenuTrigger = sidebar !== undefined;
  const triggerLabel = mobileOpen ? closeMenuLabel : openMenuLabel;
  const triggerInHeader = showMenuTrigger && Boolean(header);
  const triggerStandalone = showMenuTrigger && !header;

  const handleMenuTriggerClick = (): void => {
    setMobileOpen((v) => !v);
  };

  return (
    <div ref={ref as Ref<HTMLDivElement>} id={id} data-testid={dataTestId} className={styles.root}>
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
            >
              {sidebarSlot}
            </div>
          </>
        ) : null}
        <main className={styles.main}>{children}</main>
      </div>
      {drawerSlot}
    </div>
  );
});
