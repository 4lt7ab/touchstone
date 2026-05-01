import { forwardRef } from 'react';
import type { ReactNode, Ref } from 'react';
import type { BaseComponentProps } from '@touchstone/atoms';
import * as styles from './AppShell.css.js';

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
 */
export interface AppShellProps extends BaseComponentProps {
  /** Top slot — typically `AppBar`. */
  header?: ReactNode;
  /** Leading-edge slot — typically `Sidebar`. */
  sidebar?: ReactNode;
  /** Main content area — your page. */
  children?: ReactNode;
}

export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(
  function AppShell(
    {
      header,
      sidebar,
      children,
      id,
      'data-testid': dataTestId,
    },
    ref,
  ) {
    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        id={id}
        data-testid={dataTestId}
        className={styles.root}
      >
        {header ? <div className={styles.headerSlot}>{header}</div> : null}
        <div className={styles.bodyRow}>
          {sidebar ? (
            <div className={styles.sidebarSlot}>{sidebar}</div>
          ) : null}
          <main className={styles.main}>{children}</main>
        </div>
      </div>
    );
  },
);
