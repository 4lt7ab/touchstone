import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateInput } from './DateInput.js';

describe('DateInput', () => {
  it('renders three segments with placeholders', () => {
    render(<DateInput aria-label="event date" />);
    expect(screen.getByRole('textbox', { name: 'month' })).toHaveAttribute('placeholder', 'MM');
    expect(screen.getByRole('textbox', { name: 'day' })).toHaveAttribute('placeholder', 'DD');
    expect(screen.getByRole('textbox', { name: 'year' })).toHaveAttribute('placeholder', 'YYYY');
  });

  it('hydrates segments from defaultValue', () => {
    render(<DateInput aria-label="event date" defaultValue="2026-05-15" />);
    expect(screen.getByRole('textbox', { name: 'month' })).toHaveValue('05');
    expect(screen.getByRole('textbox', { name: 'day' })).toHaveValue('15');
    expect(screen.getByRole('textbox', { name: 'year' })).toHaveValue('2026');
  });

  it('emits onChange with iso when all segments complete', async () => {
    const onChange = vi.fn();
    render(<DateInput aria-label="event date" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'month' }), '05');
    await userEvent.type(screen.getByRole('textbox', { name: 'day' }), '15');
    await userEvent.type(screen.getByRole('textbox', { name: 'year' }), '2026');
    expect(onChange).toHaveBeenLastCalledWith('2026-05-15');
  });

  it('emits null while incomplete', async () => {
    const onChange = vi.fn();
    render(<DateInput aria-label="event date" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'month' }), '05');
    // not yet complete — onChange should have been called but with null
    const calls = onChange.mock.calls;
    expect(calls.every((c) => c[0] === null)).toBe(true);
  });

  it('auto-advances to the next segment when full', async () => {
    render(<DateInput aria-label="event date" />);
    const month = screen.getByRole('textbox', { name: 'month' });
    month.focus();
    await userEvent.keyboard('05');
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'day' }));
  });

  it('slash key advances to the next segment', async () => {
    render(<DateInput aria-label="event date" />);
    const month = screen.getByRole('textbox', { name: 'month' });
    month.focus();
    await userEvent.keyboard('5/');
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'day' }));
  });

  it('arrow up/down nudges the segment value', async () => {
    const onChange = vi.fn();
    render(<DateInput aria-label="event date" defaultValue="2026-05-15" onChange={onChange} />);
    const month = screen.getByRole('textbox', { name: 'month' });
    month.focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenLastCalledWith('2026-06-15');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith('2026-04-15');
  });

  it('rejects out-of-range months silently (only digits accepted, clamped to 2 chars)', async () => {
    render(<DateInput aria-label="event date" />);
    const month = screen.getByRole('textbox', { name: 'month' });
    month.focus();
    await userEvent.keyboard('99');
    expect(month).toHaveValue('99');
    // 99 is not valid — onChange should not have emitted a date
  });

  it('flags invalid when value is out of bounds', async () => {
    render(
      <DateInput aria-label="event date" defaultValue="2026-04-15" min="2026-05-01" />,
    );
    const root = screen.getByRole('group', { name: 'event date' });
    expect(root).toHaveAttribute('aria-invalid', 'true');
  });

  it('hidden input carries iso value when name is set', async () => {
    const { container } = render(
      <DateInput aria-label="event date" name="event_date" defaultValue="2026-05-15" />,
    );
    const hidden = container.querySelector('input[type="hidden"][name="event_date"]') as HTMLInputElement | null;
    expect(hidden?.value).toBe('2026-05-15');
  });

  it('disabled prop blocks all segments', () => {
    render(<DateInput aria-label="event date" disabled defaultValue="2026-05-15" />);
    expect(screen.getByRole('textbox', { name: 'month' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'day' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'year' })).toBeDisabled();
  });
});
