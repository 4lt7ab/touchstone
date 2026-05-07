import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateRangeInput } from './DateRangeInput.js';

describe('DateRangeInput', () => {
  it('renders a start and end date pair under one group', () => {
    render(<DateRangeInput aria-label="trip" />);
    expect(screen.getByRole('group', { name: 'trip' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'start' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'end' })).toBeInTheDocument();
  });

  it('hydrates from defaultValue', () => {
    render(
      <DateRangeInput
        aria-label="trip"
        defaultValue={{ start: '2026-05-10', end: '2026-05-15' }}
      />,
    );
    const months = screen.getAllByRole('textbox', { name: 'month' });
    expect(months).toHaveLength(2);
    expect(months[0]).toHaveValue('05');
    expect(months[1]).toHaveValue('05');
    const days = screen.getAllByRole('textbox', { name: 'day' });
    expect(days[0]).toHaveValue('10');
    expect(days[1]).toHaveValue('15');
  });

  it('renders datetime inputs when includeTime is on', () => {
    render(
      <DateRangeInput
        aria-label="trip"
        includeTime
        defaultValue={{ start: '2026-05-10T09:00', end: '2026-05-15T17:00' }}
      />,
    );
    const hours = screen.getAllByRole('textbox', { name: 'hour' });
    expect(hours).toHaveLength(2);
    expect(hours[0]).toHaveValue('09');
    expect(hours[1]).toHaveValue('17');
  });

  it('emits onChange when the start side changes', async () => {
    const onChange = vi.fn();
    render(
      <DateRangeInput
        aria-label="trip"
        defaultValue={{ start: null, end: '2026-05-15' }}
        onChange={onChange}
      />,
    );
    const months = screen.getAllByRole('textbox', { name: 'month' });
    await userEvent.type(months[0]!, '05');
    await userEvent.type(screen.getAllByRole('textbox', { name: 'day' })[0]!, '10');
    await userEvent.type(screen.getAllByRole('textbox', { name: 'year' })[0]!, '2026');
    expect(onChange).toHaveBeenLastCalledWith({ start: '2026-05-10', end: '2026-05-15' });
  });

  it('emits onChange when the end side changes', async () => {
    const onChange = vi.fn();
    render(
      <DateRangeInput
        aria-label="trip"
        defaultValue={{ start: '2026-05-10', end: null }}
        onChange={onChange}
      />,
    );
    const months = screen.getAllByRole('textbox', { name: 'month' });
    await userEvent.type(months[1]!, '05');
    await userEvent.type(screen.getAllByRole('textbox', { name: 'day' })[1]!, '15');
    await userEvent.type(screen.getAllByRole('textbox', { name: 'year' })[1]!, '2026');
    expect(onChange).toHaveBeenLastCalledWith({ start: '2026-05-10', end: '2026-05-15' });
  });

  it('renders endAdornment inside the chrome', () => {
    render(
      <DateRangeInput
        aria-label="trip"
        endAdornment={<button type="button">Open</button>}
      />,
    );
    const trip = screen.getByRole('group', { name: 'trip' });
    expect(trip.querySelector('button')?.textContent).toBe('Open');
  });

  it('marks invalid via aria-invalid', () => {
    render(<DateRangeInput aria-label="trip" invalid />);
    expect(screen.getByRole('group', { name: 'trip' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('disables every segment when disabled', () => {
    render(
      <DateRangeInput
        aria-label="trip"
        disabled
        defaultValue={{ start: '2026-05-10', end: '2026-05-15' }}
      />,
    );
    const all = screen.getAllByRole('textbox');
    for (const el of all) expect(el).toBeDisabled();
  });
});
