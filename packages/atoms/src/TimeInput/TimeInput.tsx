import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import type { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';
import { useControllableState } from '@touchstone/hooks';
import type { BaseComponentProps } from '../types.js';
import * as styles from './TimeInput.css.js';

/**
 * Segmented 24-hour time entry. `HH:MM` by default; `HH:MM:SS` when
 * `precision="second"`. Mirrors `DateInput`'s shape — auto-advance on
 * a full segment, arrow keys nudge values, `:` advances. Always 24-hour
 * for input determinism; pair with `Time` for locale-derived display.
 */
export interface TimeInputProps extends BaseComponentProps {
  /** Controlled value as `"HH:MM"` or `"HH:MM:SS"`, or `null`. */
  value?: string | null;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string | null;
  /**
   * Fires on change. Emits `null` while incomplete or invalid; emits a
   * complete string once all segments are valid.
   */
  onChange?: (value: string | null) => void;

  /** Smallest unit. @default 'minute' */
  precision?: 'minute' | 'second';

  /** Earliest time (inclusive) — same format as `value`. */
  min?: string;
  /** Latest time (inclusive). */
  max?: string;

  /** Mark invalid. */
  invalid?: boolean;
  /**
   * Strip the input's own chrome — border, background, padding, fixed
   * height. Use when an outer wrapper provides the visual container.
   * @default false
   */
  bare?: boolean;
  /** Disable interaction. */
  disabled?: boolean;
  /** Make the input read-only. */
  readOnly?: boolean;
  /** Mark as required. */
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

type Segment = 'hour' | 'minute' | 'second';

interface SegmentState {
  hour: string;
  minute: string;
  second: string;
}

const EMPTY: SegmentState = { hour: '', minute: '', second: '' };

const PLACEHOLDER: Record<Segment, string> = {
  hour: 'HH',
  minute: 'MM',
  second: 'SS',
};

const LIMITS: Record<Segment, { min: number; max: number; pad: number }> = {
  hour: { min: 0, max: 23, pad: 2 },
  minute: { min: 0, max: 59, pad: 2 },
  second: { min: 0, max: 59, pad: 2 },
};

function pad(s: string, len: number): string {
  return s.padStart(len, '0');
}

function parseValue(value: string | null | undefined): SegmentState {
  if (!value) return EMPTY;
  const parts = value.split(':');
  if (parts.length < 2) return EMPTY;
  const h = parts[0] ?? '';
  const m = parts[1] ?? '';
  const s = parts[2] ?? '';
  if (!/^\d{2}$/.test(h) || !/^\d{2}$/.test(m)) return EMPTY;
  if (s && !/^\d{2}$/.test(s)) return EMPTY;
  return { hour: h, minute: m, second: s };
}

function isValidSegments(seg: SegmentState, precision: 'minute' | 'second'): string | null {
  if (seg.hour.length !== 2 || seg.minute.length !== 2) return null;
  const h = Number(seg.hour);
  const m = Number(seg.minute);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  if (precision === 'minute') return `${pad(seg.hour, 2)}:${pad(seg.minute, 2)}`;
  if (seg.second.length !== 2) return null;
  const s = Number(seg.second);
  if (!Number.isFinite(s) || s < 0 || s > 59) return null;
  return `${pad(seg.hour, 2)}:${pad(seg.minute, 2)}:${pad(seg.second, 2)}`;
}

function clampSegment(_part: Segment, raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 2);
}

function nudge(part: Segment, raw: string, delta: number): string {
  const limits = LIMITS[part];
  const current = raw === '' ? limits.min : Number(raw);
  let next = current + delta;
  if (next > limits.max) next = limits.min;
  if (next < limits.min) next = limits.max;
  return pad(String(next), limits.pad);
}

export const TimeInput = forwardRef<HTMLDivElement, TimeInputProps>(function TimeInput(
  {
    value: controlledValue,
    defaultValue,
    onChange,
    precision = 'minute',
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
  const segmentRefs = useRef<Record<Segment, HTMLInputElement | null>>({
    hour: null,
    minute: null,
    second: null,
  });

  useImperativeHandle(ref, () => containerRef.current as HTMLDivElement, []);

  useEffect(() => {
    const parsed = parseValue(value);
    if (
      parsed.hour !== segments.hour ||
      parsed.minute !== segments.minute ||
      parsed.second !== segments.second
    ) {
      if (value !== lastEmittedRef.current) {
        setSegments(parsed);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const order: Segment[] = precision === 'second' ? ['hour', 'minute', 'second'] : ['hour', 'minute'];

  const focusSegment = useCallback((part: Segment): void => {
    const el = segmentRefs.current[part];
    if (!el) return;
    el.focus();
    el.select();
  }, []);

  const focusNext = useCallback(
    (part: Segment): void => {
      const idx = order.indexOf(part);
      const next = order[idx + 1];
      if (next) focusSegment(next);
    },
    [order, focusSegment],
  );

  const focusPrev = useCallback(
    (part: Segment): void => {
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
      const iso = isValidSegments(next, precision);
      if (iso !== lastEmittedRef.current) {
        lastEmittedRef.current = iso;
        setValue(iso);
      }
    },
    [setValue, precision],
  );

  const onSegmentChange = (part: Segment) => (e: ChangeEvent<HTMLInputElement>): void => {
    if (readOnly) return;
    const cleaned = clampSegment(part, e.target.value);
    const next = { ...segments, [part]: cleaned };
    commitSegments(next);
    if (cleaned.length === LIMITS[part].pad) focusNext(part);
  };

  const onSegmentKeyDown = (part: Segment) => (e: KeyboardEvent<HTMLInputElement>): void => {
    if (disabled) return;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (readOnly) return;
      commitSegments({ ...segments, [part]: nudge(part, segments[part], 1) });
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (readOnly) return;
      commitSegments({ ...segments, [part]: nudge(part, segments[part], -1) });
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
    if (e.key === ':' || e.key === '.' || e.key === ' ') {
      e.preventDefault();
      focusNext(part);
      return;
    }
  };

  const onSegmentFocus = (_part: Segment) => (e: FocusEvent<HTMLInputElement>): void => {
    e.currentTarget.select();
  };

  // Browsers place the cursor at the click point even when a focus handler
  // already called `.select()`. Re-select on mouse-up so a click on a
  // focused segment doesn't drop the selection — typing always overwrites,
  // matching how segmented date / time inputs behave in design systems.
  const onSegmentMouseUp = (_part: Segment) => (e: React.MouseEvent<HTMLInputElement>): void => {
    e.currentTarget.select();
  };

  const onSegmentBlur = (part: Segment) => (): void => {
    const current = segmentsRef.current;
    const raw = current[part];
    if (raw === '' || raw.length === LIMITS[part].pad) return;
    const padded = pad(raw, LIMITS[part].pad);
    if (padded !== raw) commitSegments({ ...current, [part]: padded });
  };

  const isOutOfBounds = (() => {
    const iso = isValidSegments(segments, precision);
    if (!iso) return false;
    if (min && iso < min) return true;
    if (max && iso > max) return true;
    return false;
  })();

  const showInvalid = invalid || isOutOfBounds;

  const renderSegment = (part: Segment, isFirst: boolean): React.JSX.Element => {
    const limits = LIMITS[part];
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
        aria-label={part}
        aria-valuenow={segments[part] ? Number(segments[part]) : undefined}
        aria-valuemin={limits.min}
        aria-valuemax={limits.max}
        data-testid={dataTestId ? `${dataTestId}-${part}` : undefined}
        className={styles.segment}
        placeholder={PLACEHOLDER[part]}
        value={segments[part]}
        size={limits.pad}
        onChange={onSegmentChange(part)}
        onKeyDown={onSegmentKeyDown(part)}
        onFocus={onSegmentFocus(part)}
        onMouseUp={onSegmentMouseUp(part)}
        onBlur={onSegmentBlur(part)}
      />
    );
  };

  const isoForForm = isValidSegments(segments, precision) ?? '';

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
      {order.map((part, i) => {
        const isFirst = i === 0;
        const sep = i < order.length - 1 ? <span aria-hidden="true" className={styles.separator}>:</span> : null;
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
