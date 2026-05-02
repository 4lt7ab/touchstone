import { useCallback } from 'react';
import { useControllableState } from './useControllableState.js';

export type TableSortDirection = 'asc' | 'desc';

export interface TableSortState<TKey> {
  key: TKey;
  direction: TableSortDirection;
}

export interface UseTableSortOptions<TKey> {
  /** Controlled sort state. `null` is the unsorted state. */
  sort?: TableSortState<TKey> | null;
  /** Uncontrolled initial sort state. @default null */
  defaultSort?: TableSortState<TKey> | null;
  /** Called when the active column or direction changes. */
  onSortChange?: (sort: TableSortState<TKey> | null) => void;
}

export interface UseTableSortColumnProps<TKey> {
  sortable: true;
  sortDirection: TableSortDirection | null;
  onSortChange: (next: TableSortDirection | null) => void;
  /** Carried through so callers can key off the column they spread onto. */
  'data-sort-key'?: TKey;
}

export interface UseTableSortReturn<TKey> {
  sort: TableSortState<TKey> | null;
  setSort: (next: TableSortState<TKey> | null) => void;
  /**
   * Spread onto a `Table.HeaderCell` to make it sortable. The returned
   * `sortDirection` is the current direction *for that key* (or `null`
   * when another column is active), and `onSortChange` translates the
   * cell's local cycle into the hook's column-active state.
   */
  getColumnProps: (key: TKey) => UseTableSortColumnProps<TKey>;
}

/**
 * Sort bookkeeping for a Table — owns the active `{ key, direction }` so
 * non-active columns reset to `null` automatically. The asc → desc → none
 * cycle lives on the cell; the hook only learns the resulting direction.
 */
export function useTableSort<TKey>({
  sort,
  defaultSort = null,
  onSortChange,
}: UseTableSortOptions<TKey> = {}): UseTableSortReturn<TKey> {
  const [value, setValue] = useControllableState<TableSortState<TKey> | null>({
    value: sort,
    defaultValue: defaultSort,
    onChange: onSortChange,
  });

  const setSort = useCallback((next: TableSortState<TKey> | null) => setValue(next), [setValue]);

  const getColumnProps = useCallback(
    (key: TKey): UseTableSortColumnProps<TKey> => {
      const direction = value && value.key === key ? value.direction : null;
      return {
        sortable: true,
        sortDirection: direction,
        onSortChange: (next) => {
          if (next === null) setValue(null);
          else setValue({ key, direction: next });
        },
      };
    },
    [value, setValue],
  );

  return { sort: value, setSort, getColumnProps };
}
