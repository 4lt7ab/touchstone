import { forwardRef } from 'react';
import { useControllableState, useRovingFocus } from '@touchstone/hooks';
import type { BaseComponentProps } from '@touchstone/atoms';
import * as styles from './Pagination.css.js';

export interface PaginationProps extends BaseComponentProps {
  /** Controlled current page (1-indexed). */
  page?: number;
  /** Uncontrolled initial page. @default 1 */
  defaultPage?: number;
  /** Total page count. Pages render 1..pageCount. */
  pageCount: number;
  /** Called when the user picks a different page. */
  onPageChange?: (page: number) => void;
  /** Pages rendered on either side of the current page. @default 1 */
  siblingCount?: number;
  /** Pages pinned at each end of the list (1, 2, … N-1, N). @default 1 */
  boundaryCount?: number;
  /** Size preset. @default 'md' */
  size?: 'sm' | 'md';
  /** Disable every button in the control. */
  disabled?: boolean;
  /** Required nav landmark label. @default 'Pagination' */
  'aria-label'?: string;
}

type Item =
  | {
      type: 'button';
      kind: 'first' | 'prev' | 'page' | 'next' | 'last';
      page: number;
      label: string;
      disabled: boolean;
      current: boolean;
      content: string | number;
    }
  | { type: 'ellipsis' };

function paginationPages(
  page: number,
  pageCount: number,
  siblingCount: number,
  boundaryCount: number,
): Array<number | 'ellipsis'> {
  if (pageCount <= 0) return [];
  if (pageCount === 1) return [1];

  const pages = new Set<number>();
  for (let i = 1; i <= Math.min(boundaryCount, pageCount); i++) pages.add(i);
  for (let i = Math.max(pageCount - boundaryCount + 1, 1); i <= pageCount; i++) {
    pages.add(i);
  }
  const start = Math.max(1, page - siblingCount);
  const end = Math.min(pageCount, page + siblingCount);
  for (let i = start; i <= end; i++) pages.add(i);

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: Array<number | 'ellipsis'> = [];
  for (let i = 0; i < sorted.length; i++) {
    const cur = sorted[i]!;
    const prev = sorted[i - 1];
    if (prev !== undefined && cur - prev > 1) result.push('ellipsis');
    result.push(cur);
  }
  return result;
}

/**
 * Page navigator that owns the sliding-window math, ellipsis placement, and
 * `aria-current="page"` wiring so consumers don't reinvent them. Built from
 * the same primitives a hand-rolled version would use — `useRovingFocus`
 * for arrow-key movement across the page chips, `useControllableState` for
 * controlled/uncontrolled `page`. Visuals come through the existing button
 * tokens (`actionPrimary` for the active chip, `bgMuted` on hover).
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    page,
    defaultPage = 1,
    pageCount,
    onPageChange,
    siblingCount = 1,
    boundaryCount = 1,
    size = 'md',
    disabled = false,
    id,
    'data-testid': dataTestId,
    'aria-label': ariaLabel = 'Pagination',
  },
  ref,
) {
  const [current, setCurrent] = useControllableState<number>({
    value: page,
    defaultValue: defaultPage,
    onChange: onPageChange,
  });

  const clamped = Math.min(Math.max(current, 1), Math.max(pageCount, 1));
  const atStart = clamped <= 1;
  const atEnd = clamped >= pageCount;

  const pages = paginationPages(clamped, pageCount, siblingCount, boundaryCount);

  const items: Item[] = [];
  items.push({
    type: 'button',
    kind: 'first',
    page: 1,
    label: 'First page',
    disabled: disabled || atStart,
    current: false,
    content: '«',
  });
  items.push({
    type: 'button',
    kind: 'prev',
    page: Math.max(1, clamped - 1),
    label: 'Previous page',
    disabled: disabled || atStart,
    current: false,
    content: '‹',
  });
  for (const p of pages) {
    if (p === 'ellipsis') items.push({ type: 'ellipsis' });
    else
      items.push({
        type: 'button',
        kind: 'page',
        page: p,
        label: `Page ${p}`,
        disabled,
        current: p === clamped,
        content: p,
      });
  }
  items.push({
    type: 'button',
    kind: 'next',
    page: Math.min(pageCount, clamped + 1),
    label: 'Next page',
    disabled: disabled || atEnd,
    current: false,
    content: '›',
  });
  items.push({
    type: 'button',
    kind: 'last',
    page: pageCount,
    label: 'Last page',
    disabled: disabled || atEnd,
    current: false,
    content: '»',
  });

  const focusable = items.filter(
    (it): it is Extract<Item, { type: 'button' }> => it.type === 'button',
  );
  const activeFocusIndex = focusable.findIndex((b) => b.current);
  const { itemRef, onKeyDown, getTabIndex } = useRovingFocus({
    count: focusable.length,
    activeIndex: activeFocusIndex >= 0 ? activeFocusIndex : null,
  });

  let focusIdx = 0;

  return (
    <nav ref={ref} id={id} data-testid={dataTestId} aria-label={ariaLabel} className={styles.root}>
      <ul className={styles.list}>
        {items.map((it, i) => {
          if (it.type === 'ellipsis') {
            return (
              <li key={`ellipsis-${i}`} className={styles.item} aria-hidden="true">
                <span className={styles.ellipsis({ size })}>…</span>
              </li>
            );
          }
          const fi = focusIdx++;
          const handleClick = () => {
            if (it.disabled || it.current) return;
            setCurrent(it.page);
          };
          return (
            <li key={`${it.kind}-${i}`} className={styles.item}>
              <button
                ref={itemRef(fi)}
                type="button"
                disabled={it.disabled}
                aria-current={it.current ? 'page' : undefined}
                aria-label={it.label}
                tabIndex={getTabIndex(fi)}
                onKeyDown={onKeyDown(fi)}
                onClick={handleClick}
                className={styles.button({ size })}
              >
                {it.content}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});
