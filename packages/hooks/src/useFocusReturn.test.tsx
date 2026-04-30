import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { useFocusReturn } from './useFocusReturn.js';

function Trap({ active }: { active: boolean }) {
  useFocusReturn(active);
  return active ? <button data-testid="inside">inside</button> : null;
}

function Host() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button data-testid="trigger" onClick={() => setOpen(true)}>
        open
      </button>
      <button data-testid="other">other</button>
      {open ? (
        <button
          data-testid="close"
          onClick={() => setOpen(false)}
        >
          close
        </button>
      ) : null}
      <Trap active={open} />
    </>
  );
}

describe('useFocusReturn', () => {
  it('restores focus to the previously focused element when active flips off', () => {
    const { getByTestId } = render(<Host />);
    const trigger = getByTestId('trigger');
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    fireEvent.click(trigger);
    const inside = getByTestId('inside');
    inside.focus();
    expect(document.activeElement).toBe(inside);

    fireEvent.click(getByTestId('close'));
    expect(document.activeElement).toBe(trigger);
  });
});
