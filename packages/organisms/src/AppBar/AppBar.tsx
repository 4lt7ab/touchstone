import { forwardRef } from 'react';
import type { ReactNode, Ref } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { BaseComponentProps } from '@touchstone/atoms';
import * as styles from './AppBar.css.js';

type AppBarVariants = NonNullable<RecipeVariants<typeof styles.appBar>>;

/**
 * Top bar of the app shell. Renders a row with three slots: `brand` on the
 * leading edge (logo + name), `children` in the center (typically a search
 * input or top-level nav), and `actions` aligned to the trailing edge
 * (typically Buttons). Wraps in `<header role="banner">` so assistive tech
 * announces the page-level header region.
 *
 * Set `sticky` to pin the bar to the top of the viewport on scroll. The
 * default `divider` renders a bottom border that separates the bar from
 * the body — set `divider={false}` for a flush look.
 */
export interface AppBarProps extends BaseComponentProps, AppBarVariants {
  /** Leading-edge slot — typically brand mark + product name. */
  brand?: ReactNode;
  /** Center slot — search, top-level nav, or other inline content. */
  children?: ReactNode;
  /** Trailing-edge slot — typically Buttons (sign-in, settings, avatar). */
  actions?: ReactNode;
  /** ARIA label for the banner landmark. @default 'application' */
  'aria-label'?: string;
}

export const AppBar = forwardRef<HTMLElement, AppBarProps>(function AppBar(
  {
    brand,
    children,
    actions,
    height,
    divider,
    sticky,
    id,
    'data-testid': dataTestId,
    'aria-label': ariaLabel,
  },
  ref,
) {
  return (
    <header
      ref={ref as Ref<HTMLElement>}
      id={id}
      data-testid={dataTestId}
      role="banner"
      aria-label={ariaLabel ?? 'application'}
      className={styles.appBar({ height, divider, sticky })}
    >
      {brand ? <div className={styles.brand}>{brand}</div> : null}
      {children ? <div className={styles.center}>{children}</div> : null}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  );
});
