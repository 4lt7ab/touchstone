import { forwardRef, useCallback, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent as ReactMouseEvent, Ref } from 'react';
import { useControllableState, useMergedRefs } from '@touchstone/hooks';
import type { BaseComponentProps } from '../types.js';
import * as styles from './Calendar.css.js';

/**
 * Range value for `mode="range"`. While the user is mid-selection, `end` is
 * `null`. A complete range has both fields set with `end >= start`.
 */
export interface CalendarRangeValue {
  start: string | null;
  end: string | null;
}

/**
 * The component speaks date-only ISO strings (`"YYYY-MM-DD"`). Timezone
 * concerns belong to the consumer (typically `DatePicker`), which composes
 * a calendar around timezone-aware timestamps.
 */
export type CalendarValue = string | null | CalendarRangeValue;

export interface CalendarProps extends BaseComponentProps {
  /** Single date or a range. @default 'single' */
  mode?: 'single' | 'range';
  /**
   * Controlled value. A `string` (or `null`) for single; a
   * `{ start, end }` object for range.
   */
  value?: CalendarValue;
  /** Uncontrolled initial value. */
  defaultValue?: CalendarValue;
  /** Called when the selection changes. Tuple shape mirrors `value`. */
  onChange?: (value: CalendarValue) => void;

  /** Lower bound (inclusive). ISO date string. */
  min?: string;
  /** Upper bound (inclusive). ISO date string. */
  max?: string;
  /** Predicate to disable individual dates. Fires for every rendered cell. */
  isDateDisabled?: (date: string) => boolean;

  /** First day of the week. 0 = Sunday, 1 = Monday. @default 0 */
  weekStartsOn?: 0 | 1;
  /** BCP-47 locale for month and weekday labels. Defaults to browser locale. */
  locale?: string;

  /** Controlled month view — any date in the displayed month. */
  month?: string;
  /** Initial month view when uncontrolled. Defaults to value's month, then today. */
  defaultMonth?: string;
  /** Called when the displayed month changes. */
  onMonthChange?: (month: string) => void;

  /** Render N consecutive months side-by-side. @default 1 */
  numberOfMonths?: 1 | 2;

  /** Disable interaction with the entire calendar. */
  disabled?: boolean;

  'aria-label'?: string;
  'aria-labelledby'?: string;
}

