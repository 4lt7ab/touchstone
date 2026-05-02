import { forwardRef } from 'react';
import type {
  AriaAttributes,
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
} from 'react';
import type { BaseComponentProps } from '../types.js';
import { textarea } from './Textarea.css.js';

/**
 * Multi-line text input. The multi-line twin of `Input` — same focus and
 * border treatment, same `invalid` state, same `Field` auto-wiring. Use
 * for descriptions, notes, comments — anything where a single line is
 * too short.
 *
 * `resize` defaults to `vertical`; consumers who want a fixed-height
 * region pass `resize='none'`.
 */
export interface TextareaProps extends BaseComponentProps {
  /** Marks the textarea as invalid. Sets `aria-invalid` automatically. */
  invalid?: boolean;
  /** Resize handle behaviour. @default 'vertical' */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  /** Controlled value. */
  value?: string | number | readonly string[];
  /** Initial value for uncontrolled usage. */
  defaultValue?: string | number | readonly string[];
  /** Placeholder text. */
  placeholder?: string;
  /** Disable the textarea. */
  disabled?: boolean;
  /** Make the textarea read-only. */
  readOnly?: boolean;
  /** Mark required for form submission. */
  required?: boolean;
  /** Auto-focus on mount. */
  autoFocus?: boolean;
  /** Browser autofill hint. */
  autoComplete?: string;
  /** Field name submitted with the form. */
  name?: string;
  /** Form id this textarea belongs to (when rendered outside its `<form>`). */
  form?: string;
  /** Tab order. */
  tabIndex?: number;
  /** Visible row count (height in lines). @default 3 */
  rows?: number;
  /** Visible column count. */
  cols?: number;
  /** Max length in characters. */
  maxLength?: number;
  /** Min length in characters. */
  minLength?: number;
  /** Browser line-wrap behaviour. */
  wrap?: 'soft' | 'hard' | 'off';
  /** Soft keyboard hint on mobile. */
  inputMode?: 'none' | 'text' | 'search' | 'email' | 'url';
  /** Change handler. */
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  /** Focus handlers. */
  onFocus?: FocusEventHandler<HTMLTextAreaElement>;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  /** Keyboard handler. */
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
  'aria-label'?: AriaAttributes['aria-label'];
  'aria-labelledby'?: AriaAttributes['aria-labelledby'];
  'aria-describedby'?: AriaAttributes['aria-describedby'];
  'aria-invalid'?: AriaAttributes['aria-invalid'];
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid = false, resize = 'vertical', rows = 3, 'aria-invalid': ariaInvalid, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={ariaInvalid ?? (invalid || undefined)}
      className={textarea({ invalid, resize })}
      {...rest}
    />
  );
});
