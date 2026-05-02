import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar.js';

describe('ProgressBar', () => {
  it('renders with role=progressbar and the value attributes', () => {
    render(<ProgressBar value={42} aria-label="forging the rim" />);
    const bar = screen.getByRole('progressbar', { name: 'forging the rim' });
    expect(bar).toHaveAttribute('aria-valuenow', '42');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('honours custom min and max', () => {
    render(<ProgressBar value={5} min={0} max={10} aria-label="tempering" />);
    const bar = screen.getByRole('progressbar', { name: 'tempering' });
    expect(bar).toHaveAttribute('aria-valuemax', '10');
    expect(bar).toHaveAttribute('aria-valuenow', '5');
  });

  it('clamps values above max to max', () => {
    render(<ProgressBar value={150} aria-label="forging" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('clamps values below min to min', () => {
    render(<ProgressBar value={-20} aria-label="forging" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('hides from assistive tech when aria-hidden', () => {
    render(<ProgressBar value={50} aria-hidden />);
    // role still resolves so the consumer can target with a testId, but the
    // hidden attribute is set
    const bar = screen.getByRole('progressbar', { hidden: true });
    expect(bar).toHaveAttribute('aria-hidden', 'true');
  });
});
