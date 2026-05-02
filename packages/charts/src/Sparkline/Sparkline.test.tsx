import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sparkline } from './Sparkline.js';

const SAMPLE = [
  { label: 'a', value: 5 },
  { label: 'b', value: 8 },
  { label: 'c', value: 4 },
  { label: 'd', value: 12 },
];

describe('Sparkline', () => {
  it('renders an SVG with the supplied aria-label', () => {
    render(<Sparkline data={SAMPLE} aria-label="Visitors spark" />);
    expect(screen.getByRole('img', { name: 'Visitors spark' })).toBeInTheDocument();
  });

  it('draws one line segment per data gap', () => {
    render(<Sparkline data={SAMPLE} aria-label="t" />);
    const svg = screen.getByRole('img', { name: 't' });
    const linePath = svg.querySelector('path[fill="none"]');
    const d = linePath?.getAttribute('d') ?? '';
    expect(d.match(/M\s+/g)).toHaveLength(1);
    expect(d.match(/L\s+/g)).toHaveLength(SAMPLE.length - 1);
  });

  it('draws no axis row (sparkline is glyph-only)', () => {
    render(<Sparkline data={SAMPLE} aria-label="t" />);
    expect(screen.queryByText('a')).not.toBeInTheDocument();
    expect(screen.queryByText(/high/)).not.toBeInTheDocument();
  });

  it('omits the gradient fill when fill=false', () => {
    const { container } = render(<Sparkline data={SAMPLE} aria-label="t" fill={false} />);
    expect(container.querySelector('linearGradient')).toBeNull();
  });

  it('omits the endpoint dot when showEndpoint=false', () => {
    const { container } = render(<Sparkline data={SAMPLE} aria-label="t" showEndpoint={false} />);
    expect(container.querySelector('circle')).toBeNull();
  });

  it('accepts an explicit width', () => {
    render(<Sparkline data={SAMPLE} aria-label="t" width={120} data-testid="s" />);
    expect(screen.getByTestId('s').style.width).toBe('120px');
  });

  it('returns null with fewer than two data points', () => {
    const { container } = render(<Sparkline data={[{ label: 'a', value: 1 }]} aria-label="t" />);
    expect(container.firstChild).toBeNull();
  });

  it('uses a unique gradient id per instance', () => {
    render(
      <>
        <Sparkline data={SAMPLE} aria-label="first" />
        <Sparkline data={SAMPLE} aria-label="second" />
      </>,
    );
    const ids = [...document.querySelectorAll('linearGradient')].map((g) => g.id);
    expect(new Set(ids).size).toBe(2);
  });
});
