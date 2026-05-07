import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Duration } from './Duration.js';

describe('Duration', () => {
  it('formats clock under one hour as MM:SS', () => {
    const { container } = render(<Duration value={(2 * 60 + 5) * 1000} />);
    expect(container.textContent).toBe('02:05');
  });

  it('formats clock with hours as H:MM:SS', () => {
    const { container } = render(<Duration value={(3600 + 23 * 60 + 4) * 1000} />);
    expect(container.textContent).toBe('1:23:04');
  });

  it('respects precision="minute" in clock format', () => {
    const { container } = render(<Duration value={(2 * 60 + 5) * 1000} precision="minute" />);
    expect(container.textContent).toBe('0:02');
  });

  it('formats short with hours, minutes, seconds', () => {
    const { container } = render(<Duration value={(3600 + 23 * 60 + 4) * 1000} format="short" />);
    expect(container.textContent).toBe('1h 23m 4s');
  });

  it('drops seconds when precision="minute" in short format', () => {
    const { container } = render(
      <Duration value={(3600 + 23 * 60 + 4) * 1000} format="short" precision="minute" />,
    );
    expect(container.textContent).toBe('1h 23m');
  });

  it('renders zero gracefully', () => {
    const { container } = render(<Duration value={0} />);
    expect(container.textContent).toBe('00:00');
  });

  it('handles unit="seconds"', () => {
    const { container } = render(<Duration value={125} unit="seconds" />);
    expect(container.textContent).toBe('02:05');
  });

  it('prefixes negative durations with a minus sign', () => {
    const { container } = render(<Duration value={-65 * 1000} />);
    expect(container.textContent).toBe('-01:05');
  });
});
