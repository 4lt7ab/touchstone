import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';

export interface UseSnapDragOptions {
  /**
   * Sorted ascending list of preset pixel values. The drag is clamped to
   * `[presets[0], presets.at(-1)]` and snaps to the nearest entry on release.
   */
  presets: number[];
  /** Currently committed preset value. Must equal one of `presets`. */
  value: number;
  /** Fires when the drag ends or a keyboard step lands; always one of `presets`. */
  onChange: (next: number) => void;
  /**
   * Mirror the pointer-delta direction. Set true for right-edge rails (an
   * inspector on the trailing edge), where moving the pointer left grows the
   * rail. @default false
   */
  reverse?: boolean;
  /** Accessible name for the handle. */
  'aria-label'?: string;
}

export interface UseSnapDragHandleProps {
  role: 'separator';
  'aria-orientation': 'vertical';
  'aria-valuemin': number;
  'aria-valuemax': number;
  'aria-valuenow': number;
  'aria-label'?: string;
  tabIndex: 0;
  onPointerDown: (e: PointerEvent<HTMLElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
}

export interface UseSnapDragReturn {
  /** Spread on the handle element. */
  handleProps: UseSnapDragHandleProps;
  /** True while the user is actively dragging. */
  isDragging: boolean;
  /**
   * Pixel size to render while dragging — tracks the pointer between
   * `presets[0]` and `presets.at(-1)`. Equals `value` when idle.
   */
  previewSize: number;
}

function nearestPreset(target: number, presets: number[]): number {
  let best = presets[0]!;
  let bestDiff = Math.abs(target - best);
  for (let i = 1; i < presets.length; i++) {
    const candidate = presets[i]!;
    const diff = Math.abs(target - candidate);
    if (diff < bestDiff) {
      best = candidate;
      bestDiff = diff;
    }
  }
  return best;
}

/**
 * Pointer + keyboard drag handle that snaps to a fixed list of preset pixel
 * widths. Designed for resizable rails (sidebar, inspector) where the kit
 * commits only to known sizes (`sm | md | lg` etc.), but consumers want a
 * physical drag interaction.
 *
 * The drag is clamped to `[min, max]` derived from the presets. While
 * dragging, `previewSize` tracks the pointer continuously — consumers apply
 * it to the rail for a live preview. On release the hook snaps to the
 * nearest preset and emits it through `onChange`. Keyboard: arrow keys cycle
 * between adjacent presets, Home / End jump to the extremes.
 */
export function useSnapDrag(options: UseSnapDragOptions): UseSnapDragReturn {
  const { presets, value, onChange, reverse = false } = options;
  const ariaLabel = options['aria-label'];

  if (presets.length === 0) {
    throw new Error('useSnapDrag: presets must contain at least one value');
  }

  const min = presets[0]!;
  const max = presets[presets.length - 1]!;

  const [isDragging, setIsDragging] = useState(false);
  const [previewSize, setPreviewSize] = useState<number>(value);
  const dragRef = useRef<{ startX: number; startValue: number } | null>(null);

  // Keep the preview synced with the committed value when not dragging
  // (handles external state changes, storage hydration, parent rerender).
  useEffect(() => {
    if (!isDragging) setPreviewSize(value);
  }, [value, isDragging]);

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLElement>): void => {
      if (e.button !== 0) return;
      e.preventDefault();
      dragRef.current = { startX: e.clientX, startValue: value };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setIsDragging(true);
    },
    [value],
  );

  useEffect(() => {
    if (!isDragging) return;

    function clampDelta(clientX: number): number {
      const drag = dragRef.current;
      if (!drag) return value;
      const dx = (clientX - drag.startX) * (reverse ? -1 : 1);
      return Math.max(min, Math.min(max, drag.startValue + dx));
    }

    function handleMove(e: globalThis.PointerEvent): void {
      const next = clampDelta(e.clientX);
      setPreviewSize(next);
    }

    function handleUp(e: globalThis.PointerEvent): void {
      const target = clampDelta(e.clientX);
      const snapped = nearestPreset(target, presets);
      dragRef.current = null;
      setIsDragging(false);
      setPreviewSize(snapped);
      if (snapped !== value) onChange(snapped);
    }

    function handleCancel(): void {
      dragRef.current = null;
      setIsDragging(false);
      setPreviewSize(value);
    }

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleCancel);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleCancel);
    };
  }, [isDragging, min, max, presets, onChange, reverse, value]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>): void => {
      const idx = presets.indexOf(value);
      const safeIdx = idx === -1 ? 0 : idx;

      let target: number | null = null;
      // Within an arrow-key model, "smaller" is left/down and "larger" is
      // right/up regardless of reverse. The `reverse` knob only affects
      // pointer-delta sign.
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        target = presets[Math.max(0, safeIdx - 1)]!;
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        target = presets[Math.min(presets.length - 1, safeIdx + 1)]!;
      } else if (e.key === 'Home') {
        target = presets[0]!;
      } else if (e.key === 'End') {
        target = presets[presets.length - 1]!;
      }

      if (target === null) return;
      e.preventDefault();
      if (target !== value) onChange(target);
    },
    [presets, value, onChange],
  );

  const handleProps: UseSnapDragHandleProps = {
    role: 'separator',
    'aria-orientation': 'vertical',
    'aria-valuemin': min,
    'aria-valuemax': max,
    'aria-valuenow': isDragging ? Math.round(previewSize) : value,
    tabIndex: 0,
    onPointerDown,
    onKeyDown,
    ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
  };

  return {
    handleProps,
    isDragging,
    previewSize: isDragging ? previewSize : value,
  };
}
