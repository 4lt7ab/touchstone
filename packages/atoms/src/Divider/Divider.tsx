import { forwardRef } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { BaseComponentProps } from '../types.js';
import { divider } from './Divider.css.js';

type DividerVariants = NonNullable<RecipeVariants<typeof divider>>;

/**
 * Semantic separator. Renders as `<hr>` for horizontal dividers (the browser
 * gives it the right ARIA role for free) or as a `<div role="separator">`
 * for vertical dividers (no native vertical hr).
 */
export interface DividerProps extends BaseComponentProps, DividerVariants {
  /**
   * When true, the divider is purely decorative — `aria-hidden` is set so
   * assistive tech skips it. Use this for thematic divisions that don't
   * change the page outline.
   * @default false
   */
  decorative?: boolean;
}

export const Divider = forwardRef<HTMLElement, DividerProps>(function Divider(
  { orientation = 'horizontal', decorative = false, id, 'data-testid': dataTestId },
  ref,
) {
  if (orientation === 'vertical') {
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        role={decorative ? 'none' : 'separator'}
        aria-orientation={decorative ? undefined : 'vertical'}
        aria-hidden={decorative || undefined}
        id={id}
        data-testid={dataTestId}
        className={divider({ orientation })}
      />
    );
  }
  return (
    <hr
      ref={ref as React.Ref<HTMLHRElement>}
      aria-hidden={decorative || undefined}
      id={id}
      data-testid={dataTestId}
      className={divider({ orientation })}
    />
  );
});
