import { describe, expect, it, vi } from 'vitest';
import { useRef } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { useClickOutside } from './useClickOutside.js';

function Probe({
  onOutside,
  enabled,
}: {
  onOutside: (e: MouseEvent) => void;
  enabled: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useClickOutside(ref, onOutside, enabled);
  return (
    <>
      <div ref={ref} data-testid="inside">
        inside
      </div>
      <div data-testid="outside">outside</div>
    </>
  );
}

describe('useClickOutside', () => {
  it('fires on mousedown outside the ref when enabled', () => {
    const handler = vi.fn();
    const { getByTestId } = render(<Probe onOutside={handler} enabled />);
    fireEvent.mouseDown(getByTestId('outside'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not fire on mousedown inside the ref', () => {
    const handler = vi.fn();
    const { getByTestId } = render(<Probe onOutside={handler} enabled />);
    fireEvent.mouseDown(getByTestId('inside'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('does not attach when disabled', () => {
    const handler = vi.fn();
    const { getByTestId } = render(<Probe onOutside={handler} enabled={false} />);
    fireEvent.mouseDown(getByTestId('outside'));
    expect(handler).not.toHaveBeenCalled();
  });
});
