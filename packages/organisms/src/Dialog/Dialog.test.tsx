import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, Dropdown } from '@touchstone/atoms';
import { Dialog } from './Dialog.js';

describe('Dialog', () => {
  it('opens on trigger and closes via the built-in dismiss button', async () => {
    function Host() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>
            <Button>open</Button>
          </Dialog.Trigger>
          <Dialog.Content title="confirm strike" description="this unmakes the seal">
            body content
          </Dialog.Content>
        </Dialog>
      );
    }
    render(<Host />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'open' }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog.getAttribute('aria-labelledby')).toBeTruthy();
    expect(screen.getByText('confirm strike')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('Escape closes when dismissible (default)', async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog defaultOpen onOpenChange={onOpenChange}>
        <Dialog.Trigger>
          <Button>open</Button>
        </Dialog.Trigger>
        <Dialog.Content title="t" />
      </Dialog>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('Escape does not close when dismissible=false', async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog defaultOpen onOpenChange={onOpenChange}>
        <Dialog.Trigger>
          <Button>open</Button>
        </Dialog.Trigger>
        <Dialog.Content title="t" dismissible={false}>
          <Dialog.Close>
            <Button>resolve</Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('Dialog.Close (asChild via Slot) closes via injected onClick', async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog defaultOpen onOpenChange={onOpenChange}>
        <Dialog.Trigger>
          <Button>open</Button>
        </Dialog.Trigger>
        <Dialog.Content title="t">
          <Dialog.Close>
            <Button intent="secondary">cancel</Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'cancel' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('locks body scroll while open and restores it on close', async () => {
    document.body.style.overflow = 'auto';
    function Host() {
      const [open, setOpen] = useState(true);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>
            <Button>open</Button>
          </Dialog.Trigger>
          <Dialog.Content title="t" />
        </Dialog>
      );
    }
    render(<Host />);
    expect(document.body.style.overflow).toBe('hidden');
    await userEvent.click(screen.getByRole('button', { name: 'close' }));
    await waitFor(() => expect(document.body.style.overflow).toBe('auto'));
  });

  it('renders Dialog.Footer pinned outside the scrollable body', () => {
    render(
      <Dialog defaultOpen onOpenChange={() => {}}>
        <Dialog.Trigger>
          <Button>open</Button>
        </Dialog.Trigger>
        <Dialog.Content title="t">
          <p>scrolling body</p>
          <Dialog.Footer>
            <Dialog.Close>
              <Button>cancel</Button>
            </Dialog.Close>
            <Button intent="primary">confirm</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>,
    );
    expect(screen.getByText('scrolling body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'confirm' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'cancel' })).toBeInTheDocument();
  });

  it('severity="danger" renders role="alertdialog"', () => {
    render(
      <Dialog defaultOpen onOpenChange={() => {}}>
        <Dialog.Trigger>
          <Button>open</Button>
        </Dialog.Trigger>
        <Dialog.Content title="confirm strike" severity="danger">
          <Dialog.Footer>
            <Dialog.Close>
              <Button intent="danger">strike</Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>,
    );
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('mode="reader" accepts a ReactNode description and wires aria-describedby', () => {
    render(
      <Dialog defaultOpen onOpenChange={() => {}}>
        <Dialog.Trigger>
          <Button>open</Button>
        </Dialog.Trigger>
        <Dialog.Content
          mode="reader"
          title="the recipe of the dye"
          description={
            <>
              <span data-testid="byline">marked by the journeyman</span>
              <span>vat IV</span>
            </>
          }
        >
          <p>body of the scroll</p>
        </Dialog.Content>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog');
    const describedBy = dialog.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const desc = document.getElementById(describedBy ?? '');
    expect(desc).not.toBeNull();
    expect(desc?.contains(screen.getByTestId('byline'))).toBe(true);
  });

  it('selecting a Dropdown option inside a Dialog does not dismiss the Dialog', async () => {
    function Host(): React.JSX.Element {
      const [open, setOpen] = useState(true);
      const [value, setValue] = useState<string>('one');
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>
            <Button>open</Button>
          </Dialog.Trigger>
          <Dialog.Content title="pick a stamp">
            <Dropdown
              aria-label="stamp"
              value={value}
              onChange={setValue}
              options={[
                { value: 'one', label: 'one' },
                { value: 'two', label: 'two' },
              ]}
            />
          </Dialog.Content>
        </Dialog>
      );
    }
    render(<Host />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('combobox', { name: 'stamp' }));
    const option = await screen.findByRole('option', { name: 'two' });
    await userEvent.click(option);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'stamp' })).toHaveTextContent('two');
  });

  it('throws when subcomponents are used outside Dialog', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(
        <Dialog.Trigger>
          <button>x</button>
        </Dialog.Trigger>,
      ),
    ).toThrow(/<Dialog\.Trigger> must be rendered inside <Dialog>/);
    spy.mockRestore();
  });
});
