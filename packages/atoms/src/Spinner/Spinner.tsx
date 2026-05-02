import { forwardRef } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { BaseComponentProps } from '../types.js';
import * as styles from './Spinner.css.js';

type RingVariants = NonNullable<RecipeVariants<typeof styles.ring>>;

/**
 * Loading indicator. Inherits its colour from the surrounding text colour
 * (`currentColor`), so it adopts whatever tone its container is in. The
 * spinning animation is suppressed under `prefers-reduced-motion: reduce`.
 *
 * Pair with an `aria-label` that names the work being awaited; if the
 * spinner sits next to visible loading text, mark it `aria-hidden` instead.
 */
export interface SpinnerProps extends BaseComponentProps, RingVariants {
  /** Accessible label naming the operation. Required unless `aria-hidden` is set. */
  'aria-label'?: string;
  /** Hide from assistive tech (use when adjacent text already announces the loading state). */
  'aria-hidden'?: boolean | 'true' | 'false';
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size, 'aria-label': ariaLabel, 'aria-hidden': ariaHidden, id, 'data-testid': dataTestId },
  ref,
) {
  return (
    <span
      ref={ref}
      role={ariaHidden ? undefined : 'status'}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      aria-live={ariaHidden ? undefined : 'polite'}
      id={id}
      data-testid={dataTestId}
      className={styles.root}
    >
      <span className={styles.ring({ size })} />
    </span>
  );
});
