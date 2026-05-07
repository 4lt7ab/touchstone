import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker, type DatePickerRangeValue, type DatePickerValue } from './DatePicker.js';

describe('DatePicker — single mode', () => {
  it('renders an input row plus calendar trigger', () => {
    render(<DatePicker aria-label="event date" />);
    expect(screen.getByRole('textbox', { name: 'month' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open calendar/i })).toBeInTheDocument();
  });

  it('hydrates from a timestamp value (default valueFormat)', () => {
    render(<DatePicker aria-label="event date" defaultValue="2026-05-15T00:00:00-04:00" />);
    expect(screen.getByRole('textbox', { name: 'month' })).toHaveValue('05');
    expect(screen.getByRole('textbox', { name: 'day' })).toHaveValue('15');
    expect(screen.getByRole('textbox', { name: 'year' })).toHaveValue('2026');
  });

  it('hydrates from a date-only value when valueFormat=date', () => {
    render(
      <DatePicker aria-label="event date" valueFormat="date" defaultValue="2026-05-15" />,
    );
    expect(screen.getByRole('textbox', { name: 'day' })).toHaveValue('15');
  });

  it('emits a timestamp with offset when typed', async () => {
    const onChange = vi.fn();
    render(
      <DatePicker
        aria-label="event date"
        valueFormat="timestamp"
        timeZone="America/New_York"
        onChange={onChange}
      />,
    );
    await userEvent.type(screen.getByRole('textbox', { name: 'month' }), '05');
    await userEvent.type(screen.getByRole('textbox', { name: 'day' }), '15');
    await userEvent.type(screen.getByRole('textbox', { name: 'year' }), '2026');
    const last = onChange.mock.calls.at(-1)?.[0];
    expect(last).toMatch(/^2026-05-15T00:00:00[+-]\d{2}:\d{2}$/);
    expect(last).toMatch(/-04:00$/); // EDT in May
  });

  it('emits a date-only string when valueFormat=date', async () => {
    const onChange = vi.fn();
    render(
      <DatePicker aria-label="event date" valueFormat="date" onChange={onChange} />,
    );
    await userEvent.type(screen.getByRole('textbox', { name: 'month' }), '05');
    await userEvent.type(screen.getByRole('textbox', { name: 'day' }), '15');
    await userEvent.type(screen.getByRole('textbox', { name: 'year' }), '2026');
    expect(onChange).toHaveBeenLastCalledWith('2026-05-15');
  });

  it('opens the calendar popover when the trigger is clicked', async () => {
    render(<DatePicker aria-label="event date" defaultValue="2026-05-15T00:00:00-04:00" />);
    await userEvent.click(screen.getByRole('button', { name: /open calendar/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('selecting a calendar day commits a timestamp and closes the popover', async () => {
    function Harness(): React.JSX.Element {
      const [value, setValue] = useState<string | null>('2026-05-15T00:00:00-04:00');
      return (
        <DatePicker
          aria-label="event date"
          timeZone="America/New_York"
          value={value}
          onChange={(v) => setValue(typeof v === 'string' ? v : null)}
        />
      );
    }
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: /open calendar/i }));
    const day20 = screen.getByRole('button', { name: /May 20, 2026/ });
    await userEvent.click(day20);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'day' })).toHaveValue('20');
  });

  it('hidden input carries the timestamp when name is set', () => {
    const { container } = render(
      <DatePicker
        aria-label="event date"
        name="event_date"
        timeZone="America/New_York"
        defaultValue="2026-05-15T00:00:00-04:00"
      />,
    );
    const hidden = container.querySelector('input[type="hidden"][name="event_date"]') as HTMLInputElement | null;
    expect(hidden?.value).toMatch(/^2026-05-15T00:00:00-04:00$/);
  });
});

