import { forwardRef } from 'react';
import type { ReactNode, Ref } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { BaseComponentProps } from '@touchstone/atoms';
import * as styles from './CenteredShell.css.js';

type CardVariants = NonNullable<RecipeVariants<typeof styles.card>>;

export interface CenteredShellProps extends BaseComponentProps {
  /** Children — typically `Brand`, `Card`, `Footer`. */
  children?: ReactNode;
}

/**
 * Centered-card outer chrome — themed full-bleed backdrop with a centered
 * column. Three slots: optional `Brand` above, `Card` (the `<main>` landmark)
 * holding the page content, optional `Footer` below.
 *
 * The shell pins to `100vh`, paints the page background, and centers its
 * column. The `Card` slot is a width-constrained layout container, not a
 * styled surface — drop a `Surface` inside it to choose a visual treatment.
 */
const CenteredShellRoot = forwardRef<HTMLDivElement, CenteredShellProps>(function CenteredShell(
  { children, id, 'data-testid': dataTestId },
  ref,
) {
  return (
    <div
      ref={ref as Ref<HTMLDivElement>}
      id={id}
      data-testid={dataTestId}
      className={styles.root}
    >
      {children}
    </div>
  );
});

export interface CenteredShellBrandProps extends BaseComponentProps {
  /** Brand content — typically a wordmark and tagline. */
  children?: ReactNode;
}

const CenteredShellBrand = forwardRef<HTMLDivElement, CenteredShellBrandProps>(
  function CenteredShellBrand({ children, id, 'data-testid': dataTestId }, ref) {
    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        id={id}
        data-testid={dataTestId}
        className={styles.brand}
      >
        {children}
      </div>
    );
  },
);

export interface CenteredShellCardProps extends BaseComponentProps {
  /** Card content — typically a `Surface` wrapping a `Stack`. */
  children?: ReactNode;
  /** Width clamp for the card. @default 'md' */
  size?: CardVariants['size'];
  /** Accessible label for the main region. */
  'aria-label'?: string;
  /** Reference to the element that labels the main region. */
  'aria-labelledby'?: string;
}

const CenteredShellCard = forwardRef<HTMLElement, CenteredShellCardProps>(
  function CenteredShellCard(
    {
      children,
      size = 'md',
      id,
      'data-testid': dataTestId,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
    },
    ref,
  ) {
    return (
      <main
        ref={ref as Ref<HTMLElement>}
        id={id}
        data-testid={dataTestId}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={styles.card({ size })}
      >
        {children}
      </main>
    );
  },
);

export interface CenteredShellFooterProps extends BaseComponentProps {
  /** Footer content — typically build version, terms / privacy links. */
  children?: ReactNode;
}

const CenteredShellFooter = forwardRef<HTMLElement, CenteredShellFooterProps>(
  function CenteredShellFooter({ children, id, 'data-testid': dataTestId }, ref) {
    return (
      <footer
        ref={ref as Ref<HTMLElement>}
        id={id}
        data-testid={dataTestId}
        className={styles.footer}
      >
        {children}
      </footer>
    );
  },
);

export const CenteredShell = Object.assign(CenteredShellRoot, {
  Brand: CenteredShellBrand,
  Card: CenteredShellCard,
  Footer: CenteredShellFooter,
});
