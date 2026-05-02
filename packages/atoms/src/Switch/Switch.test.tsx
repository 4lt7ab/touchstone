import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './Switch.js';

describe('Switch', () => {
  it('renders as role=switch with the given label, off by default', () => {
    render(<Switch aria-label="bellows on" />);
    const sw = screen.getByRole('switch', { name: 'bellows on' });
    expect(sw).toHaveAttribute('aria-checked', 'false');
  });

  it('honors defaultChecked', () => {
    render(<Switch aria-label="bellows on" defaultChecked />);
    expect(screen.getByRole('switch', { name: 'bellows on' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('toggles on click and fires onCheckedChange', async () => {
    const onChange = vi.fn();
    render(<Switch aria-label="bellows on" onCheckedChange={onChange} />);
    const sw = screen.getByRole('switch', { name: 'bellows on' });
    await userEvent.click(sw);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(sw).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(sw);
    expect(onChange).toHaveBeenLastCalledWith(false);
    expect(sw).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles via Space (button semantics)', async () => {
    const onChange = vi.fn();
    render(<Switch aria-label="bellows on" onCheckedChange={onChange} />);
    const sw = screen.getByRole('switch', { name: 'bellows on' });
    sw.focus();
    await userEvent.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', async () => {
    const onChange = vi.fn();
    render(<Switch aria-label="bellows on" disabled onCheckedChange={onChange} />);
    await userEvent.click(screen.getByRole('switch', { name: 'bellows on' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('respects controlled value (does not flip on internal click)', async () => {
    const onChange = vi.fn();
    render(<Switch aria-label="bellows on" checked={false} onCheckedChange={onChange} />);
    const sw = screen.getByRole('switch', { name: 'bellows on' });
    await userEvent.click(sw);
    expect(onChange).toHaveBeenCalledWith(true);
    // Still false because the parent didn't update the prop.
    expect(sw).toHaveAttribute('aria-checked', 'false');
  });
});
