import { useCallback, useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';

export type AnchoredPositionSide = 'top' | 'right' | 'bottom' | 'left';
export type AnchoredPositionAlign = 'start' | 'center' | 'end';

export interface UseAnchoredPositionOptions {
  /** Side of the anchor the floating element renders on. @default 'bottom' */
  side?: AnchoredPositionSide;
  /** Alignment along the anchor edge. @default 'start' */
  align?: AnchoredPositionAlign;
  /** Gap (in px) between the anchor and the floating element. @default 8 */
  offset?: number;
  /** Whether to compute and listen at all. Disable while the surface is closed. @default true */
  enabled?: boolean;
}

export interface UseAnchoredPositionReturn {
  /** Inline style to spread onto the floating element. */
  style: {
    position: 'fixed';
    top: number;
    left: number;
  };
  /** Side actually used after flip-on-overflow. */
  side: AnchoredPositionSide;
}

interface Position {
  top: number;
  left: number;
  side: AnchoredPositionSide;
}

const FALLBACK: Position = { top: -9999, left: -9999, side: 'bottom' };

/**
 * Position a floating element relative to an anchor. Recomputes on scroll,
 * resize, and (when supported) on size changes of either element. Falls back
 * to the opposite side when the requested side would clip the viewport.
 *
 * The floating element should use `position: fixed` (the returned style sets
 * this) and be rendered into a portal so its stacking context isn't trapped
 * by ancestor `overflow: hidden`. Pair with `useEscapeKey` /
 * `useClickOutside` / `useFocusReturn` for the rest of the overlay contract.
 */
export function useAnchoredPosition(
  anchorRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  options: UseAnchoredPositionOptions = {},
): UseAnchoredPositionReturn {
  const { side: requestedSide = 'bottom', align = 'start', offset = 8, enabled = true } = options;

  const [pos, setPos] = useState<Position>(FALLBACK);

  const compute = useCallback((): void => {
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!anchor || !floating) return;
    const next = solve(
      anchor.getBoundingClientRect(),
      floating.getBoundingClientRect(),
      requestedSide,
      align,
      offset,
    );
    setPos((prev) =>
      prev.top === next.top && prev.left === next.left && prev.side === next.side ? prev : next,
    );
  }, [anchorRef, floatingRef, requestedSide, align, offset]);

  useLayoutEffect(() => {
    if (!enabled) return;
    compute();
    const onScroll = (): void => compute();
    const onResize = (): void => compute();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => compute());
      const anchor = anchorRef.current;
      const floating = floatingRef.current;
      if (anchor) ro.observe(anchor);
      if (floating) ro.observe(floating);
    }

    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
    };
  }, [enabled, compute, anchorRef, floatingRef]);

  return {
    style: { position: 'fixed', top: pos.top, left: pos.left },
    side: pos.side,
  };
}

function solve(
  anchor: DOMRect,
  floating: DOMRect,
  side: AnchoredPositionSide,
  align: AnchoredPositionAlign,
  offset: number,
): Position {
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : Infinity;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : Infinity;

  const tryWith = (candidate: AnchoredPositionSide): Position => {
    let top = 0;
    let left = 0;
    if (candidate === 'bottom') {
      top = anchor.bottom + offset;
      left = horizontalAlign(anchor, floating, align);
    } else if (candidate === 'top') {
      top = anchor.top - floating.height - offset;
      left = horizontalAlign(anchor, floating, align);
    } else if (candidate === 'right') {
      left = anchor.right + offset;
      top = verticalAlign(anchor, floating, align);
    } else {
      left = anchor.left - floating.width - offset;
      top = verticalAlign(anchor, floating, align);
    }
    return { top, left, side: candidate };
  };

  const overflowsAxis = (p: Position): boolean => {
    if (p.side === 'bottom') return p.top + floating.height > viewportHeight;
    if (p.side === 'top') return p.top < 0;
    if (p.side === 'right') return p.left + floating.width > viewportWidth;
    return p.left < 0;
  };

  const primary = tryWith(side);
  if (!overflowsAxis(primary)) return primary;
  return tryWith(opposite(side));
}

function horizontalAlign(anchor: DOMRect, floating: DOMRect, align: AnchoredPositionAlign): number {
  if (align === 'center') return anchor.left + anchor.width / 2 - floating.width / 2;
  if (align === 'end') return anchor.right - floating.width;
  return anchor.left;
}

function verticalAlign(anchor: DOMRect, floating: DOMRect, align: AnchoredPositionAlign): number {
  if (align === 'center') return anchor.top + anchor.height / 2 - floating.height / 2;
  if (align === 'end') return anchor.bottom - floating.height;
  return anchor.top;
}

function opposite(side: AnchoredPositionSide): AnchoredPositionSide {
  if (side === 'top') return 'bottom';
  if (side === 'bottom') return 'top';
  if (side === 'left') return 'right';
  return 'left';
}
