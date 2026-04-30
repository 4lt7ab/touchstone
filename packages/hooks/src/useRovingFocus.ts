import { useCallback, useRef } from 'react';
import type { KeyboardEvent } from 'react';

export interface UseRovingFocusOptions {
  count: number;
  /**
   * Currently active item index, or `null` when no item is active. When `null`,
   * the first item gets `tabIndex=0` (entry point).
   */
  activeIndex: number | null;
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
}

export interface UseRovingFocusReturn {
  itemRef: (index: number) => (el: HTMLButtonElement | null) => void;
  onKeyDown: (index: number) => (e: KeyboardEvent<HTMLButtonElement>) => void;
  getTabIndex: (index: number) => 0 | -1;
}

/**
 * WAI-ARIA roving-tabindex for a 1D item set (tablist, toggle group, menubar).
 * Arrow keys wrap; Home / End jump to first / last. Vertical orientation
 * swaps Arrow keys.
 */
export function useRovingFocus({
  count,
  activeIndex,
  orientation = 'horizontal',
}: UseRovingFocusOptions): UseRovingFocusReturn {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const itemRef = useCallback(
    (index: number) => (el: HTMLButtonElement | null) => {
      itemRefs.current[index] = el;
    },
    [],
  );

  const onKeyDown = useCallback(
    (index: number) => (e: KeyboardEvent<HTMLButtonElement>) => {
      if (count === 0) return;
      const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
      const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';

      let nextIndex: number | null = null;
      if (e.key === nextKey) nextIndex = (index + 1) % count;
      else if (e.key === prevKey) nextIndex = (index - 1 + count) % count;
      else if (e.key === 'Home') nextIndex = 0;
      else if (e.key === 'End') nextIndex = count - 1;

      if (nextIndex !== null) {
        e.preventDefault();
        itemRefs.current[nextIndex]?.focus();
      }
    },
    [count, orientation],
  );

  const getTabIndex = useCallback(
    (index: number): 0 | -1 => {
      if (activeIndex === null) return index === 0 ? 0 : -1;
      return index === activeIndex ? 0 : -1;
    },
    [activeIndex],
  );

  return { itemRef, onKeyDown, getTabIndex };
}
