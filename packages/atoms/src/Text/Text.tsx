import { forwardRef } from 'react';
import type { ElementType, HTMLAttributes, Ref } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { text } from './Text.css.js';

type TextVariants = NonNullable<RecipeVariants<typeof text>>;

export interface TextProps extends HTMLAttributes<HTMLElement>, TextVariants {
  /**
   * The element to render. Defaults to `<span>`.
   */
  as?: ElementType;
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as: Component = 'span', size, weight, tone, className, ...rest },
  ref,
) {
  const recipeClass = text({ size, weight, tone });
  return (
    <Component
      ref={ref as Ref<HTMLElement>}
      className={[recipeClass, className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
});
