import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { RelativeTime } from './RelativeTime.js';

describe('RelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-15T12:00:00Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders "5 minutes ago" for a value 5 minutes in the past', () => {
    const fiveMinAgo = new Date('2026-05-15T11:55:00Z');
    const { container } = render(<RelativeTime value={fiveMinAgo} locale="en-US" />);
    expect(container.textContent).toMatch(/5 minutes ago/);
  });

  it('renders "in 2 hours" for a future value', () => {
    const twoHoursAhead = new Date('2026-05-15T14:00:00Z');
    const { container } = render(<RelativeTime value={twoHoursAhead} locale="en-US" />);
    expect(container.textContent).toMatch(/in 2 hours/);
  });

  it('uses "yesterday" with numeric=auto', () => {
    const yesterday = new Date('2026-05-14T12:00:00Z');
    const { container } = render(<RelativeTime value={yesterday} locale="en-US" />);
    expect(container.textContent).toMatch(/yesterday/i);
  });

  it('keeps numeric phrasing with numeric=always', () => {
    const yesterday = new Date('2026-05-14T12:00:00Z');
    const { container } = render(
      <RelativeTime value={yesterday} numeric="always" locale="en-US" />,
    );
    expect(container.textContent).toMatch(/1 day ago/);
  });

  it('renders inside a <time> element with dateTime and title', () => {
    const fiveMinAgo = new Date('2026-05-15T11:55:00Z');
    const { container } = render(<RelativeTime value={fiveMinAgo} locale="en-US" />);
    const el = container.querySelector('time');
    expect(el).not.toBeNull();
    expect(el?.getAttribute('datetime')).toBe('2026-05-15T11:55:00.000Z');
    expect(el?.getAttribute('title')).toBeTruthy();
  });

  it('honors length="short"', () => {
    const fiveMinAgo = new Date('2026-05-15T11:55:00Z');
    const { container } = render(
      <RelativeTime value={fiveMinAgo} length="short" locale="en-US" />,
    );
    // "short" gives "min." vs "minutes"
    expect(container.textContent).toMatch(/min/);
    expect(container.textContent).not.toMatch(/minutes/);
  });
});
