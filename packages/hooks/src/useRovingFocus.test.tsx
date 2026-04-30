import { describe, expect, it } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { useRovingFocus } from './useRovingFocus.js';

function Probe({
  orientation,
  activeIndex = null,
}: {
  orientation?: 'horizontal' | 'vertical';
  activeIndex?: number | null;
}) {
  const { itemRef, onKeyDown, getTabIndex } = useRovingFocus({
    count: 3,
    activeIndex,
    orientation,
  });
  return (
    <>
      {[0, 1, 2].map((i) => (
        <button
          key={i}
          ref={itemRef(i)}
          tabIndex={getTabIndex(i)}
          onKeyDown={onKeyDown(i)}
          data-testid={`item-${i}`}
        >
          {i}
        </button>
      ))}
    </>
  );
}

describe('useRovingFocus', () => {
  it('first item gets tabIndex 0 when no active index', () => {
    const { getByTestId } = render(<Probe />);
    expect(getByTestId('item-0').getAttribute('tabindex')).toBe('0');
    expect(getByTestId('item-1').getAttribute('tabindex')).toBe('-1');
  });

  it('ArrowRight moves focus forward and wraps', () => {
    const { getByTestId } = render(<Probe />);
    const first = getByTestId('item-0');
    first.focus();

    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(getByTestId('item-1'));

    fireEvent.keyDown(getByTestId('item-1'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(getByTestId('item-2'));

    fireEvent.keyDown(getByTestId('item-2'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(getByTestId('item-0'));
  });

  it('Home / End jump to ends', () => {
    const { getByTestId } = render(<Probe />);
    const middle = getByTestId('item-1');
    middle.focus();

    fireEvent.keyDown(middle, { key: 'End' });
    expect(document.activeElement).toBe(getByTestId('item-2'));

    fireEvent.keyDown(getByTestId('item-2'), { key: 'Home' });
    expect(document.activeElement).toBe(getByTestId('item-0'));
  });

  it('vertical orientation responds to ArrowDown / ArrowUp', () => {
    const { getByTestId } = render(<Probe orientation="vertical" />);
    const first = getByTestId('item-0');
    first.focus();

    fireEvent.keyDown(first, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(getByTestId('item-1'));

    fireEvent.keyDown(getByTestId('item-1'), { key: 'ArrowUp' });
    expect(document.activeElement).toBe(getByTestId('item-0'));
  });
});
