import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Heatmap, type HeatmapCell } from './Heatmap.js';

function grid(rows: number, cols: number, fn: (r: number, c: number) => number): HeatmapCell[][] {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({ value: fn(r, c) })),
  );
}

const SAMPLE = grid(3, 4, (r, c) => r * 10 + c);

describe('Heatmap', () => {
  it('exposes a labelled section so SR users can name the chart', () => {
    render(<Heatmap data={SAMPLE} aria-label="Activity" />);
    expect(screen.getByRole('region', { name: 'Activity' })).toBeInTheDocument();
  });

  it('renders rows × cols cells', () => {
    const { container } = render(<Heatmap data={SAMPLE} aria-label="t" />);
    const gridEl = container.querySelector('[role="img"]')!;
    const cells = [...gridEl.children].filter(
      (c) => (c as HTMLElement).style.borderRadius === '3px',
    );
    expect(cells).toHaveLength(3 * 4);
  });

  it('scales cell opacity with value (max value reaches near 1, min near floor)', () => {
    const { container } = render(<Heatmap data={SAMPLE} aria-label="t" />);
    const gridEl = container.querySelector('[role="img"]')!;
    const cells = [...gridEl.children].filter(
      (c) => (c as HTMLElement).style.borderRadius === '3px',
    ) as HTMLElement[];
    const minCellOpacity = Number(cells[0]!.style.opacity);
    const maxCellOpacity = Number(cells[cells.length - 1]!.style.opacity);
    expect(minCellOpacity).toBeLessThan(0.1);
    expect(maxCellOpacity).toBe(1);
  });

  it('uses an explicit domain when provided', () => {
    const { container } = render(
      <Heatmap data={[[{ value: 50 }]]} aria-label="t" domain={[0, 100]} />,
    );
    const cell = container.querySelector('[role="img"] > div') as HTMLElement;
    expect(Number(cell.style.opacity)).toBeGreaterThan(0.4);
    expect(Number(cell.style.opacity)).toBeLessThan(0.6);
  });

  it('writes a tooltip combining row label · column label · formatted value', () => {
    const { container } = render(
      <Heatmap
        data={[[{ value: 12 }]]}
        aria-label="t"
        rowLabels={['Mon']}
        columnLabels={['9am']}
        format={(n) => `${n} sessions`}
      />,
    );
    const cell = container.querySelector('[role="img"] [title]')!;
    expect(cell.getAttribute('title')).toBe('Mon · 9am · 12 sessions');
  });

  it('renders row labels and column labels when supplied', () => {
    render(
      <Heatmap
        data={SAMPLE}
        aria-label="t"
        rowLabels={['Mon', 'Tue', 'Wed']}
        columnLabels={['9', '10', '11', '12']}
      />,
    );
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('11')).toBeInTheDocument();
  });

  it('renders the legend by default and hides it when showLegend=false', () => {
    const { rerender, container } = render(<Heatmap data={SAMPLE} aria-label="t" />);
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
    rerender(<Heatmap data={SAMPLE} aria-label="t" showLegend={false} />);
    const ariaHidden = [...container.querySelectorAll('[aria-hidden="true"]')];
    expect(ariaHidden.length).toBe(0);
  });

  it('returns null for empty data', () => {
    const { container } = render(<Heatmap data={[]} aria-label="t" />);
    expect(container.firstChild).toBeNull();
  });
});
