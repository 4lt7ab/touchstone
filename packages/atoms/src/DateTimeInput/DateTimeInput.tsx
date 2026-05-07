import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import type { FocusEvent } from 'react';
import { DateInput, type DateSegmentOrder } from '../DateInput/DateInput.js';
import { TimeInput } from '../TimeInput/TimeInput.js';
import type { BaseComponentProps } from '../types.js';
import * as styles from './DateTimeInput.css.js';

/**
 * Combined date + time entry under a single visual chrome. Composes
 * `DateInput` and `TimeInput` (rendered `bare`) with a thin divider between
 * them. Emits a full ISO-shaped string (`"YYYY-MM-DDTHH:MM"` or
 * `"YYYY-MM-DDTHH:MM:SS"`) once both halves are complete; emits `null`
 * while either half is mid-edit.
 *
 * Use freestanding for forms that need a moment-in-time input without a
 * calendar picker; use composed inside `DatePicker` to drive its
 * `includeTime` mode. The atom is timezone-agnostic — it handles
 * date+time as a label. Anchoring to a timezone is the job of whoever
 * embeds it (typically `DatePicker`).
 */
export interface DateTimeInputProps extends BaseComponentProps {
  /** Controlled value: `"YYYY-MM-DDTHH:MM"` or `"...:SS"` or `null`. */
  value?: string | null;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string | null;
  /** Fired when the combined value changes; emits `null` while incomplete. */
  onChange?: (value: string | null) => void;

  /** Time precision. @default 'minute' */
  precision?: 'minute' | 'second';
  /** Date segment order. @default 'MDY' */
  segmentOrder?: DateSegmentOrder;

  /** Earliest datetime (inclusive). Same format as `value`. */
  min?: string;
  /** Latest datetime (inclusive). */
  max?: string;

  /** Mark invalid. */
  invalid?: boolean;
  /** Strip the input's own chrome — used when an outer wrapper provides
   * the visual container (e.g. `DateRangeInput`). @default false */
  bare?: boolean;
  /** Disable interaction. */
  disabled?: boolean;
  /** Make the input read-only. */
  readOnly?: boolean;
  /** Mark as required for form submission. */
  required?: boolean;
  /** Auto-focus the first segment on mount. */
  autoFocus?: boolean;

  /** Form name — when set, a hidden input carries the value. */
  name?: string;
  /** Form id this input belongs to. */
  form?: string;

  onFocus?: (event: FocusEvent<HTMLDivElement>) => void;
  onBlur?: (event: FocusEvent<HTMLDivElement>) => void;

  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling';
}

interface Parts {
  date: string | null;
  time: string | null;
}

function timeWidth(precision: 'minute' | 'second'): number {
  return precision === 'second' ? 8 : 5;
}

function parseDateTime(value: string | null | undefined, precision: 'minute' | 'second'): Parts {
  if (!value || value.length < 16 || value[10] !== 'T') return { date: null, time: null };
  const date = value.slice(0, 10);
  const time = value.slice(11, 11 + timeWidth(precision));
  return { date, time };
}

function combine(date: string | null, time: string | null): string | null {
  if (!date || !time) return null;
  return `${date}T${time}`;
}

export const DateTimeInput = forwardRef<HTMLDivElement, DateTimeInputProps>(function DateTimeInput(
  {
    value,
    defaultValue,
    onChange,
    precision = 'minute',
    segmentOrder = 'MDY',
    min,
    max,
    invalid = false,
    bare = false,
    disabled = false,
    readOnly = false,
    required = false,
    autoFocus = false,
    name,
    form,
    id: providedId,
    'data-testid': dataTestId,
    onFocus,
    onBlur,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
  },
  ref,
) {
  const reactId = useId();
  const id = providedId ?? reactId;

  const initial = parseDateTime(value ?? defaultValue ?? null, precision);
  const [datePart, setDatePart] = useState<string | null>(initial.date);
  const [timePart, setTimePart] = useState<string | null>(initial.time);
  // Track last emitted to suppress feedback loops when external `value`
  // echoes back what we just emitted.
  const lastEmittedRef = useRef<string | null>(combine(initial.date, initial.time));

  const containerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => containerRef.current as HTMLDivElement, []);

  // Sync internal state from external value when it changes from outside.
  useEffect(() => {
    if (value === undefined) return;
    if (value === lastEmittedRef.current) return;
    const parsed = parseDateTime(value, precision);
    setDatePart(parsed.date);
    setTimePart(parsed.time);
    lastEmittedRef.current = value;
  }, [value, precision]);

  const emit = useCallback(
    (date: string | null, time: string | null): void => {
      const next = combine(date, time);
      if (next !== lastEmittedRef.current) {
        lastEmittedRef.current = next;
        onChange?.(next);
      }
    },
    [onChange],
  );

  const handleDateChange = useCallback(
    (next: string | null): void => {
      setDatePart(next);
      emit(next, timePart);
    },
    [emit, timePart],
  );

  const handleTimeChange = useCallback(
    (next: string | null): void => {
      setTimePart(next);
      emit(datePart, next);
    },
    [emit, datePart],
  );

  const isOutOfBounds = (() => {
    const combined = combine(datePart, timePart);
    if (!combined) return false;
    if (min && combined < min) return true;
    if (max && combined > max) return true;
    return false;
  })();

  const showInvalid = invalid || isOutOfBounds;

  // Children get date-only / time-agnostic min-max — bound checking against
  // the combined datetime happens at this level. The inner inputs only see
  // the date portion of `min` / `max`; time-only bounds across days don't
  // round-trip cleanly without a date context.
  const dateMin = min ? min.slice(0, 10) : undefined;
  const dateMax = max ? max.slice(0, 10) : undefined;

  const isoForForm = combine(datePart, timePart) ?? '';

  return (
    <div
      ref={containerRef}
      id={`${id}-root`}
      data-testid={dataTestId}
      role="group"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid ?? (showInvalid || undefined)}
      aria-disabled={disabled || undefined}
      className={styles.root({ invalid: showInvalid, disabled, bare })}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <DateInput
        bare
        id={id}
        value={datePart}
        onChange={handleDateChange}
        {...(dateMin !== undefined ? { min: dateMin } : {})}
        {...(dateMax !== undefined ? { max: dateMax } : {})}
        invalid={showInvalid}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        autoFocus={autoFocus}
        segmentOrder={segmentOrder}
        aria-label="date"
      />
      <span aria-hidden="true" className={styles.divider} />
      <TimeInput
        bare
        value={timePart}
        onChange={handleTimeChange}
        precision={precision}
        invalid={showInvalid}
        disabled={disabled}
        readOnly={readOnly}
        aria-label="time"
      />
      {name ? <input type="hidden" name={name} value={isoForForm} form={form} /> : null}
    </div>
  );
});
