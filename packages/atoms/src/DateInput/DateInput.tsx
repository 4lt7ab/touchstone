import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import type { ChangeEvent, FocusEvent, KeyboardEvent, Ref } from 'react';
import { useControllableState } from '@touchstone/hooks';
import type { BaseComponentProps } from '../types.js';
import * as styles from './DateInput.css.js';

/**
 * The order of segments in a date string. `MDY` = `MM/DD/YYYY`, `DMY` =
 * `DD/MM/YYYY`, `YMD` = `YYYY/MM/DD`.
 */
export type DateSegmentOrder = 'MDY' | 'DMY' | 'YMD';

export interface DateInputProps extends BaseComponentProps {
  /** Controlled value as ISO date `"YYYY-MM-DD"`, or `null` for empty. */
  value?: string | null;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string | null;
  /**
   * Fired when the value changes. Emits `null` while the input is empty or
   * partially filled; emits a complete ISO date once all three segments are
   * valid.
   */
  onChange?: (value: string | null) => void;

  /** Lower bound (inclusive) — ISO date. Out-of-bounds values flag invalid. */
  min?: string;
  /** Upper bound (inclusive) — ISO date. */
  max?: string;

  /** Mark the input as invalid. Sets `aria-invalid` automatically. */
  invalid?: boolean;
  /** Disable interaction. */
  disabled?: boolean;
  /** Make the input read-only. */
  readOnly?: boolean;
  /** Mark as required for form submission. */
  required?: boolean;
  /** Auto-focus the first segment on mount. */
  autoFocus?: boolean;

  /** Segment order. @default 'MDY' */
  segmentOrder?: DateSegmentOrder;

