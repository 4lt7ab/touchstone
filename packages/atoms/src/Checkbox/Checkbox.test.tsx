import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox.js';

describe('Checkbox', () => {
  it('renders as role=checkbox with the given label, off by default', () => {
    render(<Checkbox aria-label="agree to the terms" />);
    const cb = screen.getByRole('checkbox', { name: 'agree to the terms' });
    expect(cb).toHaveAttribute('aria-checked', 'false');
  });

  it('honors defaultChecked', () => {
    render(<Checkbox aria-label="agree" defaultChecked />);
    expect(screen.getByRole('checkbox', { name: 'agree' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('toggles on click and fires onCheckedChange', async () => {
    const onChange = vi.fn();
    render(<Checkbox aria-label="agree" onCheckedChange={onChange} />);
    const cb = screen.getByRole('checkbox', { name: 'agree' });
    await userEvent.click(cb);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(cb).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(cb);
    expect(onChange).toHaveBeenLastCalledWith(false);
    expect(cb).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles via Space (button semantics)', async () => {
    const onChange = vi.fn();
    render(<Checkbox aria-label="agree" onCheckedChange={onChange} />);
    const cb = screen.getByRole('checkbox', { name: 'agree' });
    cb.focus();
    await userEvent.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('reports aria-checked="mixed" when indeterminate', () => {
    render(<Checkbox aria-label="select all" indeterminate />);
    expect(screen.getByRole('checkbox', { name: 'select all' })).toHaveAttribute(
      'aria-checked',
      'mixed',
    );
  });

  it('does not toggle when disabled', async () => {
    const onChange = vi.fn();
    render(<Checkbox aria-label="agree" disabled onCheckedChange={onChange} />);
    await userEvent.click(screen.getByRole('checkbox', { name: 'agree' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('respects controlled value (does not flip on internal click)', async () => {
    const onChange = vi.fn();
    render(
      <Checkbox aria-label="agree" checked={false} onCheckedChange={onChange} />,
    );
    const cb = screen.getByRole('checkbox', { name: 'agree' });
    await userEvent.click(cb);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(cb).toHaveAttribute('aria-checked', 'false');
  });
});
