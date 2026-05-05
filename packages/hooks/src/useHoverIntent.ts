import { useCallback, useEffect, useRef, useState } from 'react';
import type { FocusEventHandler, PointerEventHandler } from 'react';

export interface UseHoverIntentOptions {
  /** Delay (ms) before opening on pointer enter. @default 200 */
  openDelay?: number;
  /** Delay (ms) before closing on pointer leave. @default 100 */
  closeDelay?: number;
  /** When false, the hook is inert. @default true */
  enabled?: boolean;
  /**
   * Open instantly on focus (and close on blur) for keyboard users. The
   * hover delays still gate pointer-driven open/close. @default true
   */
  respondToFocus?: boolean;
  /** Fired when the open state changes. */
  onOpenChange?: (open: boolean) => void;
}

interface HoverHandlers {
  onPointerEnter: PointerEventHandler<Element>;
  onPointerLeave: PointerEventHandler<Element>;
  onFocus: FocusEventHandler<Element>;
  onBlur: FocusEventHandler<Element>;
}

interface FloatingHandlers {
  onPointerEnter: PointerEventHandler<Element>;
  onPointerLeave: PointerEventHandler<Element>;
}

export interface UseHoverIntentReturn {
  /** Current open state. */
  open: boolean;
  /** Force open/close (e.g. close after the consumer takes an action). */
  setOpen: (open: boolean) => void;
  /** Spread onto the trigger — pointer + focus events. */
  triggerProps: HoverHandlers;
  /**
   * Spread onto the floating element — keeps the surface open while the
   * pointer is inside it (so a tooltip / popover doesn't disappear when the
   * user moves to read it).
   */
  contentProps: FloatingHandlers;
}

/**
 * Hover-with-intent for tooltips, hover cards, lazy popovers — anything that
 * should open after a deliberate hover (not a transient mouse cross) and stay
 * open while the user moves between trigger and floating surface.
 *
 * The trigger and content share an open signal: entering either cancels the
 * pending close timer; leaving either schedules one. Focus-driven users
 * bypass the delays so keyboard tooltips aren't laggy.
 *
 * Pair with `useAnchoredPosition` for placement and a portal for the
 * floating element. Pair with `useEscapeKey` if the surface should close on
 * Escape (Tooltip does).
 */
export function useHoverIntent(options: UseHoverIntentOptions = {}): UseHoverIntentReturn {
  const {
    openDelay = 200,
    closeDelay = 100,
    enabled = true,
    respondToFocus = true,
    onOpenChange,
  } = options;

  const [open, setOpenState] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  const clearTimer = useCallback((): void => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const setOpen = useCallback(
    (next: boolean): void => {
      clearTimer();
      setOpenState((prev) => {
        if (prev === next) return prev;
        onOpenChangeRef.current?.(next);
        return next;
      });
    },
    [clearTimer],
  );

  useEffect(() => clearTimer, [clearTimer]);

  useEffect(() => {
    if (!enabled && open) setOpen(false);
  }, [enabled, open, setOpen]);

  const schedule = useCallback(
    (next: boolean, delay: number): void => {
      if (!enabled) return;
      clearTimer();
      if (delay <= 0) {
        setOpen(next);
        return;
      }
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setOpen(next);
      }, delay);
    },
    [enabled, clearTimer, setOpen],
  );

  const onPointerEnter: PointerEventHandler<Element> = useCallback(
    (e) => {
      if (e.pointerType === 'touch') return;
      schedule(true, openDelay);
    },
    [openDelay, schedule],
  );

  const onPointerLeave: PointerEventHandler<Element> = useCallback(
    (e) => {
      if (e.pointerType === 'touch') return;
      schedule(false, closeDelay);
    },
    [closeDelay, schedule],
  );

  const onFocus: FocusEventHandler<Element> = useCallback(() => {
    if (!respondToFocus) return;
    setOpen(true);
  }, [respondToFocus, setOpen]);

  const onBlur: FocusEventHandler<Element> = useCallback(() => {
    if (!respondToFocus) return;
    setOpen(false);
  }, [respondToFocus, setOpen]);

  const onContentEnter: PointerEventHandler<Element> = useCallback(
    (e) => {
      if (e.pointerType === 'touch') return;
      clearTimer();
    },
    [clearTimer],
  );

  const onContentLeave: PointerEventHandler<Element> = useCallback(
    (e) => {
      if (e.pointerType === 'touch') return;
      schedule(false, closeDelay);
    },
    [closeDelay, schedule],
  );

  return {
    open,
    setOpen,
    triggerProps: { onPointerEnter, onPointerLeave, onFocus, onBlur },
    contentProps: { onPointerEnter: onContentEnter, onPointerLeave: onContentLeave },
  };
}
