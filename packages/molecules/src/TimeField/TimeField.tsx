import { forwardRef } from 'react';
import { TimeInput, type TimeInputProps } from '@touchstone/atoms';
import { Field } from '../Field/Field.js';

/**
 * Labelled time input. Wraps `TimeInput` in `Field`, wiring label, hint,
 * and error to the segmented input via aria-labelledby / aria-describedby.
 *
 * Doubles as the "time picker" — there's no calendar-grid equivalent for
 * time, so a popover wrapper would just be chrome around the input.
 */
export interface TimeFieldProps extends Omit<TimeInputProps, 'id' | 'aria-describedby'> {
  /** Visible label text. */
  label: string;
  /** Helper text shown under the input when there is no error. */
  hint?: string;
  /** Error message. When present, the input is marked invalid and the hint is hidden. */
  error?: string;
  /** Override the auto-generated control id. */
  id?: string;
}

export const TimeField = forwardRef<HTMLDivElement, TimeFieldProps>(function TimeField(
  { label, hint, error, id, invalid, ...rest },
  ref,
) {
  const isInvalid = invalid ?? Boolean(error);
  return (
    <Field label={label} hint={hint} error={error} id={id} invalid={isInvalid}>
      <TimeInput ref={ref} invalid={isInvalid} {...rest} />
    </Field>
  );
});
