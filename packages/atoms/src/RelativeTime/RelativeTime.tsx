import { forwardRef, useEffect, useMemo, useState } from 'react';
import type { BaseComponentProps } from '../types.js';
import * as styles from './RelativeTime.css.js';

/**
 * Formats a moment as relative to now ("5 minutes ago", "in 3 hours")
 * via `Intl.RelativeTimeFormat`. Renders inside a `<time>` element with
 * a machine-readable `dateTime` attribute and a `title` containing the
 * absolute time as a tooltip.
 *
 * Static by default. Pass `live` to auto-update on a tier-adaptive
 * interval (5s when fresh, 1min within an hour, 5min beyond).
 *
 * Not SSR-stable when the rendered text depends on the current moment —
 * server and client `now` differ.
 */
export interface RelativeTimeProps extends BaseComponentProps {
  /** The moment to compare against now. */
  value: Date | string | number;
  /** Auto-update on an adaptive interval. @default false */
  live?: boolean;
  /** BCP-47 locale. */
  locale?: string;
  /**
   * Verbosity of the unit names. `long` → "5 minutes ago"; `short` →
   * "5 min. ago"; `narrow` → "5m ago" (narrow varies by locale).
   * @default 'long'
   */
  length?: 'long' | 'short' | 'narrow';
  /**
   * `auto` substitutes "yesterday" / "today" / "tomorrow" where the
   * locale supports it; `always` keeps numeric phrasing.
   * @default 'auto'
   */
  numeric?: 'always' | 'auto';
}

function toDate(value: Date | string | number): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  return new Date(value);
}

interface UnitSpec {
  unit: Intl.RelativeTimeFormatUnit;
  ms: number;
}

const UNITS: UnitSpec[] = [
  { unit: 'year', ms: 365 * 86_400_000 },
  { unit: 'month', ms: 30 * 86_400_000 },
  { unit: 'day', ms: 86_400_000 },
  { unit: 'hour', ms: 3_600_000 },
  { unit: 'minute', ms: 60_000 },
  { unit: 'second', ms: 1000 },
];

function pickUnit(diffMs: number): { unit: Intl.RelativeTimeFormatUnit; value: number } {
  const abs = Math.abs(diffMs);
  for (const u of UNITS) {
    if (abs >= u.ms) {
      return { unit: u.unit, value: Math.round(diffMs / u.ms) };
    }
  }
  return { unit: 'second', value: Math.round(diffMs / 1000) };
}

function tickDelay(diffMs: number): number {
  const abs = Math.abs(diffMs);
  if (abs < 60_000) return 5_000;
  if (abs < 3_600_000) return 60_000;
  return 5 * 60_000;
}

export const RelativeTime = forwardRef<HTMLTimeElement, RelativeTimeProps>(function RelativeTime(
  {
    value,
    live = false,
    locale,
    length = 'long',
    numeric = 'auto',
    id,
    'data-testid': dataTestId,
  },
  ref,
) {
  const target = useMemo(() => toDate(value), [value]);
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    setNow(new Date());
  }, [target]);

  useEffect(() => {
    if (!live) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    const tick = (): void => {
      const current = new Date();
      setNow(current);
      const diff = target.getTime() - current.getTime();
      timeoutId = setTimeout(tick, tickDelay(diff));
    };
    const initialDiff = target.getTime() - Date.now();
    timeoutId = setTimeout(tick, tickDelay(initialDiff));
    return () => clearTimeout(timeoutId);
  }, [live, target]);

  const formatter = useMemo(
    () => new Intl.RelativeTimeFormat(locale, { style: length, numeric }),
    [locale, length, numeric],
  );

  const diffMs = target.getTime() - now.getTime();
  const { unit, value: unitValue } = pickUnit(diffMs);
  const text = formatter.format(unitValue, unit);
  const iso = target.toISOString();

  return (
    <time
      ref={ref}
      id={id}
      data-testid={dataTestId}
      dateTime={iso}
      title={target.toLocaleString(locale)}
      className={styles.root}
    >
      {text}
    </time>
  );
});
