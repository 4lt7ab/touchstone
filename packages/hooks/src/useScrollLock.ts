import { useEffect } from 'react';

let lockCount = 0;
let savedOverflow: string | null = null;
let savedPaddingRight: string | null = null;

/**
 * Lock document scroll while `enabled` is true. Reference-counted so multiple
 * concurrent locks (e.g. nested dialogs) don't restore prematurely; the
 * original `<body>` style is captured on the first lock and restored on the
 * last unlock. Compensates for the disappearing scrollbar by padding the
 * body so the page doesn't shift sideways when the lock engages.
 *
 * SSR-safe: bails out when `document` is undefined.
 */
export function useScrollLock(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;
    if (typeof document === 'undefined') return;

    if (lockCount === 0) {
      const { body } = document;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      savedOverflow = body.style.overflow;
      savedPaddingRight = body.style.paddingRight;
      body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        const current = parseFloat(getComputedStyle(body).paddingRight) || 0;
        body.style.paddingRight = `${current + scrollbarWidth}px`;
      }
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        const { body } = document;
        body.style.overflow = savedOverflow ?? '';
        body.style.paddingRight = savedPaddingRight ?? '';
        savedOverflow = null;
        savedPaddingRight = null;
      }
    };
  }, [enabled]);
}
