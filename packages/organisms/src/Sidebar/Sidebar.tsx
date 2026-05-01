import { forwardRef } from 'react';
import type { ReactNode, Ref } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { BaseComponentProps } from '@touchstone/atoms';
import * as styles from './Sidebar.css.js';

type SidebarVariants = NonNullable<RecipeVariants<typeof styles.sidebar>>;

/**
 * Vertical navigation column for the app shell. Wraps content in
 * `<nav role="navigation">` so the region is announced as the primary
 * navigation landmark. Three slots: an optional `header` (brand mark or
 * section label) at the top, the scrollable `children` body in the middle
 * (typically `NavSection` / `NavItem`), and an optional `footer` at the
 * bottom (user info, settings link).
 *
 * `width` chooses a preset column width; the body always scrolls when its
 * content exceeds the available space, leaving the header and footer
 * pinned. Set `divider={false}` to remove the trailing border.
 */
export interface SidebarProps extends BaseComponentProps, SidebarVariants {
  /** Top slot — typically brand or section label. */
  header?: ReactNode;
  /** Scrollable middle slot — typically NavSection / NavItem rows. */
  children?: ReactNode;
  /** Bottom slot — typically user info or settings link. */
  footer?: ReactNode;
  /** ARIA label for the navigation landmark. @default 'primary' */
  'aria-label'?: string;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  {
    header: headerSlot,
    children,
    footer: footerSlot,
    width,
    divider,
    height,
    id,
    'data-testid': dataTestId,
    'aria-label': ariaLabel,
  },
  ref,
) {
  return (
    <nav
      ref={ref as Ref<HTMLElement>}
      id={id}
      data-testid={dataTestId}
      aria-label={ariaLabel ?? 'primary'}
      className={styles.sidebar({ width, divider, height })}
    >
      {headerSlot ? <div className={styles.header}>{headerSlot}</div> : null}
      <div className={styles.body}>{children}</div>
      {footerSlot ? <div className={styles.footer}>{footerSlot}</div> : null}
    </nav>
  );
});
