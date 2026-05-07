import { forwardRef, useCallback, useId, useMemo, useRef, useState } from 'react';
import type { FocusEvent, KeyboardEvent, Ref } from 'react';
import {
  Calendar,
  DateInput,
  DateRangeInput,
  DateTimeInput,
  type CalendarRangeValue,
  type CalendarValue,
  type DateRangeValue,
  type DateSegmentOrder,
} from '@touchstone/atoms';
import type { BaseComponentProps } from '@touchstone/atoms';
import { CalendarIcon } from '@touchstone/icons';
import {
  useControllableState,
  useMediaQuery,
  useMergedRefs,
  type AnchoredPositionAlign,
  type AnchoredPositionSide,
} from '@touchstone/hooks';
import { Popover } from '../Popover/Popover.js';
import * as styles from './DatePicker.css.js';

export type DatePickerValueFormat = 'timestamp' | 'date';

export interface DatePickerRangeValue {
  start: string | null;
  end: string | null;
}

export type DatePickerValue = string | null | DatePickerRangeValue;

export interface DatePickerProps extends BaseComponentProps {
  /** Single date or a range. @default 'single' */
  mode?: 'single' | 'range';
  /**
   * Controlled value. Shape mirrors `mode`: a `string | null` for single,
   * a `{ start, end }` object for range. The string format is governed by
   * `valueFormat`.
   */
  value?: DatePickerValue;
  /** Uncontrolled initial value. */
  defaultValue?: DatePickerValue;
  /** Fires when the selection changes. */
  onChange?: (value: DatePickerValue) => void;

  /**
   * How the value strings are encoded.
   *
   * - `"timestamp"` — ISO 8601 with offset. The default.
   * - `"date"` — ISO date only (`"2026-05-15"`).
   *
   * `valueFormat="date"` is silently coerced to `"timestamp"` when
   * `includeTime` is `true` — a date-only output with a time picker
   * doesn't make sense.
   *
   * @default 'timestamp'
   */
  valueFormat?: DatePickerValueFormat;
  /**
   * Timezone the picked moment is anchored in. Defaults to the browser's
   * resolved timezone via `Intl.DateTimeFormat().resolvedOptions().timeZone`.
   * Only relevant when the emitted value is a timestamp.
   */
  timeZone?: string;

  /** Lower bound (inclusive). Same format as `value`. */
  min?: string;
  /** Upper bound (inclusive). Same format as `value`. */
  max?: string;

  /** Mark invalid. */
  invalid?: boolean;
  /** Disable interaction. */
  disabled?: boolean;
  /** Make the input read-only (calendar still opens, but no edits commit). */
  readOnly?: boolean;
  /** Mark required. */
  required?: boolean;
  /** Auto-focus the first segment on mount. */
  autoFocus?: boolean;

  /** DateInput segment order. @default 'MDY' */
  segmentOrder?: DateSegmentOrder;
  /** Calendar week-start. 0 = Sunday, 1 = Monday. @default 0 */
  weekStartsOn?: 0 | 1;
  /** BCP-47 locale for calendar labels. */
  locale?: string;
  /** Number of months in the calendar popover. @default 1 (or 2 in range mode on wide viewports) */
  numberOfMonths?: 1 | 2;

  /**
   * Render time inputs alongside the date inputs and emit full timestamps
   * with hour/minute (or hour/minute/second). Forces `valueFormat` to
   * `"timestamp"`.
   * @default false
   */
  includeTime?: boolean;
  /** Time precision when `includeTime` is on. @default 'minute' */
  timePrecision?: 'minute' | 'second';

  /** Form name — hidden inputs carry the value. */
  name?: string;
  /** Form id this picker belongs to. */
  form?: string;

  /** Controlled popover open state. */
  open?: boolean;
  /** Initial popover open state. */
  defaultOpen?: boolean;
  /** Called when the popover wants to open or close. */
  onOpenChange?: (open: boolean) => void;

  /** Popover side. @default 'bottom' */
  side?: AnchoredPositionSide;
  /** Popover alignment. @default 'end' */
  align?: AnchoredPositionAlign;

