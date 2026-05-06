import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateField } from './DateField.js';

describe('DateField', () => {
  it('renders the label and connects it to the segments', () => {
    render(<DateField label="Birth date" defaultValue="2026-05-15" />);
    expect(screen.getByText('Birth date')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Birth date' })).toBeInTheDocument();
  });

  it('shows hint when no error', () => {
    render(<DateField label="Date" hint="MM / DD / YYYY" />);
    expect(screen.getByText('MM / DD / YYYY')).toBeInTheDocument();
  });

  it('replaces hint with error when both are provided', () => {
    render(
      <DateField
        label="Date"
        hint="MM / DD / YYYY"
        error="Required."
      />,
    );
    expect(screen.queryByText('MM / DD / YYYY')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Required.');
  });

  it('marks the input invalid when error is present', () => {
    render(<DateField label="Date" error="Required." defaultValue="2026-05-15" />);
    expect(screen.getByRole('group', { name: 'Date' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards onChange from the underlying DateInput', async () => {
    const onChange = vi.fn();
    render(<DateField label="Date" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'month' }), '05');
    await userEvent.type(screen.getByRole('textbox', { name: 'day' }), '15');
    await userEvent.type(screen.getByRole('textbox', { name: 'year' }), '2026');
    expect(onChange).toHaveBeenLastCalledWith('2026-05-15');
  });
});
