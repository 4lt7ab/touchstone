import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useSnapDrag } from './useSnapDrag.js';

const PRESETS = [100, 200, 300];

describe('useSnapDrag', () => {
  it('exposes aria-valuenow at the current value when idle', () => {
    const { result } = renderHook(() =>
      useSnapDrag({ presets: PRESETS, value: 200, onChange: () => {} }),
    );
    expect(result.current.isDragging).toBe(false);
    expect(result.current.previewSize).toBe(200);
    expect(result.current.handleProps['aria-valuemin']).toBe(100);
    expect(result.current.handleProps['aria-valuemax']).toBe(300);
    expect(result.current.handleProps['aria-valuenow']).toBe(200);
  });

  it('keyboard ArrowRight steps to the next preset', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useSnapDrag({ presets: PRESETS, value: 100, onChange }),
    );
    act(() => {
      result.current.handleProps.onKeyDown({
        key: 'ArrowRight',
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLElement>);
    });
    expect(onChange).toHaveBeenCalledWith(200);
  });

  it('keyboard ArrowLeft steps to the previous preset', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useSnapDrag({ presets: PRESETS, value: 300, onChange }),
    );
    act(() => {
      result.current.handleProps.onKeyDown({
        key: 'ArrowLeft',
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLElement>);
    });
    expect(onChange).toHaveBeenCalledWith(200);
  });

  it('Home / End jump to the first / last preset', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useSnapDrag({ presets: PRESETS, value: 200, onChange }),
    );
    act(() => {
      result.current.handleProps.onKeyDown({
        key: 'Home',
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLElement>);
    });
    expect(onChange).toHaveBeenLastCalledWith(100);
    act(() => {
      result.current.handleProps.onKeyDown({
        key: 'End',
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLElement>);
    });
    expect(onChange).toHaveBeenLastCalledWith(300);
  });

  it('does not emit when the keyboard step would land on the current value', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useSnapDrag({ presets: PRESETS, value: 100, onChange }),
    );
    act(() => {
      result.current.handleProps.onKeyDown({
        key: 'ArrowLeft',
        preventDefault: () => {},
      } as React.KeyboardEvent<HTMLElement>);
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('snaps to the nearest preset on pointer release', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useSnapDrag({ presets: PRESETS, value: 100, onChange }),
    );

    act(() => {
      result.current.handleProps.onPointerDown({
        button: 0,
        clientX: 0,
        pointerId: 1,
        preventDefault: () => {},
        currentTarget: { setPointerCapture: () => {} },
      } as unknown as React.PointerEvent<HTMLElement>);
    });
    expect(result.current.isDragging).toBe(true);

    // Drag 170px to the right — between md (delta 100) and lg (delta 200).
    // Closer to md (diff 70 vs 30 to lg)... wait, 170 - 100 = 70, 170 - 200 = -30.
    // Math.abs(70) > Math.abs(-30), so lg (target=300, delta_to_lg = 200) wins.
    act(() => {
      window.dispatchEvent(Object.assign(new Event('pointermove'), { clientX: 170 }));
    });
    expect(result.current.previewSize).toBe(270);

    act(() => {
      window.dispatchEvent(Object.assign(new Event('pointerup'), { clientX: 170 }));
    });
    expect(result.current.isDragging).toBe(false);
    // 270 is closer to 300 (diff 30) than 200 (diff 70) — snaps to 300.
    expect(onChange).toHaveBeenCalledWith(300);
  });

  it('clamps the preview to the min/max of presets', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useSnapDrag({ presets: PRESETS, value: 200, onChange }),
    );
    act(() => {
      result.current.handleProps.onPointerDown({
        button: 0,
        clientX: 0,
        pointerId: 1,
        preventDefault: () => {},
        currentTarget: { setPointerCapture: () => {} },
      } as unknown as React.PointerEvent<HTMLElement>);
    });
    // Push far past lg (delta = 500 from value 200 would land at 700, but max is 300).
    act(() => {
      window.dispatchEvent(Object.assign(new Event('pointermove'), { clientX: 500 }));
    });
    expect(result.current.previewSize).toBe(300);
    // And far below sm.
    act(() => {
      window.dispatchEvent(Object.assign(new Event('pointermove'), { clientX: -500 }));
    });
    expect(result.current.previewSize).toBe(100);
    act(() => {
      window.dispatchEvent(Object.assign(new Event('pointerup'), { clientX: -500 }));
    });
    expect(onChange).toHaveBeenCalledWith(100);
  });

  it('mirrors pointer-delta direction when reverse=true', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useSnapDrag({ presets: PRESETS, value: 200, onChange, reverse: true }),
    );
    act(() => {
      result.current.handleProps.onPointerDown({
        button: 0,
        clientX: 0,
        pointerId: 1,
        preventDefault: () => {},
        currentTarget: { setPointerCapture: () => {} },
      } as unknown as React.PointerEvent<HTMLElement>);
    });
    // Pointer moves LEFT (negative dx) but reverse flips → preview grows.
    act(() => {
      window.dispatchEvent(Object.assign(new Event('pointermove'), { clientX: -90 }));
    });
    expect(result.current.previewSize).toBe(290);
    act(() => {
      window.dispatchEvent(Object.assign(new Event('pointerup'), { clientX: -90 }));
    });
    // Closer to 300 than 200 — snaps up.
    expect(onChange).toHaveBeenCalledWith(300);
  });

  it('forwards aria-label when provided', () => {
    const { result } = renderHook(() =>
      useSnapDrag({
        presets: PRESETS,
        value: 200,
        onChange: () => {},
        'aria-label': 'Resize sidebar',
      }),
    );
    expect(result.current.handleProps['aria-label']).toBe('Resize sidebar');
  });

  it('throws when given an empty preset list', () => {
    expect(() =>
      renderHook(() => useSnapDrag({ presets: [], value: 0, onChange: () => {} })),
    ).toThrow(/at least one value/);
  });
});
