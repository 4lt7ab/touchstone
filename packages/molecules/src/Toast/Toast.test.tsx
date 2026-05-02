import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster, toast } from './Toast.js';

afterEach(() => {
  act(() => {
    toast.dismissAll();
  });
});

describe('toast / Toaster', () => {
  it('renders an info toast as role="status" with polite live region', async () => {
    render(<Toaster />);
    act(() => {
      toast({ title: 'sealed', description: 'the entry is in the ledger.' });
    });
    const node = await screen.findByRole('status');
    expect(node).toHaveAccessibleName(/sealed/);
    expect(node).toHaveAttribute('aria-live', 'polite');
  });

  it('renders a danger toast as role="alert" with assertive live region', async () => {
    render(<Toaster />);
    act(() => {
      toast({ tone: 'danger', title: 'unmade', description: 'the row was rolled back.' });
    });
    const node = await screen.findByRole('alert');
    expect(node).toHaveAttribute('aria-live', 'assertive');
  });

  it('returns an id usable for programmatic dismiss', async () => {
    render(<Toaster />);
    let id = '';
    act(() => {
      id = toast({ title: 'a' });
    });
    await screen.findByRole('status');
    act(() => {
      toast.dismiss(id);
    });
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
  });

  it('dismissAll clears every visible toast', async () => {
    render(<Toaster />);
    act(() => {
      toast({ title: 'one' });
      toast({ tone: 'success', title: 'two' });
    });
    await waitFor(() => expect(screen.getAllByRole('status')).toHaveLength(2));
    act(() => {
      toast.dismissAll();
    });
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
  });

  it('auto-dismisses after the configured duration', async () => {
    vi.useFakeTimers();
    try {
      render(<Toaster />);
      act(() => {
        toast({ title: 'fast', duration: 1000 });
      });
      expect(screen.getByRole('status')).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(1100);
      });
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('does not auto-dismiss when duration is Infinity', async () => {
    vi.useFakeTimers();
    try {
      render(<Toaster />);
      act(() => {
        toast({ title: 'sticky', duration: Infinity });
      });
      act(() => {
        vi.advanceTimersByTime(60_000);
      });
      expect(screen.getByRole('status')).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('pressing Escape dismisses the newest toast', async () => {
    render(<Toaster />);
    act(() => {
      toast({ title: 'old' });
      toast({ title: 'new' });
    });
    await waitFor(() => expect(screen.getAllByRole('status')).toHaveLength(2));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      const remaining = screen.getAllByRole('status');
      expect(remaining).toHaveLength(1);
      expect(remaining[0]).toHaveAccessibleName(/old/);
    });
  });

  it('clicking the action button fires onClick and dismisses', async () => {
    const onClick = vi.fn();
    render(<Toaster />);
    act(() => {
      toast({
        title: 'unsaved',
        action: { label: 'undo', onClick },
      });
    });
    await screen.findByRole('status');
    await userEvent.click(screen.getByRole('button', { name: 'undo' }));
    expect(onClick).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
  });

  it('caps the visible stack at `max`', async () => {
    render(<Toaster max={2} />);
    act(() => {
      toast({ title: 'a' });
      toast({ title: 'b' });
      toast({ title: 'c' });
    });
    await waitFor(() => {
      const statuses = screen.getAllByRole('status');
      expect(statuses).toHaveLength(2);
      expect(statuses[0]).toHaveAccessibleName(/b/);
      expect(statuses[1]).toHaveAccessibleName(/c/);
    });
  });
});
