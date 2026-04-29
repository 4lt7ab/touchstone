import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { input } from './Input.css.js';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Marks the input as invalid for styling purposes. The `aria-invalid`
   * attribute is set automatically when this is true.
   */
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid = false, className, type = 'text', 'aria-invalid': ariaInvalid, ...rest },
  ref,
) {
  const recipeClass = input({ invalid });
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={ariaInvalid ?? (invalid || undefined)}
      className={[recipeClass, className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
});