  /** Field name — when set, a hidden input carries the ISO value into form data. */
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

interface SegmentState {
  month: string;
  day: string;
  year: string;
}

const EMPTY: SegmentState = { month: '', day: '', year: '' };

function pad(s: string, len: number): string {
  return s.padStart(len, '0');
}

function parseValue(value: string | null | undefined): SegmentState {
  if (!value || value.length !== 10) return EMPTY;
  const y = value.slice(0, 4);
  const m = value.slice(5, 7);
  const d = value.slice(8, 10);
  if (!/^\d{4}$/.test(y) || !/^\d{2}$/.test(m) || !/^\d{2}$/.test(d)) return EMPTY;
  return { month: m, day: d, year: y };
}

function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

function isCompleteAndValid(seg: SegmentState): string | null {
  if (seg.month.length !== 2 || seg.day.length !== 2 || seg.year.length !== 4) return null;
  const m = Number(seg.month);
  const d = Number(seg.day);
  const y = Number(seg.year);
  if (!Number.isFinite(m) || !Number.isFinite(d) || !Number.isFinite(y)) return null;
  if (m < 1 || m > 12) return null;
  if (y < 1 || y > 9999) return null;
  if (d < 1 || d > daysInMonth(y, m)) return null;
  return `${pad(seg.year, 4)}-${pad(seg.month, 2)}-${pad(seg.day, 2)}`;
}

function clampSegment(part: 'month' | 'day' | 'year', raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (part === 'year') return digits.slice(0, 4);
  return digits.slice(0, 2);
}

const PLACEHOLDER: Record<keyof SegmentState, string> = {
  month: 'MM',
  day: 'DD',
  year: 'YYYY',
};

const SEGMENT_LABEL: Record<keyof SegmentState, string> = {
  month: 'month',
  day: 'day',
  year: 'year',
};

const SEGMENT_LIMITS: Record<keyof SegmentState, { min: number; max: number; pad: number }> = {
  month: { min: 1, max: 12, pad: 2 },
  day: { min: 1, max: 31, pad: 2 },
  year: { min: 1, max: 9999, pad: 4 },
};

function nudge(part: keyof SegmentState, raw: string, delta: number): string {
  const limits = SEGMENT_LIMITS[part];
  const current = raw === '' ? limits.min : Number(raw);
  let next = current + delta;
  if (next > limits.max) next = limits.min;
  if (next < limits.min) next = limits.max;
  return pad(String(next), limits.pad);
}

function segmentsForOrder(order: DateSegmentOrder): (keyof SegmentState)[] {
  switch (order) {
    case 'MDY':
      return ['month', 'day', 'year'];
    case 'DMY':
      return ['day', 'month', 'year'];
    case 'YMD':
      return ['year', 'month', 'day'];
  }
}

export const DateInput = forwardRef<HTMLDivElement, DateInputProps>(function DateInput(
  {
    value: controlledValue,
    defaultValue,
    onChange,
    min,
    max,
    invalid = false,
    disabled = false,
    readOnly = false,
    required = false,
    autoFocus = false,
    segmentOrder = 'MDY',
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

  const [value, setValue] = useControllableState<string | null>({
    value: controlledValue,
    defaultValue: defaultValue ?? null,
    onChange,
  });

  const [segments, setSegments] = useState<SegmentState>(() => parseValue(value));
  const segmentsRef = useRef<SegmentState>(segments);
  segmentsRef.current = segments;
  const lastEmittedRef = useRef<string | null>(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<Record<keyof SegmentState, HTMLInputElement | null>>({
    month: null,
    day: null,
    year: null,
  });

  useImperativeHandle(ref, () => containerRef.current as HTMLDivElement, []);

  useEffect(() => {
    const parsed = parseValue(value);
    if (
      parsed.month !== segments.month ||
      parsed.day !== segments.day ||
      parsed.year !== segments.year
    ) {
      // controlled value changed externally — reflect in segments
      if (value !== lastEmittedRef.current) {
        setSegments(parsed);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const order = segmentsForOrder(segmentOrder);

  const focusSegment = useCallback((part: keyof SegmentState): void => {
    const el = segmentRefs.current[part];
    if (!el) return;
    el.focus();
    el.select();
  }, []);

  const focusNext = useCallback(
    (part: keyof SegmentState): void => {
      const idx = order.indexOf(part);
      const next = order[idx + 1];
      if (next) focusSegment(next);
    },
    [order, focusSegment],
  );

  const focusPrev = useCallback(
    (part: keyof SegmentState): void => {
      const idx = order.indexOf(part);
      const prev = order[idx - 1];
      if (prev) focusSegment(prev);
    },
    [order, focusSegment],
  );

  const commitSegments = useCallback(
    (next: SegmentState): void => {
      segmentsRef.current = next;
      setSegments(next);
      const iso = isCompleteAndValid(next);
      if (iso !== lastEmittedRef.current) {
        lastEmittedRef.current = iso;
        setValue(iso);
      }
    },
    [setValue],
  );

  const onSegmentChange = (part: keyof SegmentState) => (e: ChangeEvent<HTMLInputElement>): void => {
    if (readOnly) return;
    const cleaned = clampSegment(part, e.target.value);
    const next = { ...segments, [part]: cleaned };
    commitSegments(next);
    const limit = SEGMENT_LIMITS[part];
    if (cleaned.length === limit.pad) focusNext(part);
  };

  const onSegmentKeyDown = (part: keyof SegmentState) => (e: KeyboardEvent<HTMLInputElement>): void => {
    if (disabled) return;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (readOnly) return;
      const next = { ...segments, [part]: nudge(part, segments[part], 1) };
      commitSegments(next);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (readOnly) return;
      const next = { ...segments, [part]: nudge(part, segments[part], -1) };
      commitSegments(next);
      return;
    }
    if (e.key === 'ArrowLeft') {
      const target = e.currentTarget;
      if (target.selectionStart === 0) {
        e.preventDefault();
        focusPrev(part);
      }
      return;
    }
    if (e.key === 'ArrowRight') {
      const target = e.currentTarget;
      if (target.selectionStart === target.value.length) {
        e.preventDefault();
        focusNext(part);
      }
      return;
    }
    if (e.key === 'Backspace' && segments[part] === '') {
      e.preventDefault();
      focusPrev(part);
      return;
    }
    if (e.key === '/' || e.key === '-' || e.key === '.') {
      e.preventDefault();
      focusNext(part);
      return;
    }
  };

  const onSegmentFocus = (part: keyof SegmentState) => (e: FocusEvent<HTMLInputElement>): void => {
    e.currentTarget.select();
  };

  const onSegmentBlur = (part: keyof SegmentState) => (): void => {
    if (part === 'year') return;
    const current = segmentsRef.current;
    const raw = current[part];
    if (raw === '' || raw.length === SEGMENT_LIMITS[part].pad) return;
    const padded = pad(raw, SEGMENT_LIMITS[part].pad);
    if (padded !== raw) commitSegments({ ...current, [part]: padded });
  };

  const isOutOfBounds = (() => {
    const iso = isCompleteAndValid(segments);
    if (!iso) return false;
    if (min && iso < min) return true;
    if (max && iso > max) return true;
    return false;
  })();

  const showInvalid = invalid || isOutOfBounds;

  const renderSegment = (part: keyof SegmentState, isFirst: boolean): React.JSX.Element => {
    const limits = SEGMENT_LIMITS[part];
    const placeholderText = PLACEHOLDER[part];
    const widthVariant: 'sm' | 'lg' = part === 'year' ? 'lg' : 'sm';
    return (
      <input
        key={part}
        ref={(el) => {
          segmentRefs.current[part] = el;
        }}
        id={isFirst ? id : undefined}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        spellCheck={false}
        autoFocus={isFirst && autoFocus}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        aria-label={SEGMENT_LABEL[part]}
        aria-valuenow={segments[part] ? Number(segments[part]) : undefined}
        aria-valuemin={limits.min}
        aria-valuemax={limits.max}
        data-testid={dataTestId ? `${dataTestId}-${part}` : undefined}
        className={styles.segment({ width: widthVariant })}
        placeholder={placeholderText}
        value={segments[part]}
        size={limits.pad}
        onChange={onSegmentChange(part)}
        onKeyDown={onSegmentKeyDown(part)}
        onFocus={onSegmentFocus(part)}
        onBlur={onSegmentBlur(part)}
      />
    );
  };

  const isoForForm = isCompleteAndValid(segments) ?? '';

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
      className={styles.root({ invalid: showInvalid, disabled })}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {order.map((part, i) => {
        const isFirst = i === 0;
        const sep = i < order.length - 1 ? <span aria-hidden="true" className={styles.separator}>/</span> : null;
        return (
          <span key={part} className={styles.segmentSlot}>
            {renderSegment(part, isFirst)}
            {sep}
          </span>
        );
      })}
      {name ? <input type="hidden" name={name} value={isoForForm} form={form} /> : null}
    </div>
  );
});
