import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { useTableSelection } from './useTableSelection.js';

const ROW_IDS = ['anvil', 'tongs', 'hammer', 'crucible'] as const;
type RowId = (typeof ROW_IDS)[number];

function Probe(props: Parameters<typeof useTableSelection<RowId>>[0]) {
  const sel = useTableSelection<RowId>(props);
  return (
    <div>
      <span data-testid="selected">{sel.selectedIds.join(',')}</span>
      <span data-testid="all">{String(sel.allSelected)}</span>
      <span data-testid="some">{String(sel.someSelected)}</span>
      <button data-testid="toggle-anvil" onClick={() => sel.toggle('anvil')}>
        anvil
      </button>
      <button data-testid="toggle-hammer" onClick={() => sel.toggle('hammer')}>
        hammer
      </button>
      <button data-testid="toggle-all" onClick={sel.toggleAll}>
        all
      </button>
      <button data-testid="clear" onClick={sel.clear}>
        clear
      </button>
    </div>
  );
}

describe('useTableSelection', () => {
  it('starts empty when no defaults are given', () => {
    const { getByTestId } = render(<Probe rowIds={ROW_IDS} />);
    expect(getByTestId('selected').textContent).toBe('');
    expect(getByTestId('all').textContent).toBe('false');
    expect(getByTestId('some').textContent).toBe('false');
  });

  it('toggle flips a single id and updates someSelected', () => {
    const { getByTestId } = render(<Probe rowIds={ROW_IDS} />);
    fireEvent.click(getByTestId('toggle-anvil'));
    expect(getByTestId('selected').textContent).toBe('anvil');
    expect(getByTestId('some').textContent).toBe('true');
    expect(getByTestId('all').textContent).toBe('false');
    fireEvent.click(getByTestId('toggle-anvil'));
    expect(getByTestId('selected').textContent).toBe('');
    expect(getByTestId('some').textContent).toBe('false');
  });

  it('toggleAll selects every row, then deselects them on the next click', () => {
    const { getByTestId } = render(<Probe rowIds={ROW_IDS} />);
    fireEvent.click(getByTestId('toggle-all'));
    expect(getByTestId('all').textContent).toBe('true');
    expect(getByTestId('some').textContent).toBe('false');
    expect(getByTestId('selected').textContent?.split(',').sort()).toEqual([...ROW_IDS].sort());
    fireEvent.click(getByTestId('toggle-all'));
    expect(getByTestId('selected').textContent).toBe('');
  });

  it('toggleAll on a partial selection fills the gap rather than clearing', () => {
    const { getByTestId } = render(<Probe rowIds={ROW_IDS} />);
    fireEvent.click(getByTestId('toggle-anvil'));
    fireEvent.click(getByTestId('toggle-all'));
    expect(getByTestId('all').textContent).toBe('true');
  });

  it('clear empties the selection', () => {
    const { getByTestId } = render(<Probe rowIds={ROW_IDS} />);
    fireEvent.click(getByTestId('toggle-all'));
    fireEvent.click(getByTestId('clear'));
    expect(getByTestId('selected').textContent).toBe('');
  });

  it('controlled mode: parent owns the selectedIds; onChange fires', () => {
    const onSelectionChange = vi.fn();
    function Controlled() {
      const [ids, setIds] = useState<RowId[]>([]);
      return (
        <Probe
          rowIds={ROW_IDS}
          selectedIds={ids}
          onSelectionChange={(next) => {
            onSelectionChange(next);
            setIds(next);
          }}
        />
      );
    }
    const { getByTestId } = render(<Controlled />);
    act(() => {
      fireEvent.click(getByTestId('toggle-hammer'));
    });
    expect(onSelectionChange).toHaveBeenLastCalledWith(['hammer']);
    expect(getByTestId('selected').textContent).toBe('hammer');
  });

  it('rows outside rowIds are preserved across toggleAll', () => {
    const onSelectionChange = vi.fn();
    const { getByTestId } = render(
      <Probe
        rowIds={['anvil', 'tongs']}
        defaultSelectedIds={['hammer']}
        onSelectionChange={onSelectionChange}
      />,
    );
    fireEvent.click(getByTestId('toggle-all'));
    const selected = getByTestId('selected').textContent?.split(',').sort();
    expect(selected).toEqual(['anvil', 'hammer', 'tongs']);
  });
});
