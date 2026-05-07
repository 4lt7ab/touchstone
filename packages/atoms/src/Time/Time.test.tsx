import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { Time } from './Time.js';

describe('Time', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-15T15:30:45Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a <time> element with a machine dateTime', () => {
    const { container } = render(
      <Time value="2026-05-15T15:30:45Z" timeZone="UTC" locale="en-US" />,
    );
    const el = container.querySelector('time');
    expect(el).not.toBeNull();
    expect(el?.getAttribute('datetime')).toBe('2026-05-15T15:30:45.000Z');
  });

  it('formats minute precision by default', () => {
    render(<Time value="2026-05-15T15:30:45Z" timeZone="UTC" locale="en-US" />);
    expect(screen.getByText(/3:30/)).toBeInTheDocument();
    expect(screen.queryByText(/45/)).not.toBeInTheDocument();
  });

  it('formats second precision when requested', () => {
    render(
      <Time
        value="2026-05-15T15:30:45Z"
        timeZone="UTC"
        precision="second"
        locale="en-US"
      />,
    );
    expect(screen.getByText(/3:30:45/)).toBeInTheDocument();
  });

  it('honors hourCycle override', () => {
    render(
      <Time
        value="2026-05-15T15:30:00Z"
        timeZone="UTC"
        locale="en-US"
        hourCycle="h23"
      />,
    );
    expect(screen.getByText(/15:30/)).toBeInTheDocument();
  });

  it('does not tick when live is false', () => {
    const { container } = render(
      <Time value="2026-05-15T15:30:00Z" timeZone="UTC" locale="en-US" />,
    );
    const before = container.querySelector('time')?.textContent;
    act(() => {
      vi.advanceTimersByTime(120_000);
    });
    const after = container.querySelector('time')?.textContent;
    expect(after).toBe(before);
  });

  it('ticks when live is true', () => {
    vi.setSystemTime(new Date('2026-05-15T15:30:00Z'));
    const { container } = render(
      <Time live precision="minute" timeZone="UTC" locale="en-US" />,
    );
    const before = container.querySelector('time')?.textContent;
    act(() => {
      vi.setSystemTime(new Date('2026-05-15T15:31:00Z'));
      vi.advanceTimersByTime(120_000);
    });
    const after = container.querySelector('time')?.textContent;
    expect(after).not.toBe(before);
  });
});
