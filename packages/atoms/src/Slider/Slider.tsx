import { forwardRef, useCallback, useId, useMemo, useRef } from 'react';
import type { KeyboardEvent, PointerEvent as ReactPointerEvent, Ref } from 'react';
import { useControllableState, useMergedRefs } from '@touchstone/hooks';
import type { BaseComponentProps } from '../types.js';
import * as styles from './Slider.css.js';

/**
 * Continuous-value control. Single thumb by default; pass `range` for a
 * two-thumb range. Both modes share the same component — there is no
 * separate `RangeSlider` to retire.
 *
 * Each thumb is a focusable `role="slider"` with `aria-valuemin`,
 * `aria-valuemax`, and `aria-valuenow`. Keyboard:
 *   - Arrow keys move by `step`
 *   - Shift + Arrow moves by 10 × `step`
 *   - Home / End jump to `min` / `max`
 *   - PageUp / PageDown move by 10 × `step` (no shift required)
 *
 * Pointer: clicking the track jumps the nearest thumb to that position;
 * dragging a thumb moves it. Pair with `Field` for label / hint / error
 * wiring; pass `aria-label` directly when freestanding.
 */
export interface SliderProps extends BaseComponentProps {
  /**
   * Controlled value. A `number` for single-thumb; a `[start, end]` tuple
   * for `range`.
   */
  value?: number | [number, number];
  /** Uncontrolled initial value. */
  defaultValue?: number | [number, number];
  /** Called when the value changes. Tuple shape mirrors `value`. */
  onChange?: (value: number | [number, number]) => void;
  /** Called once at the end of a drag. Useful for "commit on release" flows. */
  onCommit?: (value: number | [number, number]) => void;
  /** Two thumbs that define a range. The thumbs cannot cross. @default false */
  range?: boolean;
  /** Lower bound. @default 0 */
  min?: number;
  /** Upper bound. @default 100 */
  max?: number;
  /** Step. @default 1 */
  step?: number;
  /** Visual size. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Disable interaction. */
  disabled?: boolean;
  /**
   * Format the announced value (`aria-valuetext`). Receives the numeric
   * value and the thumb index (0 = single / start, 1 = end).
   */
  formatValue?: (value: number, thumbIndex: 0 | 1) => string;
  /** Form name — when set, hidden inputs carry the value(s) into form data. */
  name?: string;
  /** Form id this slider belongs to. */
  form?: string;
  /** Accessible label for the slider. Required when no `aria-labelledby`. */
  'aria-label'?: string;
  /** Accessible label by id (e.g. from a `Field`). */
  'aria-labelledby'?: string;
  /** Accessible description by id (e.g. a `Field` hint or error). */
  'aria-describedby'?: string;
}

type Tuple = [number, number];

