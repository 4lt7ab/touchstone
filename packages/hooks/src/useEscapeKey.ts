import { useEffect } from 'react';

/**
 * Fire `handler` on a global Escape keydown while `enabled` is true. The
 * listener is attached on `document` so it works regardless of which element
 * holds focus inside the trapped surface.
 */
export function useEscapeKey(handler: (event: KeyboardEvent) => void, enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') handler(event);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [handler, enabled]);
}