  onFocus?: (event: FocusEvent<HTMLDivElement>) => void;
  onBlur?: (event: FocusEvent<HTMLDivElement>) => void;

  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

function browserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

function offsetForDate(dateStr: string, timeZone: string): string {
  if (timeZone === 'UTC') return 'Z';
  const probe = new Date(`${dateStr}T12:00:00Z`);
  try {
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' });
    const parts = fmt.formatToParts(probe);
    const tz = parts.find((p) => p.type === 'timeZoneName')?.value;
    if (!tz || tz === 'GMT' || tz === 'UTC') return 'Z';
    const m = /GMT([+-]\d{2}:?\d{2})/.exec(tz);
    if (!m) return 'Z';
    const raw = m[1]!;
    return raw.includes(':') ? raw : `${raw.slice(0, 3)}:${raw.slice(3)}`;
  } catch {
    return 'Z';
  }
}

function toDateOnly(s: string | null | undefined): string | null {
  if (!s) return null;
  if (s.length >= 10 && s[4] === '-' && s[7] === '-') return s.slice(0, 10);
  return null;
}

/** Strip the offset portion off an ISO timestamp; returns the local
 * `"YYYY-MM-DDTHH:MM(:SS)"` portion, which is what `DateTimeInput` and
 * `DateRangeInput` (timezone-agnostic atoms) accept. */
function stripOffset(timestamp: string | null, precision: 'minute' | 'second'): string | null {
  if (!timestamp || timestamp.length < 16 || timestamp[10] !== 'T') return null;
  const tlen = precision === 'second' ? 19 : 16;
  return timestamp.slice(0, tlen);
}

function encodeDateOnly(date: string, format: DatePickerValueFormat, timeZone: string): string {
  if (format === 'date') return date;
  return `${date}T00:00:00${offsetForDate(date, timeZone)}`;
}

function encodeDateTime(datetime: string, timeZone: string, precision: 'minute' | 'second'): string {
  const date = datetime.slice(0, 10);
  const timePart = datetime.slice(11);
  const tFull = precision === 'second' ? timePart : `${timePart}:00`;
  return `${date}T${tFull}${offsetForDate(date, timeZone)}`;
}

function readSingle(value: DatePickerValue | undefined): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string') return toDateOnly(value);
  return null;
}

