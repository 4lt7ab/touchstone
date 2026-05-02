import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Trendline } from './Trendline.js';

const SAMPLE = [
  { label: '2026-01-01', value: 10 },
  { label: '2026-01-02', value: 20 },
  { label: '2026-01-03', value: 15 },
  { label: '2026-01-04', value: 30 },
];

describe('Trendline', () => {
  it('renders an SVG with the supplied aria-label', () => {
    render(<Trendline data={SAMPLE} aria-label="Visitors trend" />);
    expect(screen.getByRole('img', { name: 'Visitors trend' })).toBeInTheDocument();
  });

  it('renders a path with one segment per data point', () => {
    render(<Trendline data={SAMPLE} aria-label="t" />);
    const svg = screen.getByRole('img', { name: 't' });
    const lineSegments = svg.querySelectorAll('path[fill="none"]');
    expect(lineSegments).toHaveLength(1);
    const d = lineSegments[0]!.getAttribute('d') ?? '';
    expect(d.match(/M\s+/g)).toHaveLength(1);
    expect(d.match(/L\s+/g)).toHaveLength(SAMPLE.length - 1);
  });

  it('shows the start label, end label, and high/low formatted values by default', () => {
    render(<Trendline data={SAMPLE} aria-label="t" format={(n) => `${n}k`} />);
    expect(screen.getByText('2026-01-01')).toBeInTheDocument();
    expect(screen.getByText('2026-01-04')).toBeInTheDocument();
    expect(screen.getByText(/high 30k · low 10k/)).toBeInTheDocument();
  });

  it('hides the axis row when showAxis=false', () => {
    render(<Trendline data={SAMPLE} aria-label="t" showAxis={false} />);
    expect(screen.queryByText('2026-01-01')).not.toBeInTheDocument();
    expect(screen.queryByText(/high/)).not.toBeInTheDocument();
  });

  it('returns null with fewer than two data points', () => {
    const { container } = render(<Trendline data={[{ label: 'a', value: 1 }]} aria-label="t" />);
    expect(container.firstChild).toBeNull();
  });

  it('uses a unique gradient id per instance so two charts can coexist', () => {
    render(
      <>
        <Trendline data={SAMPLE} aria-label="first" />
        <Trendline data={SAMPLE} aria-label="second" />
      </>,
    );
    const ids = [...document.querySelectorAll('linearGradient')].map((g) => g.id);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
  });

  it('renders one stroke path per series in multi-series mode', () => {
    render(
      <Trendline
        aria-label="multi"
        series={[
          { label: 'Visitors', data: SAMPLE, tone: 'accent' },
          {
            label: 'Sessions',
            data: SAMPLE.map((d) => ({ ...d, value: d.value * 1.5 })),
            tone: 'info',
          },
        ]}
      />,
    );
    const svg = screen.getByRole('img', { name: 'multi' });
    const lines = svg.querySelectorAll('path[fill="none"]');
    expect(lines).toHaveLength(2);
  });

  it('renders a legend automatically when multiple series are passed', () => {
    render(
      <Trendline
        aria-label="multi"
        series={[
          { label: 'Visitors', data: SAMPLE },
          {
            label: 'Sessions',
            data: SAMPLE.map((d) => ({ ...d, value: d.value * 1.5 })),
          },
        ]}
      />,
    );
    expect(screen.getByText('Visitors')).toBeInTheDocument();
    expect(screen.getByText('Sessions')).toBeInTheDocument();
  });

  it('omits the gradient fill on multi-series unless a series opts in', () => {
    const { container } = render(
      <Trendline
        aria-label="multi"
        series={[
          { label: 'A', data: SAMPLE },
          {
            label: 'B',
            data: SAMPLE.map((d) => ({ ...d, value: d.value * 0.6 })),
          },
        ]}
      />,
    );
    expect(container.querySelectorAll('linearGradient')).toHaveLength(0);
  });

  it('honours per-series fill=true in multi-series mode', () => {
    const { container } = render(
      <Trendline
        aria-label="multi"
        series={[
          { label: 'A', data: SAMPLE, fill: true },
          {
            label: 'B',
            data: SAMPLE.map((d) => ({ ...d, value: d.value * 0.6 })),
          },
        ]}
      />,
    );
    expect(container.querySelectorAll('linearGradient')).toHaveLength(1);
  });

  it('shares Y axis range across series — high/low spans every value', () => {
    render(
      <Trendline
        aria-label="multi"
        format={(n) => String(n)}
        series={[
          {
            label: 'A',
            data: [
              { label: 'a', value: 10 },
              { label: 'b', value: 20 },
            ],
          },
          {
            label: 'B',
            data: [
              { label: 'a', value: 30 },
              { label: 'b', value: 50 },
            ],
          },
        ]}
      />,
    );
    expect(screen.getByText(/high 50 · low 10/)).toBeInTheDocument();
  });
});