function clampToRange(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function snap(value: number, min: number, step: number): number {
  if (step <= 0) return value;
  const steps = Math.round((value - min) / step);
  return min + steps * step;
}

function roundToStep(value: number, min: number, max: number, step: number): number {
  const snapped = snap(value, min, step);
  const clamped = clampToRange(snapped, min, max);
  // avoid floating-point drift like 0.30000000000000004
  if (step < 1) {
    const decimals = Math.max(0, -Math.floor(Math.log10(step)));
    return Number(clamped.toFixed(decimals));
  }
  return clamped;
}

function defaultSingleValue(min: number): number {
  return min;
}

function defaultRangeValue(min: number, max: number): Tuple {
  return [min, max];
}

function isTuple(value: unknown): value is Tuple {
  return Array.isArray(value) && value.length === 2;
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    value: controlledValue,
    defaultValue,
    onChange,
    onCommit,
    range = false,
    min = 0,
    max = 100,
    step = 1,
    size = 'md',
    disabled = false,
    formatValue,
    name,
    form,
    id: providedId,
    'data-testid': dataTestId,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
  },
  ref,
) {
  const reactId = useId();
  const id = providedId ?? reactId;

  const initial = useMemo<number | Tuple>(() => {
    if (defaultValue !== undefined) return defaultValue;
    return range ? defaultRangeValue(min, max) : defaultSingleValue(min);
  }, [defaultValue, range, min, max]);

  const [value, setValue] = useControllableState<number | Tuple>({
    value: controlledValue,
    defaultValue: initial,
    onChange: onChange as ((next: number | Tuple) => void) | undefined,
  });

  const trackRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs<HTMLDivElement>(rootRef, ref as Ref<HTMLDivElement>);
  const activeThumb = useRef<0 | 1 | null>(null);

  const span = max - min;

  const tuple: Tuple = useMemo(() => {
    if (range) {
      const [a, b] = isTuple(value) ? value : [min, max];
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      return [clampToRange(lo, min, max), clampToRange(hi, min, max)];
    }
    const v = typeof value === 'number' ? value : min;
    return [min, clampToRange(v, min, max)];
  }, [value, range, min, max]);

  const fillStart = range ? ((tuple[0] - min) / span) * 100 : 0;
  const fillEnd = ((tuple[1] - min) / span) * 100;

  const positionOf = (thumb: 0 | 1): number => {
    if (range) return thumb === 0 ? fillStart : fillEnd;
    return fillEnd;
  };

  const commitValue = useCallback(
    (next: number | Tuple): void => {
      setValue(next);
    },
    [setValue],
  );

  const setThumbValue = useCallback(
    (thumb: 0 | 1, raw: number): void => {
      const snapped = roundToStep(raw, min, max, step);
      if (range) {
        const [lo, hi] = tuple;
        if (thumb === 0) {
          const next: Tuple = [Math.min(snapped, hi), hi];
          if (next[0] !== lo) commitValue(next);
        } else {
          const next: Tuple = [lo, Math.max(snapped, lo)];
          if (next[1] !== hi) commitValue(next);
        }
        return;
      }
      const current = tuple[1];
      if (snapped !== current) commitValue(snapped);
    },
    [range, tuple, min, max, step, commitValue],
  );

  const valueFromClientX = useCallback(
    (clientX: number): number => {
      const track = trackRef.current;
      if (!track) return min;
      const rect = track.getBoundingClientRect();
      if (rect.width === 0) return min;
      const ratio = clampToRange((clientX - rect.left) / rect.width, 0, 1);
      return min + ratio * span;
    },
    [min, span],
  );

  const nearestThumb = useCallback(
    (raw: number): 0 | 1 => {
      if (!range) return 1;
      const [lo, hi] = tuple;
      return Math.abs(raw - lo) <= Math.abs(raw - hi) ? 0 : 1;
    },
    [range, tuple],
  );

  const onKeyDown = (thumb: 0 | 1) => (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const big = step * 10;
    const current = tuple[thumb];
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      next = current + (e.shiftKey ? big : step);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      next = current - (e.shiftKey ? big : step);
    } else if (e.key === 'PageUp') {
      next = current + big;
    } else if (e.key === 'PageDown') {
      next = current - big;
    } else if (e.key === 'Home') {
      next = min;
    } else if (e.key === 'End') {
      next = max;
    }
    if (next !== null) {
      e.preventDefault();
      setThumbValue(thumb, next);
      onCommit?.(range ? readTupleAfter(thumb, next, tuple) : next);
    }
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>): void => {
    if (disabled) return;
    if (e.button !== 0 && e.button !== undefined) return;
    e.preventDefault();
    const raw = valueFromClientX(e.clientX);
    const thumb = nearestThumb(raw);
    activeThumb.current = thumb;
    setThumbValue(thumb, raw);

    const root = rootRef.current;
    const targetEl = root ?? (e.currentTarget as HTMLElement);
    if (root) root.setPointerCapture?.(e.pointerId);

    const move = (ev: PointerEvent): void => {
      if (activeThumb.current === null) return;
      const v = valueFromClientX(ev.clientX);
      setThumbValue(activeThumb.current, v);
    };
    const up = (ev: PointerEvent): void => {
      const finalRaw = valueFromClientX(ev.clientX);
      const t = activeThumb.current;
      activeThumb.current = null;
      targetEl.removeEventListener('pointermove', move);
      targetEl.removeEventListener('pointerup', up);
      targetEl.removeEventListener('pointercancel', up);
      if (root) root.releasePointerCapture?.(ev.pointerId);
      if (t !== null) {
        const snapped = roundToStep(finalRaw, min, max, step);
        const final = range ? readTupleAfter(t, snapped, tuple) : snapped;
        onCommit?.(final);
      }
    };
    targetEl.addEventListener('pointermove', move);
    targetEl.addEventListener('pointerup', up);
    targetEl.addEventListener('pointercancel', up);
  };

  const renderThumb = (thumb: 0 | 1): React.JSX.Element => {
    const v = tuple[thumb];
    const text = formatValue ? formatValue(v, thumb) : String(v);
    const left = positionOf(thumb);
    return (
      <div
        key={thumb}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={range && thumb === 1 ? tuple[0] : min}
        aria-valuemax={range && thumb === 0 ? tuple[1] : max}
        aria-valuenow={v}
        aria-valuetext={text}
        aria-orientation="horizontal"
        aria-disabled={disabled || undefined}
        aria-label={range ? `${ariaLabel ?? 'value'} ${thumb === 0 ? 'start' : 'end'}` : ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        id={`${id}-thumb-${thumb}`}
        data-testid={dataTestId ? `${dataTestId}-thumb-${thumb}` : undefined}
        className={styles.thumb({ size })}
        style={{ left: `${left}%` }}
        onKeyDown={onKeyDown(thumb)}
      />
    );
  };

  return (
    <div
      ref={mergedRef}
      id={id}
      data-testid={dataTestId}
      className={styles.root({ size })}
      aria-disabled={disabled || undefined}
      onPointerDown={onPointerDown}
    >
      <div
        ref={trackRef}
        className={styles.track({ size })}
        data-testid={dataTestId ? `${dataTestId}-track` : undefined}
      >
        <span
          className={styles.fill}
          style={{
            left: `${fillStart}%`,
            right: `${100 - fillEnd}%`,
          }}
        />
        {range ? renderThumb(0) : null}
        {renderThumb(1)}
      </div>
      {name ? (
        <>
          {range ? (
            <>
              <input type="hidden" name={`${name}.start`} value={tuple[0]} form={form} />
              <input type="hidden" name={`${name}.end`} value={tuple[1]} form={form} />
            </>
          ) : (
            <input type="hidden" name={name} value={tuple[1]} form={form} />
          )}
        </>
      ) : null}
    </div>
  );
});

function readTupleAfter(thumb: 0 | 1, snapped: number, current: Tuple): Tuple {
  const [lo, hi] = current;
  if (thumb === 0) return [Math.min(snapped, hi), hi];
  return [lo, Math.max(snapped, lo)];
}
