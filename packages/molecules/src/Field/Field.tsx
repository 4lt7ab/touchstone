import { cloneElement, forwardRef, isValidElement, useId } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Input, type InputProps } from '@touchstone/atoms';
import * as styles from './Field.css.js';

/**
 * Labelled form control. The zero-config call renders an `Input` and wires
 * `label` / `hint` / `error` ids to it. Pass any other control as a child
 * (`Switch`, `SegmentedControl`, …) to wrap it with the same labelling
 * shell — the child is cloned with `id`, `aria-labelledby`, and
 * `aria-describedby` so the visible label, hint, and error all reach
 * assistive tech without the consumer minting ids by hand.
 *
 * When a child is passed, the Input-specific props (`placeholder`, `type`,
 * `value`, …) have no destination and are ignored; the control comes from
 * the child's own props.
 */
export interface FieldProps extends Omit<InputProps, 'id' | 'aria-describedby'> {
  /** Visible label text. */
  label: string;
  /** Optional helper text shown beneath the control when there is no error. */
  hint?: string;
  /** Error message. When present, the auto-Input is marked invalid and the hint is hidden. */
  error?: string;
  /** Override the auto-generated control id. */
  id?: string;
  /**
   * Render a custom control instead of the auto-`Input`. The child element
   * is cloned with the field's id and aria wiring; its existing ref / event
   * handlers / styling pass through unchanged.
   */
  children?: ReactNode;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, error, id: providedId, invalid, children, ...rest },
  ref,
) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const isInvalid = invalid ?? Boolean(error);
  const describedBy =
    [error ? errorId : null, hint && !error ? hintId : null].filter(Boolean).join(' ') || undefined;

  const childInvalidProps: Record<string, unknown> = isInvalid
    ? { invalid: true, 'aria-invalid': 'true' }
    : {};
  const control = isValidElement(children) ? (
    cloneElement(children as ReactElement<Record<string, unknown>>, {
      id,
      'aria-labelledby': labelId,
      'aria-describedby': describedBy,
      ...childInvalidProps,
    })
  ) : (
    <Input ref={ref} id={id} invalid={isInvalid} aria-describedby={describedBy} {...rest} />
  );

  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={id} id={labelId}>
        {label}
      </label>
      {control}
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
