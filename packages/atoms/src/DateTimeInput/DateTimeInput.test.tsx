import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateTimeInput } from './DateTimeInput.js';

describe('DateTimeInput', () => {
  it('renders date and time segments inside one container', () => {
    render(<DateTimeInput aria-label="event" />);
    expect(screen.getByRole('group', { name: 'event' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'month' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'hour' })).toBeInTheDocument();
  });

  it('hydrates date and time from defaultValue', () => {
    render(<DateTimeInput aria-label="event" defaultValue="2026-05-15T14:30" />);
    expect(screen.getByRole('textbox', { name: 'month' })).toHaveValue('05');
    expect(screen.getByRole('textbox', { name: 'day' })).toHaveValue('15');
    expect(screen.getByRole('textbox', { name: 'year' })).toHaveValue('2026');
    expect(screen.getByRole('textbox', { name: 'hour' })).toHaveValue('14');
    expect(screen.getByRole('textbox', { name: 'minute' })).toHaveValue('30');
  });

  it('hydrates seconds when precision matches', () => {
    render(
      <DateTimeInput
        aria-label="event"
        precision="second"
        defaultValue="2026-05-15T14:30:45"
      />,
    );
    expect(screen.getByRole('textbox', { name: 'second' })).toHaveValue('45');
  });

  it('emits a complete value once date and time are both filled', async () => {
    const onChange = vi.fn();
    render(<DateTimeInput aria-label="event" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'month' }), '05');
    await userEvent.type(screen.getByRole('textbox', { name: 'day' }), '15');
    await userEvent.type(screen.getByRole('textbox', { name: 'year' }), '2026');
    await userEvent.type(screen.getByRole('textbox', { name: 'hour' }), '14');
    await userEvent.type(screen.getByRole('textbox', { name: 'minute' }), '30');
    expect(onChange).toHaveBeenLastCalledWith('2026-05-15T14:30');
  });

  it('emits null when only one half is set', async () => {
    const onChange = vi.fn();
    render(<DateTimeInput aria-label="event" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'month' }), '05');
    await userEvent.type(screen.getByRole('textbox', { name: 'day' }), '15');
    await userEvent.type(screen.getByRole('textbox', { name: 'year' }), '2026');
    // No time entered yet — every emit so far should have been null
    expect(onChange.mock.calls.every((c) => c[0] === null)).toBe(true);
  });

  it('flags invalid when value is out of bounds', () => {
    render(
      <DateTimeInput
        aria-label="event"
        defaultValue="2026-05-15T08:00"
        min="2026-05-15T09:00"
      />,
    );
    expect(screen.getByRole('group', { name: 'event' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('hidden input carries the iso value when name is set', () => {
    const { container } = render(
      <DateTimeInput aria-label="event" name="event" defaultValue="2026-05-15T14:30" />,
    );
    const hidden = container.querySelector(
      'input[type="hidden"][name="event"]',
    ) as HTMLInputElement | null;
    expect(hidden?.value).toBe('2026-05-15T14:30');
  });

  it('disabled prop disables every segment', () => {
    render(<DateTimeInput aria-label="event" disabled defaultValue="2026-05-15T14:30" />);
    expect(screen.getByRole('textbox', { name: 'month' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'hour' })).toBeDisabled();
  });

  it('reflects external value changes', () => {
    const { rerender } = render(
      <DateTimeInput aria-label="event" value="2026-05-15T14:30" />,
    );
    expect(screen.getByRole('textbox', { name: 'hour' })).toHaveValue('14');
    rerender(<DateTimeInput aria-label="event" value="2026-05-20T09:15" />);
    expect(screen.getByRole('textbox', { name: 'day' })).toHaveValue('20');
    expect(screen.getByRole('textbox', { name: 'hour' })).toHaveValue('09');
    expect(screen.getByRole('textbox', { name: 'minute' })).toHaveValue('15');
  });
});
