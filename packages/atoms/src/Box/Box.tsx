import { forwardRef } from 'react';
import type { ElementType, HTMLAttributes, Ref } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { box } from './Box.css.js';

type BoxVariants = NonNullable<RecipeVariants<typeof box>>;

export interface BoxProps extends HTMLAttributes<HTMLElement>, BoxVariants {
  /**
   * The element to render. Defaults to `<div>`.
   */
  as?: ElementType;
}

export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
  { as: Component = 'div', padding, radius, surface, className, ...rest },
  ref,
) {
  const recipeClass = box({ padding, radius, surface });
  return (
    <Component
      ref={ref as Ref<HTMLElement>}
      className={[recipeClass, className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
});
