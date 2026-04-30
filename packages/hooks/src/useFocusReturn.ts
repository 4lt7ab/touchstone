import { useEffect, useRef } from 'react';

/**
 * Capture the currently-focused element when `active` flips to true, and
 * restore focus to it when `active` flips back to false. Used together with
 * `useFocusTrap` so a dismissed overlay returns focus to whatever opened it
 * (typically the trigger button).
 *
 * The captured element is held in a ref, so it survives across renders while
 * the overlay is open. If the captured element has been unmounted by the
 * time the overlay closes, the restoration is a no-op.
 */
export function useFocusReturn(active: boolean): void {
  const previous = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    previous.current =
      typeof document !== 'undefined'
        ? (document.activeElement as HTMLElement | null)
        : null;
    return () => {
      const el = previous.current;
      previous.current = null;
      if (el && typeof el.focus === 'function' && document.contains(el)) {
        el.focus();
      }
    };
  }, [active]);
}
