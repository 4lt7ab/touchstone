import { forwardRef, useMemo } from 'react';
import type { BaseComponentProps } from '../types.js';
import * as styles from './Duration.css.js';

/**
 * Formats a duration into a human-readable string.
 *
 * - `format="clock"` (default) — "1:23:45" or "23:45". For stopwatches,
 *   media playback, elapsed time displays.
 * - `format="short"` — "1h 23m 45s". For "video is 2h 14m" style copy.
 *
 * `precision` controls the smallest unit shown. Negative durations are
 * prefixed with `-`.
 */
export interface DurationProps extends BaseComponentProps {
  /** The duration. Negative values are allowed and rendered with a minus sign. */
  value: number;
  /** Unit the input is in. @default 'milliseconds' */
  unit?: 'milliseconds' | 'seconds';
  /** Output shape. @default 'clock' */
  format?: 'clock' | 'short';
  /** Smallest unit shown. @default 'second' */
  precision?: 'second' | 'minute';
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function toSeconds(value: number, unit: 'milliseconds' | 'seconds'): number {
  return Math.trunc(unit === 'milliseconds' ? value / 1000 : value);
}

function formatClock(totalSeconds: number, precision: 'second' | 'minute'): string {
  const sign = totalSeconds < 0 ? '-' : '';
  const abs = Math.abs(totalSeconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;
  if (precision === 'minute') {
    if (h > 0) return `${sign}${h}:${pad(m)}`;
    return `${sign}0:${pad(m)}`;
  }
  if (h > 0) return `${sign}${h}:${pad(m)}:${pad(s)}`;
  return `${sign}${pad(m)}:${pad(s)}`;
}

function formatShort(totalSeconds: number, precision: 'second' | 'minute'): string {
  const sign = totalSeconds < 0 ? '-' : '';
  const abs = Math.abs(totalSeconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0) parts.push(`${m}m`);
  if (precision === 'second') parts.push(`${s}s`);
  if (parts.length === 0) parts.push(precision === 'second' ? '0s' : '0m');
  return `${sign}${parts.join(' ')}`;
}

export const Duration = forwardRef<HTMLSpanElement, DurationProps>(function Duration(
  {
    value,
    unit = 'milliseconds',
    format = 'clock',
    precision = 'second',
    id,
    'data-testid': dataTestId,
  },
  ref,
) {
  const text = useMemo(() => {
    const total = toSeconds(value, unit);
    return format === 'clock' ? formatClock(total, precision) : formatShort(total, precision);
  }, [value, unit, format, precision]);

  return (
    <span ref={ref} id={id} data-testid={dataTestId} className={styles.root}>
      {text}
    </span>
  );
});
