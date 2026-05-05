import type { PointerEvent as ReactPointerEvent } from 'react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, renderHook } from '@testing-library/react';
import { useHoverIntent } from './useHoverIntent.js';

interface HostProps {
  openDelay?: number;
  closeDelay?: number;
  enabled?: boolean;
  respondToFocus?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Host(props: HostProps): React.JSX.Element {
  const { open, triggerProps, contentProps } = useHoverIntent(props);
  return (
    <div>
      <button data-testid="trigger" {...triggerProps}>
        trigger
      </button>
      {open ? (
        <div data-testid="content" {...contentProps}>
          content
        </div>
      ) : null}
    </div>
  );
}

describe('useHoverIntent', () => {
  it('opens after openDelay on pointer enter', () => {
    vi.useFakeTimers();
    const { getByTestId, queryByTestId } = render(<Host openDelay={200} closeDelay={100} />);
    fireEvent.pointerEnter(getByTestId('trigger'), { pointerType: 'mouse' });
    expect(queryByTestId('content')).toBeNull();
    act(() => {
      vi.advanceTimersByTime(199);
    });
    expect(queryByTestId('content')).toBeNull();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(queryByTestId('content')).not.toBeNull();
    vi.useRealTimers();
  });

  it('cancels the open if the pointer leaves before openDelay elapses', () => {
    vi.useFakeTimers();
    const { getByTestId, queryByTestId } = render(<Host openDelay={200} closeDelay={100} />);
    fireEvent.pointerEnter(getByTestId('trigger'), { pointerType: 'mouse' });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    fireEvent.pointerLeave(getByTestId('trigger'), { pointerType: 'mouse' });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(queryByTestId('content')).toBeNull();
    vi.useRealTimers();
  });

  it('closes after closeDelay on pointer leave', () => {
    vi.useFakeTimers();
    const { getByTestId, queryByTestId } = render(<Host openDelay={0} closeDelay={150} />);
    fireEvent.pointerEnter(getByTestId('trigger'), { pointerType: 'mouse' });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(queryByTestId('content')).not.toBeNull();
    fireEvent.pointerLeave(getByTestId('trigger'), { pointerType: 'mouse' });
    act(() => {
      vi.advanceTimersByTime(149);
    });
    expect(queryByTestId('content')).not.toBeNull();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(queryByTestId('content')).toBeNull();
    vi.useRealTimers();
  });

  it('keeps the surface open when the pointer moves into the content', () => {
    vi.useFakeTimers();
    const { getByTestId, queryByTestId } = render(<Host openDelay={0} closeDelay={100} />);
    fireEvent.pointerEnter(getByTestId('trigger'), { pointerType: 'mouse' });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    fireEvent.pointerLeave(getByTestId('trigger'), { pointerType: 'mouse' });
    fireEvent.pointerEnter(getByTestId('content'), { pointerType: 'mouse' });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(queryByTestId('content')).not.toBeNull();
    vi.useRealTimers();
  });

  it('closes after the pointer leaves the content', () => {
    vi.useFakeTimers();
    const { getByTestId, queryByTestId } = render(<Host openDelay={0} closeDelay={100} />);
    fireEvent.pointerEnter(getByTestId('trigger'), { pointerType: 'mouse' });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    fireEvent.pointerLeave(getByTestId('trigger'), { pointerType: 'mouse' });
    fireEvent.pointerEnter(getByTestId('content'), { pointerType: 'mouse' });
    fireEvent.pointerLeave(getByTestId('content'), { pointerType: 'mouse' });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(queryByTestId('content')).toBeNull();
    vi.useRealTimers();
  });

  it('opens on focus without waiting for openDelay', () => {
    const { getByTestId, queryByTestId } = render(<Host openDelay={500} />);
    fireEvent.focus(getByTestId('trigger'));
    expect(queryByTestId('content')).not.toBeNull();
  });

  it('closes on blur without waiting for closeDelay', () => {
    const { getByTestId, queryByTestId } = render(<Host openDelay={0} closeDelay={500} />);
    fireEvent.focus(getByTestId('trigger'));
    expect(queryByTestId('content')).not.toBeNull();
    fireEvent.blur(getByTestId('trigger'));
    expect(queryByTestId('content')).toBeNull();
  });

  it('respondToFocus=false ignores focus / blur', () => {
    const { getByTestId, queryByTestId } = render(<Host respondToFocus={false} />);
    fireEvent.focus(getByTestId('trigger'));
    expect(queryByTestId('content')).toBeNull();
  });

  it('ignores touch pointer events (touch UAs handle hover differently)', () => {
    // jsdom PointerEvent doesn't surface `pointerType` through `fireEvent`,
    // so drive the handler directly to verify the guard.
    const { result } = renderHook(() => useHoverIntent({ openDelay: 0, closeDelay: 0 }));
    act(() => {
      result.current.triggerProps.onPointerEnter({
        pointerType: 'touch',
      } as ReactPointerEvent<Element>);
    });
    expect(result.current.open).toBe(false);
    act(() => {
      result.current.triggerProps.onPointerEnter({
        pointerType: 'mouse',
      } as ReactPointerEvent<Element>);
    });
    expect(result.current.open).toBe(true);
  });

  it('disables the hook when enabled=false and closes any open surface', () => {
    function Toggle(): React.JSX.Element {
      const [enabled, setEnabled] = useState(true);
      return (
        <>
          <Host openDelay={0} enabled={enabled} />
          <button data-testid="off" onClick={() => setEnabled(false)}>
            off
          </button>
        </>
      );
    }
    const { getByTestId, queryByTestId } = render(<Toggle />);
    fireEvent.pointerEnter(getByTestId('trigger'), { pointerType: 'mouse' });
    expect(queryByTestId('content')).not.toBeNull();
    fireEvent.click(getByTestId('off'));
    expect(queryByTestId('content')).toBeNull();
  });

  it('fires onOpenChange when the open state transitions', () => {
    vi.useFakeTimers();
    const onOpenChange = vi.fn();
    const { getByTestId } = render(
      <Host openDelay={0} closeDelay={0} onOpenChange={onOpenChange} />,
    );
    fireEvent.pointerEnter(getByTestId('trigger'), { pointerType: 'mouse' });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(onOpenChange).toHaveBeenCalledWith(true);
    fireEvent.pointerLeave(getByTestId('trigger'), { pointerType: 'mouse' });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    vi.useRealTimers();
  });
});
