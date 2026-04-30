import { forwardRef } from 'react';
import type {
  AriaAttributes,
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
} from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { Slot } from '../Slot/Slot.js';
import type { BaseComponentProps } from '../types.js';
import { button } from './Button.css.js';

type ButtonVariants = NonNullable<RecipeVariants<typeof button>>;

/**
 * Action atom. Visual treatment — `intent`, `size`, `fullWidth`, `shape` —
 * comes through the recipe; native button behavior (form submission, focus,
 * ARIA) is enumerated explicitly so consumers can't smuggle in `style`
 * overrides that bypass the design system.
 *
 * Use `shape="square"` for icon-only affordances (dismiss, toggle, overflow);
 * the recipe pins width to height at the chosen `size` and zeros the inline
 * padding. Pair with an `aria-label` so the button is announced.
 */
export interface ButtonProps extends BaseComponentProps, ButtonVariants {
  /** Visible button content. */
  children?: ReactNode;
  /** Click handler. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Disable the button. Click handlers won't fire and the recipe applies the disabled style. */
  disabled?: boolean;
  /**
   * Form button type. @default 'button' (avoids accidental form submission).
   * When `asChild` is true the type is omitted because the child element
   * may not be a `<button>`.
   */
  type?: 'button' | 'submit' | 'reset';
  /** Form id this button submits / resets, when rendered outside its `<form>`. */
  form?: string;
  /** Submitted as a form value when `type='submit'`. */
  name?: string;
  /** Submitted as a form value when `type='submit'`. */
  value?: string;
  /** Auto-focus on mount. */
  autoFocus?: boolean;
  /** Tab order. */
  tabIndex?: number;
  /** Focus event handlers. */
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  /** Keyboard event handler. */
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
  /**
   * Render as the immediate child element instead of `<button>`. Use to
   * forward Button styling to an `<a>` or a router `<Link>`.
   */
  asChild?: boolean;
  'aria-label'?: AriaAttributes['aria-label'];
  'aria-labelledby'?: AriaAttributes['aria-labelledby'];
  'aria-describedby'?: AriaAttributes['aria-describedby'];
  'aria-expanded'?: AriaAttributes['aria-expanded'];
  'aria-controls'?: AriaAttributes['aria-controls'];
  'aria-haspopup'?: AriaAttributes['aria-haspopup'];
  'aria-pressed'?: AriaAttributes['aria-pressed'];
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { intent, size, fullWidth, shape, asChild = false, type, children, ...rest },
  ref,
) {
  const Component = asChild ? Slot : 'button';
  const recipeClass = button({ intent, size, fullWidth, shape });
  return (
    <Component
      ref={ref}
      className={recipeClass}
      type={asChild ? undefined : (type ?? 'button')}
      {...rest}
    >
      {children}
    </Component>
  );
});
