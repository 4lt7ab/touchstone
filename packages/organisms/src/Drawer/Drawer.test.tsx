import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@touchstone/atoms';
import { Drawer } from './Drawer.js';

describe('Drawer', () => {
  it('opens on trigger and closes via the built-in dismiss button', async () => {
    function Host() {
      const [open, setOpen] = useState(false);
      return (
        <Drawer open={open} onOpenChange={setOpen}>
          <Drawer.Trigger>
            <Button>open</Button>
          </Drawer.Trigger>
          <Drawer.Content title="filters" description="narrow the catalogue">
            body content
          </Drawer.Content>
        </Drawer>
      );
    }
    render(<Host />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'open' }));
    const drawer = await screen.findByRole('dialog');
    expect(drawer).toHaveAttribute('aria-modal', 'true');
    expect(drawer.getAttribute('aria-labelledby')).toBeTruthy();
    expect(screen.getByText('filters')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('Escape closes by default', async () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer defaultOpen onOpenChange={onOpenChange}>
        <Drawer.Trigger>
          <Button>open</Button>
        </Drawer.Trigger>
        <Drawer.Content title="t" />
      </Drawer>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('dismissible=false suppresses Escape', async () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer defaultOpen onOpenChange={onOpenChange}>
        <Drawer.Trigger>
          <Button>open</Button>
        </Drawer.Trigger>
        <Drawer.Content title="t" dismissible={false}>
          <Drawer.Close>
            <Button>resolve</Button>
          </Drawer.Close>
        </Drawer.Content>
      </Drawer>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('Drawer.Footer renders pinned to the panel base', () => {
    render(
      <Drawer defaultOpen onOpenChange={() => {}}>
        <Drawer.Trigger>
          <Button>open</Button>
        </Drawer.Trigger>
        <Drawer.Content title="t" side="left" size="lg">
          <p>body</p>
          <Drawer.Footer>
            <Drawer.Close>
              <Button>cancel</Button>
            </Drawer.Close>
            <Button intent="primary">apply</Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>,
    );
    expect(screen.getByRole('button', { name: 'apply' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'cancel' })).toBeInTheDocument();
    expect(screen.getByText('body')).toBeInTheDocument();
  });

  it('throws when subcomponents are used outside Drawer', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(
        <Drawer.Trigger>
          <button>x</button>
        </Drawer.Trigger>,
      ),
    ).toThrow(/<Drawer\.Trigger> must be rendered inside <Drawer>/);
    spy.mockRestore();
  });
});
