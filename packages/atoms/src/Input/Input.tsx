import { forwardRef } from 'react';
import type {
  AriaAttributes,
  ChangeEventHandler,
  FocusEventHandler,
  HTMLInputTypeAttribute,
  KeyboardEventHandler,
} from 'react';
import type { BaseComponentProps } from '../types.js';
import { input } from './Input.css.js';

/** Input types this component supports — text-like only. Date / file / etc.
 * have separate primitives where it makes sense. */
export type InputType = Extract<
  HTMLInputTypeAttribute,
  'text' | 'email' | 'password' | 'url' | 'tel' | 'number' | 'search'
>;

/**
 * Single-line text input. Visual state — invalid, focused, disabled — is
 * driven by props that map to the recipe; consumers cannot pass `style` or
 * `className` so the input's appearance can't be smuggled around.
 *
 * Pair with `Field` from `@touchstone/molecules` for label, hint, and error
 * wiring with proper aria-* relationships.
 */
export interface InputProps extends BaseComponentProps {
  /** Marks the input as invalid. Sets `aria-invalid` automatically. */
  invalid?: boolean;
  /** Input type. @default 'text' */
  type?: InputType;
  /** Controlled value. */
  value?: string | number | readonly string[];
  /** Initial value for uncontrolled usage. */
  defaultValue?: string | number | readonly string[];
  /** Placeholder text. */
  placeholder?: string;
  /** Disable the input. */
  disabled?: boolean;
  /** Make the input read-only. */
  readOnly?: boolean;
  /** Mark the input as required for form submission. */
  required?: boolean;
  /** Auto-focus on mount. */
  autoFocus?: boolean;
  /** Browser autofill hint. */
  autoComplete?: string;
  /** Field name submitted with the form. */
  name?: string;
  /** Form id this input belongs to (when rendered outside its `<form>`). */
  form?: string;
  /** Tab order. */
  tabIndex?: number;
  /** Soft keyboard hint on mobile. */
  inputMode?:
    | 'none'
    | 'text'
    | 'decimal'
    | 'numeric'
    | 'tel'
    | 'search'
    | 'email'
    | 'url';
  /** Max length in characters. */
  maxLength?: number;
  /** Min length in characters. */
  minLength?: number;
  /** Numeric / date min (used with `type='number'`). */
  min?: string | number;
  /** Numeric / date max. */
  max?: string | number;
  /** Numeric step. */
  step?: string | number;
  /** Validation regex pattern. */
  pattern?: string;
  /** Datalist id for native autocomplete. */
  list?: string;
  /** Change handler. */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /** Focus event handlers. */
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  /** Keyboard handler. */
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  'aria-label'?: AriaAttributes['aria-label'];
  'aria-labelledby'?: AriaAttributes['aria-labelledby'];
  'aria-describedby'?: AriaAttributes['aria-describedby'];
  'aria-invalid'?: AriaAttributes['aria-invalid'];
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid = false, type = 'text', 'aria-invalid': ariaInvalid, ...rest },
  ref,
) {
  const recipeClass = input({ invalid });
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={ariaInvalid ?? (invalid || undefined)}
      className={recipeClass}
      {...rest}
    />
  );
});
