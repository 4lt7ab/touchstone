import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { BaseComponentProps } from '../types.js';
import { skeleton } from './Skeleton.css.js';

type SkeletonVariants = NonNullable<RecipeVariants<typeof skeleton>>;

/**
 * Placeholder for content that hasn't loaded yet. The pulse animation is
 * suppressed under `prefers-reduced-motion: reduce` (a static dimmed block
 * is shown instead). Sized via `width` / `height` props — these are layout
 * concerns the recipe can't infer.
 */
export interface SkeletonProps extends BaseComponentProps, SkeletonVariants {
  /** CSS width — px, %, or any valid value. */
  width?: CSSProperties['width'];
  /** CSS height — px, %, or any valid value. Defaults are shape-appropriate. */
  height?: CSSProperties['height'];
  /**
   * Accessible loading label. The element is announced as `role="status"`
   * with `aria-busy=true`. Provide a label naming the content being
   * substituted, or set `aria-hidden` if a sibling already announces.
   */
  'aria-label'?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  {
    shape,
    width,
    height,
    'aria-label': ariaLabel,
    'aria-hidden': ariaHidden,
    id,
    'data-testid': dataTestId,
  },
  ref,
) {
  return (
    <span
      ref={ref}
      role={ariaHidden ? undefined : 'status'}
      aria-busy={ariaHidden ? undefined : true}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      id={id}
      data-testid={dataTestId}
      className={skeleton({ shape })}
      style={{ width, height }}
    />
  );
});
