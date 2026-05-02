import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@touchstone/atoms';
import { Popover } from './Popover.js';

describe('Popover', () => {
  it('opens on trigger click and renders panel content', async () => {
    function Host() {
      const [open, setOpen] = useState(false);
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger>
            <Button>filters</Button>
          </Popover.Trigger>
          <Popover.Content aria-label="filter options">inside the panel</Popover.Content>
        </Popover>
      );
    }
    render(<Host />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'filters' }));
    const panel = await screen.findByRole('dialog');
    expect(panel).toHaveAccessibleName('filter options');
    expect(panel).toHaveTextContent('inside the panel');
  });

  it('Escape closes when dismissible (default)', async () => {
    const onOpenChange = vi.fn();
    render(
      <Popover defaultOpen onOpenChange={onOpenChange}>
        <Popover.Trigger>
          <Button>open</Button>
        </Popover.Trigger>
        <Popover.Content aria-label="p">body</Popover.Content>
      </Popover>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('Escape does not close when dismissible=false', async () => {
    const onOpenChange = vi.fn();
    render(
      <Popover defaultOpen onOpenChange={onOpenChange}>
        <Popover.Trigger>
          <Button>open</Button>
        </Popover.Trigger>
        <Popover.Content aria-label="p" dismissible={false}>
          body
        </Popover.Content>
      </Popover>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('outside-click closes the panel; clicks on the trigger toggle (no flicker)', async () => {
    function Host() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Popover open={open} onOpenChange={setOpen}>
            <Popover.Trigger>
              <Button>menu</Button>
            </Popover.Trigger>
            <Popover.Content aria-label="m">body</Popover.Content>
          </Popover>
          <button>outside</button>
        </>
      );
    }
    render(<Host />);
    await userEvent.click(screen.getByRole('button', { name: 'menu' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    // Click the trigger again — should toggle closed (single state change, no flicker reopen).
    await userEvent.click(screen.getByRole('button', { name: 'menu' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    // Open again, then click outside — should close.
    await userEvent.click(screen.getByRole('button', { name: 'menu' }));
    await screen.findByRole('dialog');
    await userEvent.click(screen.getByRole('button', { name: 'outside' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('throws when subcomponents are used outside Popover', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(
        <Popover.Trigger>
          <button>x</button>
        </Popover.Trigger>,
      ),
    ).toThrow(/<Popover\.Trigger> must be rendered inside <Popover>/);
    spy.mockRestore();
  });
});
