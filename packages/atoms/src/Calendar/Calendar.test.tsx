import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calendar, type CalendarRangeValue, type CalendarValue } from './Calendar.js';

const labelFor = (date: string): RegExp => {
  const [y, m, d] = date.split('-').map(Number);
  // matches "Wednesday, May 13, 2026" — exact weekday name doesn't matter
  const monthName = new Date(Date.UTC(y!, m! - 1, d!)).toLocaleString('en-US', {
    month: 'long',
    timeZone: 'UTC',
  });
  return new RegExp(`${monthName} ${d}, ${y}`);
};

describe('Calendar — single mode', () => {
  it('renders the month containing the value', () => {
    render(<Calendar aria-label="event date" defaultValue="2026-05-15" />);
    expect(screen.getByRole('button', { name: labelFor('2026-05-15') })).toBeInTheDocument();
  });

  it('marks the value as aria-selected', () => {
    render(<Calendar aria-label="event date" defaultValue="2026-05-15" />);
    expect(screen.getByRole('button', { name: labelFor('2026-05-15') })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('clicking a day fires onChange with the iso date', async () => {
    const onChange = vi.fn();
    render(
      <Calendar aria-label="event date" defaultValue="2026-05-15" onChange={onChange} />,
    );
    await userEvent.click(screen.getByRole('button', { name: labelFor('2026-05-20') }));
    expect(onChange).toHaveBeenLastCalledWith('2026-05-20');
  });

  it('arrow keys navigate by day, week, and across month boundaries', async () => {
    render(<Calendar aria-label="event date" defaultValue="2026-05-15" />);
    const start = screen.getByRole('button', { name: labelFor('2026-05-15') });
    start.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: labelFor('2026-05-16') }));
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: labelFor('2026-05-23') }));
    await userEvent.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: labelFor('2026-05-02') }));
  });

  it('PageDown jumps a month forward', async () => {
    render(<Calendar aria-label="event date" defaultValue="2026-05-15" />);
    screen.getByRole('button', { name: labelFor('2026-05-15') }).focus();
    await userEvent.keyboard('{PageDown}');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: labelFor('2026-06-15') }));
  });

  it('Enter selects the focused day', async () => {
    const onChange = vi.fn();
    render(
      <Calendar aria-label="event date" defaultValue="2026-05-15" onChange={onChange} />,
    );
    screen.getByRole('button', { name: labelFor('2026-05-15') }).focus();
    await userEvent.keyboard('{ArrowRight}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('2026-05-16');
  });

  it('respects min and max bounds', async () => {
    const onChange = vi.fn();
    render(
      <Calendar
        aria-label="event date"
        defaultValue="2026-05-15"
        min="2026-05-10"
        max="2026-05-20"
        onChange={onChange}
      />,
    );
    const outOfBounds = screen.getByRole('button', { name: labelFor('2026-05-09') });
    expect(outOfBounds).toBeDisabled();
    await userEvent.click(outOfBounds);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('isDateDisabled blocks selection but keeps cell present', async () => {
    const onChange = vi.fn();
    render(
      <Calendar
        aria-label="event date"
        defaultValue="2026-05-15"
        isDateDisabled={(d) => d === '2026-05-20'}
        onChange={onChange}
      />,
    );
    const blocked = screen.getByRole('button', { name: labelFor('2026-05-20') });
    expect(blocked).toBeDisabled();
    await userEvent.click(blocked);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disabled prop disables every cell and nav', () => {
    render(<Calendar aria-label="event date" defaultValue="2026-05-15" disabled />);
    expect(screen.getByRole('button', { name: labelFor('2026-05-15') })).toBeDisabled();
  });
});

describe('Calendar — range mode', () => {
  function ControlledRange({ initial }: { initial: CalendarRangeValue }): React.JSX.Element {
    const [value, setValue] = useState<CalendarRangeValue>(initial);
    return (
      <Calendar
        aria-label="trip"
        mode="range"
        value={value}
        onChange={(v: CalendarValue) => {
          if (v && typeof v !== 'string') setValue(v);
        }}
      />
    );
  }

  it('first click sets start, second click sets end', async () => {
    render(<ControlledRange initial={{ start: null, end: null }} />);
    await userEvent.click(screen.getByRole('button', { name: labelFor('2026-05-10') }));
    await userEvent.click(screen.getByRole('button', { name: labelFor('2026-05-15') }));
    expect(screen.getByRole('button', { name: labelFor('2026-05-10') })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('button', { name: labelFor('2026-05-15') })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('clicking before existing start swaps start and end', async () => {
    const onChange = vi.fn();
    render(
      <Calendar
        aria-label="trip"
        mode="range"
        defaultValue={{ start: '2026-05-15', end: null }}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: labelFor('2026-05-10') }));
    expect(onChange).toHaveBeenLastCalledWith({ start: '2026-05-10', end: '2026-05-15' });
  });

  it('clicking after a complete range starts a new selection', async () => {
    const onChange = vi.fn();
    render(
      <Calendar
        aria-label="trip"
        mode="range"
        defaultValue={{ start: '2026-05-10', end: '2026-05-15' }}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: labelFor('2026-05-20') }));
    expect(onChange).toHaveBeenLastCalledWith({ start: '2026-05-20', end: null });
  });
});

describe('Calendar — view', () => {
  it('renders two months when numberOfMonths is 2', () => {
    render(
      <Calendar
        aria-label="trip"
        mode="range"
        numberOfMonths={2}
        defaultValue={{ start: '2026-05-10', end: '2026-06-05' }}
      />,
    );
    const grids = screen.getAllByRole('grid');
    expect(grids).toHaveLength(2);
  });

  it('next-month button advances the view', async () => {
    render(<Calendar aria-label="event date" defaultValue="2026-05-15" />);
    const next = screen.getByRole('button', { name: /next month/i });
    await userEvent.click(next);
    expect(screen.getByRole('button', { name: labelFor('2026-06-15') })).toBeInTheDocument();
  });

  it('weekStartsOn=1 renders Monday-leading week header', () => {
    render(<Calendar aria-label="event date" defaultValue="2026-05-15" weekStartsOn={1} />);
    const grid = screen.getByRole('grid');
    const headers = within(grid).getAllByRole('columnheader');
    expect(headers[0]?.textContent).toMatch(/mon/i);
  });
});
