import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from './Tooltip.js';

describe('Tooltip', () => {
  it('does not render the tip until pointer enters past openDelay', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="open the bellows" openDelay={200} closeDelay={100}>
        <button>action</button>
      </Tooltip>,
    );
    expect(screen.queryByRole('tooltip')).toBeNull();
    fireEvent.pointerEnter(screen.getByRole('button', { name: 'action' }), {
      pointerType: 'mouse',
    });
    act(() => {
      vi.advanceTimersByTime(199);
    });
    expect(screen.queryByRole('tooltip')).toBeNull();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByRole('tooltip')).toHaveTextContent('open the bellows');
    vi.useRealTimers();
  });

  it('opens immediately on focus and closes on blur', async () => {
    render(
      <Tooltip content="instant on focus">
        <button>action</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'action' });
    await userEvent.tab(); // focuses the button
    expect(trigger).toHaveFocus();
    expect(screen.getByRole('tooltip')).toHaveTextContent('instant on focus');
    await userEvent.tab();
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('wires aria-describedby on the trigger when open', async () => {
    render(
      <Tooltip content="bellows description" id="bellows-tip">
        <button>action</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'action' });
    expect(trigger).not.toHaveAttribute('aria-describedby');
    await userEvent.tab();
    expect(trigger).toHaveAttribute('aria-describedby', 'bellows-tip');
  });

  it('preserves an existing aria-describedby on the trigger and appends the tip id', async () => {
    render(
      <Tooltip content="more help" id="tip-id">
        <button aria-describedby="existing-help">action</button>
      </Tooltip>,
    );
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'action' })).toHaveAttribute(
      'aria-describedby',
      'existing-help tip-id',
    );
  });

  it('closes on Escape when open', async () => {
    render(
      <Tooltip content="close me">
        <button>action</button>
      </Tooltip>,
    );
    await userEvent.tab();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('disabled tooltip never renders the tip', async () => {
    render(
      <Tooltip content="hidden" disabled>
        <button>action</button>
      </Tooltip>,
    );
    await userEvent.tab();
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('keeps the tip open when the pointer moves into it', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="hover me" openDelay={0} closeDelay={100}>
        <button>action</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'action' });
    fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    const tip = screen.getByRole('tooltip');
    fireEvent.pointerLeave(trigger, { pointerType: 'mouse' });
    fireEvent.pointerEnter(tip, { pointerType: 'mouse' });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('fires onOpenChange when state transitions', () => {
    vi.useFakeTimers();
    const onOpenChange = vi.fn();
    render(
      <Tooltip
        content="watch me"
        openDelay={0}
        closeDelay={0}
        onOpenChange={onOpenChange}
      >
        <button>action</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'action' });
    fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(onOpenChange).toHaveBeenCalledWith(true);
    fireEvent.pointerLeave(trigger, { pointerType: 'mouse' });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    vi.useRealTimers();
  });
});
