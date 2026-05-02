import { useCallback, useMemo } from 'react';
import { useControllableState } from './useControllableState.js';

export interface UseTableSelectionOptions<TId> {
  /**
   * Identifiers for every row in the current view. Drives `toggleAll` and
   * the tri-state (`allSelected` / `someSelected`) the SelectAllCell renders
   * as `indeterminate`.
   */
  rowIds: ReadonlyArray<TId>;
  /** Controlled selection. */
  selectedIds?: TId[];
  /** Uncontrolled initial selection. */
  defaultSelectedIds?: TId[];
  /** Called whenever the selection changes — controlled or not. */
  onSelectionChange?: (selectedIds: TId[]) => void;
}

export interface UseTableSelectionReturn<TId> {
  /** Currently selected ids, in insertion order. */
  selectedIds: TId[];
  isSelected: (id: TId) => boolean;
  /** Flip the selection state of one row. */
  toggle: (id: TId) => void;
  /**
   * If every row in the current view is selected, deselect them; otherwise
   * select every row in the current view. Rows outside `rowIds` are not
   * touched, so the hook composes with paginated / filtered views.
   */
  toggleAll: () => void;
  clear: () => void;
  /** Every id in `rowIds` is selected. */
  allSelected: boolean;
  /** At least one but not every id in `rowIds` is selected. */
  someSelected: boolean;
}

/**
 * Selection bookkeeping for a Table — owns the set of selected row ids and
 * derives the state SelectCell / SelectAllCell consume. Pass a stable id per
 * row (e.g. `row.id`); the hook makes no assumption about row shape.
 */
export function useTableSelection<TId>({
  rowIds,
  selectedIds,
  defaultSelectedIds,
  onSelectionChange,
}: UseTableSelectionOptions<TId>): UseTableSelectionReturn<TId> {
  const [value, setValue] = useControllableState<TId[]>({
    value: selectedIds,
    defaultValue: defaultSelectedIds ?? [],
    onChange: onSelectionChange,
  });

  const valueSet = useMemo(() => new Set(value), [value]);

  const isSelected = useCallback((id: TId) => valueSet.has(id), [valueSet]);

  const toggle = useCallback(
    (id: TId) => {
      const next = new Set(value);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setValue(Array.from(next));
    },
    [value, setValue],
  );

  const allSelected = rowIds.length > 0 && rowIds.every((id) => valueSet.has(id));
  const someSelected = !allSelected && rowIds.some((id) => valueSet.has(id));

  const toggleAll = useCallback(() => {
    const next = new Set(value);
    const everyRowSelected = rowIds.length > 0 && rowIds.every((id) => next.has(id));
    if (everyRowSelected) {
      for (const id of rowIds) next.delete(id);
    } else {
      for (const id of rowIds) next.add(id);
    }
    setValue(Array.from(next));
  }, [rowIds, value, setValue]);

  const clear = useCallback(() => setValue([]), [setValue]);

  return {
    selectedIds: value,
    isSelected,
    toggle,
    toggleAll,
    clear,
    allSelected,
    someSelected,
  };
}
