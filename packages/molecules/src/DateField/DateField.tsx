import { forwardRef } from 'react';
import { DateInput, type DateInputProps } from '@touchstone/atoms';
import { Field } from '../Field/Field.js';

/**
 * Labelled date input. Wraps `DateInput` in `Field`, wiring label, hint,
 * and error to the segmented input via aria-labelledby / aria-describedby.
 *
 * Use this when you want a freestanding `DateInput` with a visible label.
 * For an input that opens a calendar on focus, reach for `DatePicker`.
 */
export interface DateFieldProps extends Omit<DateInputProps, 'id' | 'aria-describedby'> {
  /** Visible label text. */
  label: string;
  /** Helper text shown under the input when there is no error. */
  hint?: string;
  /** Error message. When present, the input is marked invalid and the hint is hidden. */
  error?: string;
  /** Override the auto-generated control id. */
  id?: string;
}

export const DateField = forwardRef<HTMLDivElement, DateFieldProps>(function DateField(
  { label, hint, error, id, invalid, ...rest },
  ref,
) {
  const isInvalid = invalid ?? Boolean(error);
  return (
    <Field label={label} hint={hint} error={error} id={id} invalid={isInvalid}>
      <DateInput ref={ref} invalid={isInvalid} {...rest} />
    </Field>
  );
});
