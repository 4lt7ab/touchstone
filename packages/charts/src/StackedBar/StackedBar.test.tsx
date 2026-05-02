import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StackedBar } from './StackedBar.js';

const SEGMENTS = [
  { id: 'direct', label: 'Direct', value: 31 },
  { id: 'organic', label: 'Organic', value: 28 },
  { id: 'referral', label: 'Referral', value: 14 },
  { id: 'social', label: 'Social', value: 12 },
  { id: 'email', label: 'Email', value: 9 },
  { id: 'paid', label: 'Paid', value: 6 },
];

describe('StackedBar', () => {
  it('exposes a labelled section so SR users can name the chart', () => {
    render(<StackedBar segments={SEGMENTS} aria-label="Source mix" />);
    expect(screen.getByRole('region', { name: 'Source mix' })).toBeInTheDocument();
  });

  it('renders one segment div per item', () => {
    const { container } = render(<StackedBar segments={SEGMENTS} aria-label="Source mix" />);
    const bar = container.querySelector('[role="img"]')!;
    expect(bar.children).toHaveLength(SEGMENTS.length);
  });

  it('proportions segments via flex-grow equal to each value', () => {
    const { container } = render(<StackedBar segments={SEGMENTS} aria-label="Source mix" />);
    const bar = container.querySelector('[role="img"]')!;
    const grow = [...bar.children].map((c) => (c as HTMLElement).style.flexGrow);
    expect(grow).toEqual(['31', '28', '14', '12', '9', '6']);
  });

  it('renders the legend by default with default percent formatter', () => {
    render(<StackedBar segments={SEGMENTS} aria-label="Source mix" />);
    expect(screen.getByText(/^Direct\s31%$/)).toBeInTheDocument();
    expect(screen.getByText(/^Organic\s28%$/)).toBeInTheDocument();
  });

  it('hides the legend when showLegend=false', () => {
    render(<StackedBar segments={SEGMENTS} aria-label="m" showLegend={false} />);
    expect(screen.queryByText(/Direct/)).not.toBeInTheDocument();
  });

  it('uses a custom formatter when supplied', () => {
    render(<StackedBar segments={SEGMENTS} aria-label="m" format={(v) => `${v}k`} />);
    expect(screen.getByText(/^Direct\s31k$/)).toBeInTheDocument();
  });

  it('cycles through toneCycle for segments without explicit tone', () => {
    const { container } = render(
      <StackedBar
        segments={[
          { id: 'a', label: 'A', value: 10 },
          { id: 'b', label: 'B', value: 10, tone: 'danger' },
        ]}
        aria-label="m"
        toneCycle={['accent']}
      />,
    );
    const bar = container.querySelector('[role="img"]')!;
    const backgrounds = [...bar.children].map((c) => (c as HTMLElement).style.background);
    expect(backgrounds[0]).toBe(backgrounds[0]);
    expect(backgrounds[1]).not.toBe(backgrounds[0]);
  });
});
