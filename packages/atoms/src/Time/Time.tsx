import { forwardRef, useEffect, useMemo, useState } from 'react';
import type { BaseComponentProps } from '../types.js';
import * as styles from './Time.css.js';

/**
 * Localized time display. Renders inside a `<time>` element with a
 * machine-readable `dateTime` attribute.
 *
 * Static by default — `value` (or `new Date()` when omitted) is rendered
 * once and never auto-refreshes. Pass `live` to turn it into a clock that
 * ticks at the configured `precision` (every minute by default, every
 * second with `precision="second"`).
 *
 * For SSR consistency pass a fixed `value`; the default of `new Date()`
 * differs between server and client and will hydrate-mismatch otherwise.
 */
export interface TimeProps extends BaseComponentProps {
  /** The moment to display. Accepts a Date, ISO string, or epoch ms number. */
  value?: Date | string | number;
  /** Auto-update on an interval set by `precision`. @default false */
  live?: boolean;
  /** Time grain. `minute` → "3:30 PM"; `second` → "3:30:45 PM". @default 'minute' */
  precision?: 'minute' | 'second';
  /**
   * Force a specific hour cycle. Default: locale-derived (en-US gets 12,
   * en-GB and most others get 24).
   */
  hourCycle?: 'h12' | 'h23';
  /** BCP-47 locale. Defaults to the browser locale. */
  locale?: string;
  /** Timezone for display. Defaults to the browser timezone. */
  timeZone?: string;
  /** Prefix the time with the date (e.g. "May 15, 2026, 3:30 PM"). @default false */
  showDate?: boolean;
}

function toDate(value: Date | string | number | undefined): Date {
  if (value === undefined) return new Date();
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  return new Date(value);
}

export const Time = forwardRef<HTMLTimeElement, TimeProps>(function Time(
  {
    value,
    live = false,
    precision = 'minute',
    hourCycle,
    locale,
    timeZone,
    showDate = false,
    id,
    'data-testid': dataTestId,
  },
  ref,
) {
  const [now, setNow] = useState<Date>(() => toDate(value));

  useEffect(() => {
    setNow(toDate(value));
  }, [value]);

  useEffect(() => {
    if (!live) return;
    const intervalMs = precision === 'second' ? 1000 : 60_000;
    const drift = Date.now() % intervalMs;
    const initialDelay = intervalMs - drift;
    let interval: ReturnType<typeof setInterval> | null = null;
    const timeout = setTimeout(() => {
      setNow(new Date());
      interval = setInterval(() => setNow(new Date()), intervalMs);
    }, initialDelay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [live, precision]);

  const formatter = useMemo(() => {
    const opts: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
    };
    if (precision === 'second') opts.second = '2-digit';
    if (hourCycle) opts.hourCycle = hourCycle;
    if (timeZone) opts.timeZone = timeZone;
    if (showDate) {
      opts.year = 'numeric';
      opts.month = 'short';
      opts.day = 'numeric';
    }
    return new Intl.DateTimeFormat(locale, opts);
  }, [locale, precision, hourCycle, timeZone, showDate]);

  const text = formatter.format(now);
  const iso = now.toISOString();

  return (
    <time
      ref={ref}
      id={id}
      data-testid={dataTestId}
      dateTime={iso}
      className={styles.root}
    >
      {text}
    </time>
  );
});
