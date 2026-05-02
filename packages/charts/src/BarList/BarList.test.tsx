import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BarList } from './BarList.js';

const SOURCES = [
  { id: 'direct', name: 'Direct', value: 31 },
  { id: 'organic', name: 'Organic search', value: 28 },
  { id: 'referral', name: 'Referral', value: 14 },
];

describe('BarList', () => {
  it('renders one row per item with the item name', () => {
    render(<BarList items={SOURCES} aria-label="Top sources" />);
    expect(screen.getByText('Direct')).toBeInTheDocument();
    expect(screen.getByText('Organic search')).toBeInTheDocument();
    expect(screen.getByText('Referral')).toBeInTheDocument();
  });

  it('exposes a labelled section so SR users can name the group', () => {
    render(<BarList items={SOURCES} aria-label="Top sources" />);
    expect(screen.getByRole('region', { name: 'Top sources' })).toBeInTheDocument();
  });

  it('formats the row value through the supplied formatter', () => {
    render(<BarList items={SOURCES} aria-label="Top sources" format={(n) => `${n}%`} />);
    expect(screen.getByText('31%')).toBeInTheDocument();
    expect(screen.getByText('28%')).toBeInTheDocument();
  });

  it('normalizes bars against max(items.value) by default', () => {
    render(<BarList items={SOURCES} aria-label="Top sources" />);
    const bars = screen.getAllByRole('progressbar');
    expect(bars).toHaveLength(SOURCES.length);
    expect(bars[0]).toHaveAttribute('aria-valuenow', '100');
    const second = Number(bars[1]!.getAttribute('aria-valuenow'));
    expect(second).toBeCloseTo((28 / 31) * 100, 0);
  });

  it('uses an explicit max when provided', () => {
    render(<BarList items={SOURCES} aria-label="Top sources" max={100} />);
    const bars = screen.getAllByRole('progressbar');
    expect(bars[0]).toHaveAttribute('aria-valuenow', '31');
  });

  it('renders a delta badge when the item has one, with auto-derived tone', () => {
    render(
      <BarList
        items={[
          { name: 'Direct', value: 31, delta: { value: 0.02, caption: 'WoW' } },
          { name: 'Email', value: 9, delta: { value: -0.02, caption: 'WoW' } },
        ]}
        aria-label="Sources"
        format={(n) => `${n}%`}
      />,
    );
    expect(screen.getByText('+2.0% WoW')).toBeInTheDocument();
    expect(screen.getByText('-2.0% WoW')).toBeInTheDocument();
  });

  it('renders a description line under the name when provided', () => {
    render(
      <BarList
        items={[{ name: '/pricing', value: 9800, description: '9.8k views' }]}
        aria-label="Pages"
      />,
    );
    expect(screen.getByText('9.8k views')).toBeInTheDocument();
  });
});
