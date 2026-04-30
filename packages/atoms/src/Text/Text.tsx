import { forwardRef } from 'react';
import type { AriaAttributes, ElementType, ReactNode, Ref } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { BaseComponentProps } from '../types.js';
import { text } from './Text.css.js';

type TextVariants = NonNullable<RecipeVariants<typeof text>>;

/**
 * Typography atom. `size` / `weight` / `tone` map directly to the type scale
 * tokens; `as` chooses the rendered element (`span` by default; `p` / `h1`–
 * `h6` for prose). Visual tokens — color, font-size, line-height — must come
 * through the variant API, not through `style` (which is intentionally not
 * accepted).
 */
export interface TextProps extends BaseComponentProps, TextVariants {
  /** Element to render. @default 'span' */
  as?: ElementType;
  /** Text content. */
  children?: ReactNode;
  /** Additional class names — typically a vanilla-extract layout class. */
  className?: string;
  'aria-label'?: AriaAttributes['aria-label'];
  'aria-labelledby'?: AriaAttributes['aria-labelledby'];
  'aria-hidden'?: AriaAttributes['aria-hidden'];
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as: Component = 'span', size, weight, tone, className, children, ...rest },
  ref,
) {
  const recipeClass = text({ size, weight, tone });
  return (
    <Component
      ref={ref as Ref<HTMLElement>}
      className={[recipeClass, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </Component>
  );
});