describe('DatePicker — includeTime', () => {
  it('renders a time input alongside the date input', () => {
    render(<DatePicker aria-label="event" includeTime defaultValue="2026-05-15T14:30:00-04:00" />);
    expect(screen.getByRole('group', { name: 'time' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'hour' })).toHaveValue('14');
    expect(screen.getByRole('textbox', { name: 'minute' })).toHaveValue('30');
  });

  it('hydrates time from the timestamp value', () => {
    render(
      <DatePicker
        aria-label="event"
        includeTime
        timePrecision="second"
        defaultValue="2026-05-15T14:30:45-04:00"
      />,
    );
    expect(screen.getByRole('textbox', { name: 'second' })).toHaveValue('45');
  });

  it('emits a timestamp combining the date and the typed time', async () => {
    const onChange = vi.fn();
    render(
      <DatePicker
        aria-label="event"
        includeTime
        timeZone="America/New_York"
        defaultValue="2026-05-15T00:00:00-04:00"
        onChange={onChange}
      />,
    );
    const hour = screen.getByRole('textbox', { name: 'hour' });
    hour.focus();
    hour.select();
    await userEvent.keyboard('14');
    await userEvent.type(screen.getByRole('textbox', { name: 'minute' }), '30');
    const last = onChange.mock.calls.at(-1)?.[0];
    expect(last).toMatch(/^2026-05-15T14:30:00[+-]\d{2}:\d{2}$/);
  });

  it('preserves the typed time when the date is changed via the calendar', async () => {
    function Harness(): React.JSX.Element {
      const [v, setV] = useState<string | null>('2026-05-15T14:30:00-04:00');
      return (
        <DatePicker
          aria-label="event"
          includeTime
          timeZone="America/New_York"
          value={v}
          onChange={(next) => setV(typeof next === 'string' ? next : null)}
        />
      );
    }
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: /open calendar/i }));
    await userEvent.click(screen.getByRole('button', { name: /May 20, 2026/ }));
    expect(screen.getByRole('textbox', { name: 'day' })).toHaveValue('20');
    expect(screen.getByRole('textbox', { name: 'hour' })).toHaveValue('14');
    expect(screen.getByRole('textbox', { name: 'minute' })).toHaveValue('30');
  });

  it('coerces valueFormat to timestamp when includeTime is on', async () => {
    const onChange = vi.fn();
    render(
      <DatePicker
        aria-label="event"
        includeTime
        valueFormat="date"
        timeZone="America/New_York"
        defaultValue="2026-05-15T00:00:00-04:00"
        onChange={onChange}
      />,
    );
    await userEvent.type(screen.getByRole('textbox', { name: 'hour' }), '09');
    await userEvent.type(screen.getByRole('textbox', { name: 'minute' }), '15');
    const last = onChange.mock.calls.at(-1)?.[0];
    expect(last).toMatch(/^2026-05-15T09:15:00/);
  });
});

describe('DatePicker — range mode', () => {
  it('renders two inputs for start and end', () => {
    render(
      <DatePicker
        aria-label="trip"
        mode="range"
        defaultValue={{ start: '2026-05-10T00:00:00-04:00', end: '2026-05-15T00:00:00-04:00' }}
      />,
    );
    expect(screen.getByRole('group', { name: 'trip' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'start' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'end' })).toBeInTheDocument();
    const months = screen.getAllByRole('textbox', { name: 'month' });
    expect(months).toHaveLength(2);
  });

  it('selecting in the calendar fills start then end and closes', async () => {
    function Harness(): React.JSX.Element {
      const [value, setValue] = useState<DatePickerRangeValue>({ start: null, end: null });
      return (
        <DatePicker
          aria-label="trip"
          mode="range"
          timeZone="America/New_York"
          value={value}
          onChange={(v: DatePickerValue) => {
            if (v && typeof v !== 'string') setValue(v);
          }}
        />
      );
    }
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: /open calendar/i }));
    // pick two visible non-disabled days from the first calendar grid.
    const grid = screen.getAllByRole('grid')[0]!;
    const dayButtons = within(grid).getAllByRole('button').filter((b) => !b.hasAttribute('disabled'));
    expect(dayButtons.length).toBeGreaterThan(2);
    await userEvent.click(dayButtons[2]!);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // After first pick, dayButtons references may have re-rendered — refetch.
    const grid2 = screen.getAllByRole('grid')[0]!;
    const after = within(grid2).getAllByRole('button').filter((b) => !b.hasAttribute('disabled'));
    await userEvent.click(after[after.length - 1]!);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

