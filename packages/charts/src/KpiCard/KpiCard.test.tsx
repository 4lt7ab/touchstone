import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KpiCard } from './KpiCard.js';

describe('KpiCard', () => {
  it('renders the label and value', () => {
    render(<KpiCard label="Visitors (90d)" value="404k" />);
    expect(screen.getByText('Visitors (90d)')).toBeInTheDocument();
    expect(screen.getByText('404k')).toBeInTheDocument();
  });

  it('omits the delta badge when delta is not provided', () => {
    const { container } = render(<KpiCard label="Visitors" value="404k" />);
    expect(container.querySelectorAll('span[class]').length).toBeGreaterThan(0);
    expect(screen.queryByText(/vs prev/)).not.toBeInTheDocument();
  });

  it('renders a positive delta with default success tone and +X.X% format', () => {
    render(<KpiCard label="Visitors" value="404k" delta={{ value: 0.094 }} />);
    expect(screen.getByText(/^\+9\.4% vs prev$/)).toBeInTheDocument();
  });

  it('renders a negative delta with default danger tone and -X.X% format', () => {
    render(<KpiCard label="Bounce" value="38.2%" delta={{ value: -0.022 }} />);
    expect(screen.getByText(/^-2\.2% vs prev$/)).toBeInTheDocument();
  });

  it('treats deltas inside ±0.5% as neutral', () => {
    render(<KpiCard label="Paid" value="6%" delta={{ value: 0 }} />);
    expect(screen.getByText(/^0\.0% vs prev$/)).toBeInTheDocument();
  });

  it('honours an explicit tone override (e.g. falling bounce rate is good)', () => {
    render(<KpiCard label="Bounce" value="38.2%" delta={{ value: -0.022, tone: 'success' }} />);
    const badge = screen.getByText(/^-2\.2% vs prev$/);
    expect(badge.className).toMatch(/success/);
  });

  it('uses a custom format function when supplied', () => {
    render(
      <KpiCard
        label="Latency"
        value="320 ms"
        delta={{
          value: -12,
          format: (v) => `${v} ms`,
        }}
      />,
    );
    expect(screen.getByText(/^-12 ms vs prev$/)).toBeInTheDocument();
  });

  it('honours a custom caption', () => {
    render(<KpiCard label="Visitors" value="404k" delta={{ value: 0.094, caption: 'WoW' }} />);
    expect(screen.getByText(/^\+9\.4% WoW$/)).toBeInTheDocument();
  });

  it('renders a sparkline slot beside the value when provided', () => {
    render(
      <KpiCard label="Visitors" value="404k" sparkline={<span data-testid="spark">spark</span>} />,
    );
    expect(screen.getByTestId('spark')).toBeInTheDocument();
  });
});
