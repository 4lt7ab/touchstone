import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { useDisclosure } from './useDisclosure.js';

function Probe(props: Parameters<typeof useDisclosure>[0]) {
  const d = useDisclosure(props);
  return (
    <>
      <button data-testid="trigger" {...d.triggerProps}>
        toggle
      </button>
      <div data-testid="content" {...d.contentProps}>
        body
      </div>
    </>
  );
}

describe('useDisclosure', () => {
  it('uncontrolled: starts closed, opens on toggle, sets aria + hidden', () => {
    const { getByTestId } = render(<Probe />);
    const trigger = getByTestId('trigger');
    const content = getByTestId('content');

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(content.hasAttribute('hidden')).toBe(true);
    expect(trigger.getAttribute('aria-controls')).toBe(content.id);

    fireEvent.click(trigger);

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(content.hasAttribute('hidden')).toBe(false);
  });

  it('controlled: parent owns state; onOpenChange fires but internal does not flip', () => {
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Probe open={open} onOpenChange={setOpen} />
          <span data-testid="parent">{String(open)}</span>
        </>
      );
    }
    const { getByTestId } = render(<Controlled />);
    fireEvent.click(getByTestId('trigger'));
    expect(getByTestId('parent').textContent).toBe('true');
  });

  it('respects defaultOpen', () => {
    const onOpenChange = vi.fn();
    const { getByTestId } = render(
      <Probe defaultOpen={true} onOpenChange={onOpenChange} />,
    );
    expect(getByTestId('trigger').getAttribute('aria-expanded')).toBe('true');
    act(() => {
      fireEvent.click(getByTestId('trigger'));
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
