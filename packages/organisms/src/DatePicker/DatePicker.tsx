import { forwardRef, useCallback, useId, useMemo, useRef, useState } from 'react';
import type { FocusEvent, KeyboardEvent, Ref } from 'react';
import {
  Calendar,
  DateInput,
  type CalendarRangeValue,
  type CalendarValue,
  type DateSegmentOrder,
} from '@touchstone/atoms';
import type { BaseComponentProps } from '@touchstone/atoms';
import { CalendarIcon } from '@touchstone/icons';
import {
  useControllableState,
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
   * - `"timestamp"` — ISO 8601 with offset (`"2026-05-15T00:00:00-04:00"`).
   *   The default. Emits unambiguous instants the server can interpret
   *   without a second timezone channel.
   * - `"date"` — ISO date only (`"2026-05-15"`). For inputs where the day
   *   is the unit (birthdays, anniversaries) and timezone is irrelevant.
   *
   * @default 'timestamp'
   */
  valueFormat?: DatePickerValueFormat;
  /**
   * Timezone the picked day is anchored in. Defaults to the browser's
   * resolved timezone via `Intl.DateTimeFormat().resolvedOptions().timeZone`.
   * Only relevant when `valueFormat="timestamp"`.
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
  /** Number of months in the calendar popover. @default 1 (or 2 in range mode) */
  numberOfMonths?: 1 | 2;

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
  /** Popover alignment. @default 'start' */
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
  // Probe noon-UTC on the date — far from any DST transition (which fires
  // around 02:00 local) so the offset for midnight-local is the same.
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

function encodeValue(date: string, format: DatePickerValueFormat, timeZone: string): string {
  if (format === 'date') return date;
  return `${date}T00:00:00${offsetForDate(date, timeZone)}`;
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

  const inputValue = mode === 'single' ? readSingle(value) : readRange(value).start;

  const emitSingle = useCallback(
    (date: string | null): void => {
      if (date === null) {
        setValue(null);
      } else {
        setValue(encodeValue(date, valueFormat, timeZone));
      }
    },
    [setValue, valueFormat, timeZone],
  );

  const emitRange = useCallback(
    (range: CalendarRangeValue): void => {
      const next: DatePickerRangeValue = {
        start: range.start ? encodeValue(range.start, valueFormat, timeZone) : null,
        end: range.end ? encodeValue(range.end, valueFormat, timeZone) : null,
      };
      setValue(next);
    },
    [setValue, valueFormat, timeZone],
  );

  const onCalendarChange = useCallback(
    (next: CalendarValue): void => {
      if (mode === 'single') {
        const date = typeof next === 'string' ? next : null;
        emitSingle(date);
        if (date) {
          setOpen(false);
        }
      } else {
        const range: CalendarRangeValue = next && typeof next !== 'string'
          ? next
          : { start: null, end: null };
        emitRange(range);
        if (range.start && range.end) setOpen(false);
      }
    },
    [mode, emitSingle, emitRange],
  );

  const onInputChange = useCallback(
    (date: string | null): void => {
      if (readOnly) return;
      if (mode === 'single') {
        emitSingle(date);
      } else {
        const range = readRange(value);
        emitRange({ ...range, start: date });
      }
    },
    [mode, emitSingle, emitRange, readOnly, value],
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

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>): void => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      // popover trigger handles open already; nothing extra to do
    }
  };

  const monthsToShow = numberOfMonths ?? (mode === 'range' ? 2 : 1);
  // The trigger button sits at the right edge of the input row. Anchoring
  // the popover with align="end" makes it extend leftward, keeping wide
  // multi-month grids on-screen. Single-month is narrow enough for either.
  const align = alignProp ?? 'end';

  const inputForRange = mode === 'range';

  return (
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
        {inputForRange ? (
          <RangeInputs
            value={readRange(value)}
            onStartChange={(d) => onInputChange(d)}
            onEndChange={(d) => {
              if (readOnly) return;
              const range = readRange(value);
              emitRange({ ...range, end: d });
            }}
            disabled={disabled}
            readOnly={readOnly}
            invalid={invalid}
            segmentOrder={segmentOrder}
            ariaLabel={ariaLabel}
            ariaLabelledBy={ariaLabelledBy}
            ariaDescribedBy={ariaDescribedBy}
            id={id}
          />
        ) : (
          <DateInput
            id={id}
            value={inputValue}
            onChange={onInputChange}
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
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger>
            <button
              ref={triggerRef}
              type="button"
              aria-label={open ? 'Close calendar' : 'Open calendar'}
              disabled={disabled}
              className={styles.triggerButton}
              onKeyDown={onTriggerKeyDown}
              data-testid={dataTestId ? `${dataTestId}-trigger` : undefined}
            >
              <CalendarIcon size={16} />
            </button>
          </Popover.Trigger>
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
      </div>
      {name ? (
        mode === 'range' ? (
          <>
            <input
              type="hidden"
              name={`${name}.start`}
              value={(readRange(value).start && encodeValue(readRange(value).start!, valueFormat, timeZone)) || ''}
              form={form}
            />
            <input
              type="hidden"
              name={`${name}.end`}
              value={(readRange(value).end && encodeValue(readRange(value).end!, valueFormat, timeZone)) || ''}
              form={form}
            />
          </>
        ) : (
          <input
            type="hidden"
            name={name}
            value={(readSingle(value) && encodeValue(readSingle(value)!, valueFormat, timeZone)) || ''}
            form={form}
          />
        )
      ) : null}
    </div>
  );
});

interface RangeInputsProps {
  value: DatePickerRangeValue;
  onStartChange: (date: string | null) => void;
  onEndChange: (date: string | null) => void;
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  segmentOrder: DateSegmentOrder;
  ariaLabel: string | undefined;
  ariaLabelledBy: string | undefined;
  ariaDescribedBy: string | undefined;
  id: string;
}

function RangeInputs({
  value,
  onStartChange,
  onEndChange,
  disabled,
  readOnly,
  invalid,
  segmentOrder,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  id,
}: RangeInputsProps): React.JSX.Element {
  return (
    <div className={styles.rangeRow}>
      <DateInput
        id={`${id}-start`}
        value={value.start}
        onChange={onStartChange}
        invalid={invalid}
        disabled={disabled}
        readOnly={readOnly}
        segmentOrder={segmentOrder}
        aria-label="start date"
        aria-describedby={ariaDescribedBy}
      />
      <span aria-hidden="true" className={styles.rangeArrow}>
        →
      </span>
      <DateInput
        id={`${id}-end`}
        value={value.end}
        onChange={onEndChange}
        invalid={invalid}
        disabled={disabled}
        readOnly={readOnly}
        segmentOrder={segmentOrder}
        aria-label="end date"
        aria-describedby={ariaDescribedBy}
      />
    </div>
  );
}
