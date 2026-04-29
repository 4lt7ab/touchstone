import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { button } from './Button.css.js';

type ButtonVariants = NonNullable<RecipeVariants<typeof button>>;

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    ButtonVariants {
  /**
   * Render as the immediate child element instead of a `<button>`. Useful for
   * making a styled "button" from an `<a>` or a router link without losing
   * the visual treatment. The child must accept the merged props.
   */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { intent, size, fullWidth, asChild = false, className, type, ...rest },
  ref,
) {
  const Component = asChild ? Slot : 'button';
  const recipeClass = button({ intent, size, fullWidth });
  return (
    <Component
      ref={ref}
      className={[recipeClass, className].filter(Boolean).join(' ')}
      type={asChild ? undefined : (type ?? 'button')}
      {...rest}
    />
  );
});
