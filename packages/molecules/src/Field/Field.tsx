import { forwardRef, useId } from 'react';
import { Input, type InputProps } from '@touchstone/atoms';
import * as styles from './Field.css.js';

export interface FieldProps extends Omit<InputProps, 'id' | 'aria-describedby'> {
  /** Visible label text. */
  label: string;
  /** Optional helper text shown beneath the input when there is no error. */
  hint?: string;
  /** Error message. When present, the input is marked invalid and the hint is hidden. */
  error?: string;
  /** Override the auto-generated input id. */
  id?: string;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, error, id: providedId, invalid, ...rest },
  ref,
) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const isInvalid = invalid ?? Boolean(error);

  const describedBy =
    [error ? errorId : null, hint && !error ? hintId : null].filter(Boolean).join(' ') ||
    undefined;

  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <Input
        ref={ref}
        id={id}
        invalid={isInvalid}
        aria-describedby={describedBy}
        {...rest}
      />
      {error ? (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      ) : hint ? (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      ) : null}
    </div>
  );
});
