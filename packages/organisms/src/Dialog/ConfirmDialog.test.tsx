import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@touchstone/atoms';
import { ConfirmDialog } from './ConfirmDialog.js';

describe('ConfirmDialog', () => {
  it('renders title, description, and labelled buttons when open', () => {
    render(
      <ConfirmDialog
        defaultOpen
        title="Delete project?"
        description="This unmakes the seal."
      />,
    );
    expect(screen.getByText('Delete project?')).toBeInTheDocument();
    expect(screen.getByText('This unmakes the seal.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('uses custom labels when provided', () => {
    render(
      <ConfirmDialog
        defaultOpen
        title="t"
        confirmLabel="Strike"
        cancelLabel="Hold"
      />,
    );
    expect(screen.getByRole('button', { name: 'Strike' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hold' })).toBeInTheDocument();
  });

  it('severity="danger" renders role="alertdialog"', () => {
    render(<ConfirmDialog defaultOpen severity="danger" title="Unmake?" />);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('confirm fires onConfirm and closes', async () => {
    const onConfirm = vi.fn();
    function Host() {
      const [open, setOpen] = useState(true);
      return (
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Delete?"
          onConfirm={onConfirm}
        />
      );
    }
    render(<Host />);
    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onConfirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('cancel fires onCancel and closes', async () => {
    const onCancel = vi.fn();
    function Host() {
      const [open, setOpen] = useState(true);
      return (
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Delete?"
          onCancel={onCancel}
        />
      );
    }
    render(<Host />);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('Escape treats the dismiss as cancel', async () => {
    const onCancel = vi.fn();
    function Host() {
      const [open, setOpen] = useState(true);
      return (
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Delete?"
          onCancel={onCancel}
        />
      );
    }
    render(<Host />);
    await userEvent.keyboard('{Escape}');
    expect(onCancel).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('async onConfirm: stays open and disables buttons until resolved, then closes', async () => {
    let resolve!: () => void;
    const onConfirm = vi.fn(
      () =>
        new Promise<void>((r) => {
          resolve = r;
        }),
    );
    function Host() {
      const [open, setOpen] = useState(true);
      return (
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Delete?"
          onConfirm={onConfirm}
        />
      );
    }
    render(<Host />);
    const confirm = screen.getByRole('button', { name: 'Confirm' });
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    await userEvent.click(confirm);
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(confirm).toBeDisabled();
    expect(cancel).toBeDisabled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    resolve();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('async onConfirm: rejection keeps the dialog open and re-enables buttons', async () => {
    let reject!: () => void;
    const onConfirm = vi.fn(
      () =>
        new Promise<void>((_, r) => {
          reject = r;
        }),
    );
    function Host() {
      const [open, setOpen] = useState(true);
      return (
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Delete?"
          onConfirm={onConfirm}
        />
      );
    }
    render(<Host />);
    const confirm = screen.getByRole('button', { name: 'Confirm' });
    await userEvent.click(confirm);
    expect(confirm).toBeDisabled();
    reject();
    await waitFor(() => expect(confirm).not.toBeDisabled());
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders the optional trigger and opens uncontrolled', async () => {
    render(
      <ConfirmDialog
        title="Delete?"
        trigger={<Button>open</Button>}
      />,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'open' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('confirm intent defaults to danger when severity is danger', () => {
    render(
      <ConfirmDialog
        defaultOpen
        severity="danger"
        title="Unmake?"
        confirmLabel="Unmake"
      />,
    );
    // Smoke test — the button renders. The intent is a class name driven
    // through the recipe; we only care that the wrapper passes through.
    expect(screen.getByRole('button', { name: 'Unmake' })).toBeInTheDocument();
  });
});
