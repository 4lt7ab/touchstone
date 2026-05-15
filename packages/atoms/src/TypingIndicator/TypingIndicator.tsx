import { forwardRef } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { BaseComponentProps } from '../types.js';
import * as styles from './TypingIndicator.css.js';

type TypingIndicatorVariants = NonNullable<RecipeVariants<typeof styles.root>>;

/**
 * Three breathing dots that signal an assistant turn is being composed.
 * Inherits its colour from the surrounding text colour, so it adopts the
 * tone of whatever container it sits in. The bounce animation is suppressed
 * under `prefers-reduced-motion: reduce`.
 *
 * The visible dots are decorative; the accessible name is announced through
 * a hidden live region (`aria-live='polite'`) so a screen reader hears
 * "Assistant is typing" once when the indicator appears.
 */
export interface TypingIndicatorProps extends BaseComponentProps, TypingIndicatorVariants {
  /** Accessible message announced to assistive tech. @default 'Assistant is typing' */
  label?: string;
}

export const TypingIndicator = forwardRef<HTMLSpanElement, TypingIndicatorProps>(
  function TypingIndicator(
    { size, label = 'Assistant is typing', id, 'data-testid': dataTestId },
    ref,
  ) {
    return (
      <span
        ref={ref}
        id={id}
        data-testid={dataTestId}
        role="status"
        aria-live="polite"
        className={styles.root({ size })}
      >
        <span aria-hidden="true" className={`${styles.dot} ${styles.dotOne}`} />
        <span aria-hidden="true" className={`${styles.dot} ${styles.dotTwo}`} />
        <span aria-hidden="true" className={`${styles.dot} ${styles.dotThree}`} />
        <span className={styles.srOnly}>{label}</span>
      </span>
    );
  },
);