interface YMD {
  y: number;
  m: number;
  d: number;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function parsePlainDate(s: string): YMD {
  const y = Number(s.slice(0, 4));
  const m = Number(s.slice(5, 7));
  const d = Number(s.slice(8, 10));
  return { y, m, d };
}

function formatPlainDate({ y, m, d }: YMD): string {
  return `${y}-${pad(m)}-${pad(d)}`;
}

function isValidPlainDate(s: string | null | undefined): s is string {
  if (!s || s.length !== 10) return false;
  const { y, m, d } = parsePlainDate(s);
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return false;
  if (m < 1 || m > 12) return false;
  return d >= 1 && d <= daysInMonth(y, m);
}

function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

function toUtcDate({ y, m, d }: YMD): Date {
  return new Date(Date.UTC(y, m - 1, d));
}

function fromUtcDate(date: Date): YMD {
  return {
    y: date.getUTCFullYear(),
    m: date.getUTCMonth() + 1,
    d: date.getUTCDate(),
  };
}

function addDays(s: string, n: number): string {
  const date = toUtcDate(parsePlainDate(s));
  date.setUTCDate(date.getUTCDate() + n);
  return formatPlainDate(fromUtcDate(date));
}

function addMonths(s: string, n: number): string {
  const { y, m, d } = parsePlainDate(s);
  const target = new Date(Date.UTC(y, m - 1 + n, 1));
  const ty = target.getUTCFullYear();
  const tm = target.getUTCMonth() + 1;
  const td = Math.min(d, daysInMonth(ty, tm));
  return formatPlainDate({ y: ty, m: tm, d: td });
}

function startOfMonth(s: string): string {
  const { y, m } = parsePlainDate(s);
  return formatPlainDate({ y, m, d: 1 });
}

function dayOfWeek(s: string): number {
  return toUtcDate(parsePlainDate(s)).getUTCDay();
}

function comparePlainDate(a: string, b: string): -1 | 0 | 1 {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function todayPlainDate(): string {
  const now = new Date();
  return formatPlainDate({
    y: now.getFullYear(),
    m: now.getMonth() + 1,
    d: now.getDate(),
  });
}

function isInRange(d: string, lo: string | null, hi: string | null): boolean {
  if (!lo || !hi) return false;
  return d >= lo && d <= hi;
}

function isSingleValue(v: CalendarValue): v is string | null {
  return v === null || typeof v === 'string';
}

function readSingle(v: CalendarValue | undefined): string | null {
  if (v === undefined || v === null) return null;
  if (typeof v === 'string') return isValidPlainDate(v) ? v : null;
  return null;
}

function readRange(v: CalendarValue | undefined): CalendarRangeValue {
  if (v && !isSingleValue(v)) {
    return {
      start: v.start && isValidPlainDate(v.start) ? v.start : null,
      end: v.end && isValidPlainDate(v.end) ? v.end : null,
    };
  }
  return { start: null, end: null };
}

function buildWeeks(monthAnchor: string, weekStartsOn: 0 | 1): string[][] {
  const first = startOfMonth(monthAnchor);
  const firstDow = dayOfWeek(first);
  const lead = (firstDow - weekStartsOn + 7) % 7;
  const gridStart = addDays(first, -lead);
  const weeks: string[][] = [];
  for (let w = 0; w < 6; w++) {
    const row: string[] = [];
    for (let d = 0; d < 7; d++) {
      row.push(addDays(gridStart, w * 7 + d));
    }
    weeks.push(row);
  }
  return weeks;
}

function getInitialFocus(
  mode: 'single' | 'range',
  value: CalendarValue | undefined,
  monthAnchor: string,
): string {
  if (mode === 'single') {
    const single = readSingle(value);
    if (single) return single;
  } else {
    const range = readRange(value);
    if (range.start) return range.start;
  }
  const today = todayPlainDate();
  if (parsePlainDate(today).m === parsePlainDate(monthAnchor).m && parsePlainDate(today).y === parsePlainDate(monthAnchor).y) {
    return today;
  }
  return startOfMonth(monthAnchor);
}

function defaultInitialMonth(value: CalendarValue | undefined): string {
  const single = readSingle(value);
  if (single) return startOfMonth(single);
  const range = readRange(value);
  if (range.start) return startOfMonth(range.start);
  return startOfMonth(todayPlainDate());
}

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  {
    mode = 'single',
    value: controlledValue,
    defaultValue,
    onChange,
    min,
    max,
    isDateDisabled,
    weekStartsOn = 0,
    locale,
    month: controlledMonth,
    defaultMonth,
    onMonthChange,
    numberOfMonths = 1,
    disabled = false,
    id: providedId,
    'data-testid': dataTestId,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
  },
  ref,
) {
  const reactId = useId();
  const id = providedId ?? reactId;

  const initialValue = useMemo<CalendarValue>(() => {
    if (defaultValue !== undefined) return defaultValue;
    return mode === 'single' ? null : { start: null, end: null };
  }, [defaultValue, mode]);

  const [value, setValue] = useControllableState<CalendarValue>({
    value: controlledValue,
    defaultValue: initialValue,
    onChange,
  });

  const initialMonth = useMemo(
    () => defaultMonth ?? defaultInitialMonth(value),
    // initial-only — month then becomes self-managed unless controlled
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [internalMonth, setInternalMonth] = useState<string>(initialMonth);
  const month = controlledMonth ?? internalMonth;

  const today = useMemo(() => todayPlainDate(), []);

  const [focusedDate, setFocusedDate] = useState<string>(() =>
    getInitialFocus(mode, value, month),
  );
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const dayRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const rootRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs<HTMLDivElement>(rootRef, ref as Ref<HTMLDivElement>);

  const setMonth = useCallback(
    (next: string): void => {
      const anchor = startOfMonth(next);
      if (controlledMonth === undefined) setInternalMonth(anchor);
      onMonthChange?.(anchor);
    },
    [controlledMonth, onMonthChange],
  );

  const isOutOfBounds = useCallback(
    (d: string): boolean => {
      if (min && d < min) return true;
      if (max && d > max) return true;
      return false;
    },
    [min, max],
  );

  const isDisabledDate = useCallback(
    (d: string): boolean => {
      if (disabled) return true;
      if (isOutOfBounds(d)) return true;
      return isDateDisabled?.(d) ?? false;
    },
    [disabled, isOutOfBounds, isDateDisabled],
  );

  const ensureFocusInView = useCallback(
    (d: string): void => {
      const focusMonth = startOfMonth(d);
      if (focusMonth !== month) setMonth(focusMonth);
    },
    [month, setMonth],
  );

  const moveFocus = useCallback(
    (next: string): void => {
      setFocusedDate(next);
      ensureFocusInView(next);
      // defer focus until the cell renders in the (possibly new) month
      queueMicrotask(() => {
        dayRefs.current.get(next)?.focus();
      });
    },
    [ensureFocusInView],
  );

  const selectDate = useCallback(
    (d: string): void => {
      if (isDisabledDate(d)) return;
      if (mode === 'single') {
        setValue(d);
        return;
      }
      const range = readRange(value);
      if (!range.start || (range.start && range.end)) {
        setValue({ start: d, end: null });
        return;
      }
      if (comparePlainDate(d, range.start) < 0) {
        setValue({ start: d, end: range.start });
      } else {
        setValue({ start: range.start, end: d });
      }
    },
    [mode, value, setValue, isDisabledDate],
  );

  const onDayKeyDown = (date: string) => (e: KeyboardEvent<HTMLButtonElement>): void => {
    let next: string | null = null;
    switch (e.key) {
      case 'ArrowLeft':
        next = addDays(date, -1);
        break;
      case 'ArrowRight':
        next = addDays(date, 1);
        break;
      case 'ArrowUp':
        next = addDays(date, -7);
        break;
      case 'ArrowDown':
        next = addDays(date, 7);
        break;
      case 'Home':
        next = addDays(date, -((dayOfWeek(date) - weekStartsOn + 7) % 7));
        break;
      case 'End':
        next = addDays(date, 6 - ((dayOfWeek(date) - weekStartsOn + 7) % 7));
        break;
      case 'PageUp':
        next = addMonths(date, e.shiftKey ? -12 : -1);
        break;
      case 'PageDown':
        next = addMonths(date, e.shiftKey ? 12 : 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        selectDate(date);
        return;
      default:
        return;
    }
    if (next) {
      e.preventDefault();
      if (min && next < min) next = min;
      if (max && next > max) next = max;
      moveFocus(next);
    }
  };

  const onDayClick = (date: string) => (e: ReactMouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    selectDate(date);
    setFocusedDate(date);
  };

  const onDayMouseEnter = (date: string) => (): void => {
    if (mode !== 'range') return;
    const range = readRange(value);
    if (range.start && !range.end) setHoverDate(date);
  };

  const onGridMouseLeave = (): void => {
    setHoverDate(null);
  };

  const monthsToRender = useMemo<string[]>(() => {
    const result: string[] = [];
    for (let i = 0; i < numberOfMonths; i++) {
      result.push(startOfMonth(addMonths(month, i)));
    }
    return result;
  }, [month, numberOfMonths]);

  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }),
    [locale],
  );
  const weekdayFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }),
    [locale],
  );
  const weekdayLongFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }),
    [locale],
  );
  const dayLongFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      }),
    [locale],
  );

  const weekdayLabels = useMemo<{ short: string; long: string }[]>(() => {
    // anchor on a known Sunday (UTC) and rotate by weekStartsOn
    const sunday = new Date(Date.UTC(2024, 0, 7));
    const labels: { short: string; long: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(sunday);
      day.setUTCDate(sunday.getUTCDate() + ((i + weekStartsOn) % 7));
      labels.push({
        short: weekdayFormatter.format(day),
        long: weekdayLongFormatter.format(day),
      });
    }
    return labels;
  }, [weekdayFormatter, weekdayLongFormatter, weekStartsOn]);

  const range = mode === 'range' ? readRange(value) : null;
  const single = mode === 'single' ? readSingle(value) : null;

  const previewRange = useMemo<CalendarRangeValue | null>(() => {
    if (!range) return null;
    if (range.start && !range.end && hoverDate) {
      const lo = comparePlainDate(hoverDate, range.start) < 0 ? hoverDate : range.start;
      const hi = comparePlainDate(hoverDate, range.start) < 0 ? range.start : hoverDate;
      return { start: lo, end: hi };
    }
    return null;
  }, [range, hoverDate]);

  const setDayRef = (date: string) => (el: HTMLButtonElement | null): void => {
    if (el) dayRefs.current.set(date, el);
    else dayRefs.current.delete(date);
  };

  const renderMonth = (anchor: string, monthIndex: number): React.JSX.Element => {
    const weeks = buildWeeks(anchor, weekStartsOn);
    const { y, m } = parsePlainDate(anchor);
    const monthLabelId = `${id}-month-${monthIndex}`;
    const monthLabel = monthFormatter.format(toUtcDate({ y, m, d: 1 }));

    return (
      <div key={anchor} className={styles.monthBlock}>
        <div
          className={numberOfMonths === 1 ? styles.monthLabelHidden : styles.monthLabel}
          id={monthLabelId}
          aria-live="polite"
        >
          {monthLabel}
        </div>
        <table
          role="grid"
          aria-labelledby={monthLabelId}
          className={styles.grid}
          onMouseLeave={onGridMouseLeave}
        >
          <thead>
            <tr className={styles.weekdayRow}>
              {weekdayLabels.map((label) => (
                <th key={label.long} scope="col" className={styles.weekdayCell} abbr={label.long}>
                  {label.short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wi) => (
              <tr key={`${anchor}-w${wi}`}>
                {week.map((date) => {
                  const ymd = parsePlainDate(date);
                  const inMonth = ymd.m === m && ymd.y === y;
                  const isSelected =
                    (single && single === date) ||
                    (range && (range.start === date || range.end === date)) ||
                    false;
                  const isInActiveRange = !!range && isInRange(date, range.start, range.end);
                  const isInPreview = !!previewRange && isInRange(date, previewRange.start, previewRange.end);
                  const isStart = !!range && range.start === date;
                  const isEnd = !!range && range.end === date;
                  const isToday = date === today;
                  const cellDisabled = isDisabledDate(date);
                  const isFocusable = focusedDate === date;
                  const longLabel = dayLongFormatter.format(toUtcDate(ymd));

                  return (
                    <td key={date} className={styles.dayCell}>
                      <button
                        type="button"
                        ref={setDayRef(date)}
                        tabIndex={isFocusable ? 0 : -1}
                        disabled={cellDisabled}
                        aria-selected={isSelected || undefined}
                        aria-label={longLabel}
                        aria-current={isToday ? 'date' : undefined}
                        data-testid={dataTestId ? `${dataTestId}-day-${date}` : undefined}
                        className={styles.day({
                          state: cellDisabled
                            ? 'disabled'
                            : isSelected
                              ? 'selected'
                              : isInActiveRange || isInPreview
                                ? 'inRange'
                                : 'idle',
                          today: isToday,
                          outsideMonth: !inMonth,
                          rangeEdge: isStart && isEnd ? 'both' : isStart ? 'start' : isEnd ? 'end' : 'none',
                        })}
                        onClick={onDayClick(date)}
                        onKeyDown={onDayKeyDown(date)}
                        onMouseEnter={onDayMouseEnter(date)}
                        onFocus={() => setFocusedDate(date)}
                      >
                        {ymd.d}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const goPrevMonth = (): void => setMonth(addMonths(month, -1));
  const goNextMonth = (): void => setMonth(addMonths(month, 1));

  const headerLabel = monthFormatter.format(
    toUtcDate({ y: parsePlainDate(month).y, m: parsePlainDate(month).m, d: 1 }),
  );

  return (
    <div
      ref={mergedRef}
      id={id}
      data-testid={dataTestId}
      className={styles.root}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      role="group"
    >
      <div className={styles.header}>
        <button
          type="button"
          aria-label={`Previous month, ${monthFormatter.format(toUtcDate(parsePlainDate(addMonths(month, -1))))}`}
          className={styles.navButton}
          disabled={disabled || (min ? addMonths(month, -1) < startOfMonth(min) : false)}
          onClick={goPrevMonth}
          data-testid={dataTestId ? `${dataTestId}-prev` : undefined}
        >
          <Chevron direction="left" />
        </button>
        <div className={styles.headerLabel} aria-live="polite">
          {numberOfMonths === 1
            ? headerLabel
            : `${headerLabel} – ${monthFormatter.format(
                toUtcDate(parsePlainDate(addMonths(month, numberOfMonths - 1))),
              )}`}
        </div>
        <button
          type="button"
          aria-label={`Next month, ${monthFormatter.format(toUtcDate(parsePlainDate(addMonths(month, 1))))}`}
          className={styles.navButton}
          disabled={disabled || (max ? addMonths(month, 1) > startOfMonth(max) : false)}
          onClick={goNextMonth}
          data-testid={dataTestId ? `${dataTestId}-next` : undefined}
        >
          <Chevron direction="right" />
        </button>
      </div>
      <div className={styles.months}>{monthsToRender.map((m, i) => renderMonth(m, i))}</div>
    </div>
  );
});

function Chevron({ direction }: { direction: 'left' | 'right' }): React.JSX.Element {
  const d = direction === 'left' ? 'M10 4L6 8L10 12' : 'M6 4L10 8L6 12';
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
