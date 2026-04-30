import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { BaseComponentProps } from '../types.js';
import { badge } from './Badge.css.js';

type BadgeVariants = NonNullable<RecipeVariants<typeof badge>>;

/**
 * Inline status pill. `tone` chooses one of the semantic feedback colours
 * (or `accent` for the maker's-mark accent, `neutral` for plain). Reserved
 * for short labels — counts, statuses, tags. Use `<AlertBanner>` for
 * full-row messaging.
 */
export interface BadgeProps extends BaseComponentProps, BadgeVariants {
  /** Badge content. Keep short: a word, a count, a status. */
  children?: ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={badge({ tone })} {...rest}>
      {children}
    </span>
  );
});
