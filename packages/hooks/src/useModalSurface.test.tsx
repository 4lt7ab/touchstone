import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { useRef } from 'react';
import { useModalSurface } from './useModalSurface.js';
import type { UseModalSurfaceReturn } from './useModalSurface.js';

function Panel({
  onDismiss,
  dismissible,
  out,
}: {
  onDismiss: () => void;
  dismissible?: boolean;
  out?: { current: UseModalSurfaceReturn | null };
}): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const result = useModalSurface(ref, {
    onDismiss,
    ...(dismissible !== undefined ? { dismissible } : {}),
  });
  if (out) out.current = result;
  return (
    <div data-testid="panel" ref={ref} tabIndex={-1}>
      <button>inside</button>
    </div>
  );
}

describe('useModalSurface', () => {
  it('dismisses on Escape', () => {
    const onDismiss = vi.fn();
    render(<Panel onDismiss={onDismiss} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('dismisses on outside mousedown', () => {
    const onDismiss = vi.fn();
    render(
      <>
        <Panel onDismiss={onDismiss} />
        <button data-testid="outside">outside</button>
      </>,
    );
    fireEvent.mouseDown(document.querySelector('[data-testid="outside"]')!);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not dismiss when dismissible is false', () => {
    const onDismiss = vi.fn();
    render(<Panel onDismiss={onDismiss} dismissible={false} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('only the topmost surface receives Escape', () => {
    const dismissA = vi.fn();
    const dismissB = vi.fn();
    render(
      <>
        <Panel onDismiss={dismissA} />
        <Panel onDismiss={dismissB} />
      </>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(dismissA).not.toHaveBeenCalled();
    expect(dismissB).toHaveBeenCalledTimes(1);
  });

  it('focuses the panel on mount', () => {
    render(<Panel onDismiss={() => {}} />);
    expect(document.activeElement).toBe(document.querySelector('[data-testid="panel"]'));
  });
});
