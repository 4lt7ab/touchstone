import { forwardRef } from 'react';
import type { BaseComponentProps } from '../types.js';
import * as styles from './ProgressBar.css.js';

/**
 * Determinate linear progress. The counterpart to `Skeleton` (placeholder)
 * and `Spinner` (indeterminate) for save / upload / import flows where
 * the consumer has a real percentage. The track reads `bgMuted`; the fill
 * picks a feedback colour from the theme contract via `tone`.
 *
 * Renders with `role="progressbar"` and the standard ARIA value attributes.
 * Pair with a label naming the operation; if a sibling already announces
 * the work, mark it `aria-hidden`.
 */
export interface ProgressBarProps extends BaseComponentProps {
  /** Current value. Clamped to `[min, max]`. */
  value: number;
  /** Lower bound. @default 0 */
  min?: number;
  /** Upper bound. @default 100 */
  max?: number;
  /** Bar height. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Fill colour. @default 'accent' */
  tone?: 'accent' | 'success' | 'warning' | 'danger';
  /** Accessible label naming the operation in progress. */
  'aria-label'?: string;
  /** Or labelledby — id of an external label element. */
  'aria-labelledby'?: string;
  /** Hide from assistive tech (use when a sibling already announces). */
  'aria-hidden'?: boolean | 'true' | 'false';
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(function ProgressBar(
  {
    value,
    min = 0,
    max = 100,
    size = 'md',
    tone = 'accent',
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-hidden': ariaHidden,
    id,
    'data-testid': dataTestId,
  },
  ref,
) {
  const clamped = Math.max(min, Math.min(max, value));
  const range = max - min;
  const pct = range > 0 ? ((clamped - min) / range) * 100 : 0;
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={clamped}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-labelledby={ariaHidden ? undefined : ariaLabelledBy}
      aria-hidden={ariaHidden}
      id={id}
      data-testid={dataTestId}
      className={styles.root({ size })}
    >
      <span className={styles.fill({ tone })} style={{ width: `${pct}%` }} />
    </div>
  );
});
