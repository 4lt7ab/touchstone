import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Fire `handler` on a `mousedown` outside the referenced element. The listener
 * attaches only while `enabled` is true, so popovers pay no global-listener
 * cost while closed.
 *
 * Listener kind is `mousedown` (not `click`) so the outside press dismisses
 * the surface before focus / selection side-effects run on mouseup. Consumers
 * rely on close-on-press, not close-on-release.
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: (event: MouseEvent) => void,
  enabled: boolean,
): void {
  useEffect(() => {
    if (!enabled) return;
    function onMouseDown(event: MouseEvent): void {
      const el = ref.current;
      if (el && !el.contains(event.target as Node)) handler(event);
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [ref, handler, enabled]);
}
