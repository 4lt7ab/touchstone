import { describe, expect, it } from 'vitest';
import { useRef } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { useFocusTrap } from './useFocusTrap.js';

function Probe() {
  const ref = useRef<HTMLDivElement | null>(null);
  useFocusTrap(ref);
  return (
    <div ref={ref} data-testid="trap">
      <button data-testid="first">first</button>
      <button data-testid="middle">middle</button>
      <button data-testid="last">last</button>
    </div>
  );
}

describe('useFocusTrap', () => {
  it('Tab from last cycles to first', () => {
    const { getByTestId } = render(<Probe />);
    const last = getByTestId('last');
    last.focus();
    expect(document.activeElement).toBe(last);

    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(getByTestId('first'));
  });

  it('Shift+Tab from first cycles to last', () => {
    const { getByTestId } = render(<Probe />);
    const first = getByTestId('first');
    first.focus();
    expect(document.activeElement).toBe(first);

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(getByTestId('last'));
  });
});
