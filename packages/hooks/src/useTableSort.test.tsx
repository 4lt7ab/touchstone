import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { useTableSort } from './useTableSort.js';

type Key = 'item' | 'forged' | 'price';

function Probe(props: Parameters<typeof useTableSort<Key>>[0] = {}) {
  const sort = useTableSort<Key>(props);
  const item = sort.getColumnProps('item');
  const forged = sort.getColumnProps('forged');
  return (
    <div>
      <span data-testid="state">
        {sort.sort ? `${sort.sort.key}:${sort.sort.direction}` : 'null'}
      </span>
      <span data-testid="item-direction">{String(item.sortDirection)}</span>
      <span data-testid="forged-direction">{String(forged.sortDirection)}</span>
      <button data-testid="cycle-item-asc" onClick={() => item.onSortChange('asc')}>
        cycle item asc
      </button>
      <button data-testid="cycle-forged-asc" onClick={() => forged.onSortChange('asc')}>
        cycle forged asc
      </button>
      <button data-testid="cycle-forged-desc" onClick={() => forged.onSortChange('desc')}>
        cycle forged desc
      </button>
      <button data-testid="cycle-forged-null" onClick={() => forged.onSortChange(null)}>
        cycle forged null
      </button>
    </div>
  );
}

describe('useTableSort', () => {
  it('starts unsorted when no defaultSort is given', () => {
    const { getByTestId } = render(<Probe />);
    expect(getByTestId('state').textContent).toBe('null');
    expect(getByTestId('item-direction').textContent).toBe('null');
    expect(getByTestId('forged-direction').textContent).toBe('null');
  });

  it('honors defaultSort and routes the direction to the matching column', () => {
    const { getByTestId } = render(<Probe defaultSort={{ key: 'forged', direction: 'desc' }} />);
    expect(getByTestId('state').textContent).toBe('forged:desc');
    expect(getByTestId('forged-direction').textContent).toBe('desc');
    expect(getByTestId('item-direction').textContent).toBe('null');
  });

  it('cell asc → desc → null cycle drives the active state', () => {
    const onSortChange = vi.fn();
    const { getByTestId } = render(<Probe onSortChange={onSortChange} />);
    fireEvent.click(getByTestId('cycle-forged-asc'));
    expect(getByTestId('state').textContent).toBe('forged:asc');
    fireEvent.click(getByTestId('cycle-forged-desc'));
    expect(getByTestId('state').textContent).toBe('forged:desc');
    fireEvent.click(getByTestId('cycle-forged-null'));
    expect(getByTestId('state').textContent).toBe('null');
    expect(onSortChange).toHaveBeenLastCalledWith(null);
  });

  it('switching columns resets the previous column to null', () => {
    const { getByTestId } = render(<Probe defaultSort={{ key: 'item', direction: 'asc' }} />);
    fireEvent.click(getByTestId('cycle-forged-asc'));
    expect(getByTestId('state').textContent).toBe('forged:asc');
    expect(getByTestId('item-direction').textContent).toBe('null');
    expect(getByTestId('forged-direction').textContent).toBe('asc');
  });
});