function readRange(value: DatePickerValue | undefined): DatePickerRangeValue {
  if (value && typeof value === 'object') {
    return { start: toDateOnly(value.start), end: toDateOnly(value.end) };
  }
  return { start: null, end: null };
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(function DatePicker(
  {
    mode = 'single',
    value: controlledValue,
    defaultValue,
    onChange,
    valueFormat = 'timestamp',
    timeZone: tzProp,
    min,
    max,
    invalid = false,
    disabled = false,
    readOnly = false,
    required = false,
    autoFocus = false,
    segmentOrder = 'MDY',
    weekStartsOn = 0,
    locale,
    numberOfMonths,
    includeTime = false,
    timePrecision = 'minute',
    name,
    form,
    open: controlledOpen,
    defaultOpen,
    onOpenChange,
    side = 'bottom',
    align: alignProp,
    id: providedId,
    'data-testid': dataTestId,
    onFocus,
    onBlur,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
  },
  ref,
) {
  const reactId = useId();
  const id = providedId ?? reactId;
  const timeZone = tzProp ?? browserTimeZone();

  // includeTime forces timestamp output — date-only with a time picker
  // is contradictory.
  const effectiveFormat: DatePickerValueFormat = includeTime ? 'timestamp' : valueFormat;

  const initialValue = useMemo<DatePickerValue>(() => {
    if (defaultValue !== undefined) return defaultValue;
    return mode === 'single' ? null : { start: null, end: null };
  }, [defaultValue, mode]);

  const [value, setValue] = useControllableState<DatePickerValue>({
    value: controlledValue,
    defaultValue: initialValue,
    onChange,
  });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mergedRef = useMergedRefs<HTMLDivElement>(containerRef, ref as Ref<HTMLDivElement>);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const dateOnlyMin = min ? toDateOnly(min) ?? undefined : undefined;
  const dateOnlyMax = max ? toDateOnly(max) ?? undefined : undefined;

  const calendarValue = useMemo<CalendarValue>(() => {
    if (mode === 'single') return readSingle(value);
    return readRange(value);
  }, [mode, value]);

  const singleDateOnly = mode === 'single' ? readSingle(value) : null;
  const singleDateTime =
    mode === 'single' && typeof value === 'string' ? stripOffset(value, timePrecision) : null;

  const rangeForInput = useMemo<DateRangeValue>(() => {
    if (mode !== 'range' || !value || typeof value === 'string') {
      return { start: null, end: null };
    }
    if (includeTime) {
      return {
        start: stripOffset(value.start, timePrecision),
        end: stripOffset(value.end, timePrecision),
      };
    }
    return {
      start: toDateOnly(value.start),
      end: toDateOnly(value.end),
    };
  }, [mode, value, includeTime, timePrecision]);

  const emitSingleDate = useCallback(
    (date: string | null): void => {
      if (date === null) setValue(null);
      else setValue(encodeDateOnly(date, effectiveFormat, timeZone));
    },
    [setValue, effectiveFormat, timeZone],
  );

  const emitSingleDateTime = useCallback(
    (datetime: string | null): void => {
      if (datetime === null) setValue(null);
      else setValue(encodeDateTime(datetime, timeZone, timePrecision));
    },
    [setValue, timeZone, timePrecision],
  );

  const emitRangeFromInput = useCallback(
    (next: DateRangeValue): void => {
      if (includeTime) {
        setValue({
          start: next.start ? encodeDateTime(next.start, timeZone, timePrecision) : null,
          end: next.end ? encodeDateTime(next.end, timeZone, timePrecision) : null,
        });
      } else {
        setValue({
          start: next.start ? encodeDateOnly(next.start, effectiveFormat, timeZone) : null,
          end: next.end ? encodeDateOnly(next.end, effectiveFormat, timeZone) : null,
        });
      }
    },
    [setValue, includeTime, effectiveFormat, timeZone, timePrecision],
  );

  const onCalendarChange = useCallback(
    (next: CalendarValue): void => {
      if (mode === 'single') {
        const date = typeof next === 'string' ? next : null;
        if (includeTime) {
          const currentTime = singleDateTime ? singleDateTime.slice(11) : null;
          const placeholder = timePrecision === 'second' ? '00:00:00' : '00:00';
          const t = currentTime ?? placeholder;
          emitSingleDateTime(date ? `${date}T${t}` : null);
        } else {
          emitSingleDate(date);
        }
        if (date) setOpen(false);
      } else {
        const range: CalendarRangeValue =
          next && typeof next !== 'string' ? next : { start: null, end: null };
        if (includeTime) {
          const placeholder = timePrecision === 'second' ? '00:00:00' : '00:00';
          const sTime = rangeForInput.start ? rangeForInput.start.slice(11) : placeholder;
          const eTime = rangeForInput.end ? rangeForInput.end.slice(11) : placeholder;
          emitRangeFromInput({
            start: range.start ? `${range.start}T${sTime}` : null,
            end: range.end ? `${range.end}T${eTime}` : null,
          });
        } else {
          emitRangeFromInput(range);
        }
        if (range.start && range.end) setOpen(false);
      }
    },
    [mode, includeTime, timePrecision, singleDateTime, rangeForInput, emitSingleDate, emitSingleDateTime, emitRangeFromInput],
  );

  // popover open state
  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen ?? false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = useCallback(
    (next: boolean): void => {
      if (controlledOpen === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange],
  );

  const onTriggerKeyDown = (_e: KeyboardEvent<HTMLButtonElement>): void => {
    // popover handles trigger keys; reserved for future affordances.
  };

  const isNarrow = useMediaQuery('(max-width: 600px)');
  const monthsToShow = numberOfMonths ?? (mode === 'range' && !isNarrow ? 2 : 1);
  const align = alignProp ?? 'end';

  const triggerLabel = open ? 'Close calendar' : 'Open calendar';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        ref={mergedRef}
        id={`${id}-root`}
        data-testid={dataTestId}
        role="group"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        className={styles.root}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <div className={styles.inputRow}>
          {mode === 'range' ? (
            <DateRangeInput
              id={id}
              value={rangeForInput}
              onChange={emitRangeFromInput}
              includeTime={includeTime}
              precision={timePrecision}
              segmentOrder={segmentOrder}
              invalid={invalid}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              autoFocus={autoFocus}
              aria-describedby={ariaDescribedBy}
              endAdornment={
                <Popover.Trigger>
                  <button
                    ref={triggerRef}
                    type="button"
                    aria-label={triggerLabel}
                    disabled={disabled}
                    className={styles.embeddedTrigger}
                    onKeyDown={onTriggerKeyDown}
                    data-testid={dataTestId ? `${dataTestId}-trigger` : undefined}
                  >
                    <CalendarIcon size={16} />
                  </button>
                </Popover.Trigger>
              }
            />
          ) : (
            <>
              <div className={styles.inputs}>
                {includeTime ? (
                  <DateTimeInput
                    id={id}
                    value={singleDateTime}
                    onChange={emitSingleDateTime}
                    precision={timePrecision}
                    segmentOrder={segmentOrder}
                    invalid={invalid}
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    autoFocus={autoFocus}
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledBy}
                    aria-describedby={ariaDescribedBy}
                  />
                ) : (
                  <DateInput
                    id={id}
                    value={singleDateOnly}
                    onChange={emitSingleDate}
                    min={dateOnlyMin}
                    max={dateOnlyMax}
                    invalid={invalid}
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    autoFocus={autoFocus}
                    segmentOrder={segmentOrder}
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledBy}
                    aria-describedby={ariaDescribedBy}
                  />
                )}
              </div>
              <Popover.Trigger>
                <button
                  ref={triggerRef}
                  type="button"
                  aria-label={triggerLabel}
                  disabled={disabled}
                  className={styles.triggerButton}
                  onKeyDown={onTriggerKeyDown}
                  data-testid={dataTestId ? `${dataTestId}-trigger` : undefined}
                >
                  <CalendarIcon size={16} />
                </button>
              </Popover.Trigger>
            </>
          )}
        </div>
        {name ? (
          mode === 'range' ? (
            <>
              <input
                type="hidden"
                name={`${name}.start`}
                value={
                  includeTime
                    ? rangeForInput.start
                      ? encodeDateTime(rangeForInput.start, timeZone, timePrecision)
                      : ''
                    : rangeForInput.start
                      ? encodeDateOnly(rangeForInput.start, effectiveFormat, timeZone)
                      : ''
                }
                form={form}
              />
              <input
                type="hidden"
                name={`${name}.end`}
                value={
                  includeTime
                    ? rangeForInput.end
                      ? encodeDateTime(rangeForInput.end, timeZone, timePrecision)
                      : ''
                    : rangeForInput.end
                      ? encodeDateOnly(rangeForInput.end, effectiveFormat, timeZone)
                      : ''
                }
                form={form}
              />
            </>
          ) : (
            <input
              type="hidden"
              name={name}
              value={
                includeTime
                  ? singleDateTime
                    ? encodeDateTime(singleDateTime, timeZone, timePrecision)
                    : ''
                  : singleDateOnly
                    ? encodeDateOnly(singleDateOnly, effectiveFormat, timeZone)
                    : ''
              }
              form={form}
            />
          )
        ) : null}
      </div>
      <Popover.Content side={side} align={align} aria-label="Date picker calendar">
        <Calendar
          mode={mode}
          value={calendarValue}
          onChange={onCalendarChange}
          {...(dateOnlyMin !== undefined ? { min: dateOnlyMin } : {})}
          {...(dateOnlyMax !== undefined ? { max: dateOnlyMax } : {})}
          weekStartsOn={weekStartsOn}
          {...(locale !== undefined ? { locale } : {})}
          numberOfMonths={monthsToShow}
          aria-label={ariaLabel ?? 'Pick a date'}
        />
      </Popover.Content>
    </Popover>
  );
});
