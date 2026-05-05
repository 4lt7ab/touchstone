import { useEffect, useState } from 'react';

/**
 * Subscribe to a CSS media query — returns `true` while the query matches
 * the current viewport, `false` otherwise. Recomputes on viewport resize
 * via `MediaQueryList.change`.
 *
 * Use for the rare bit of layout that must react in JS (e.g. swapping a
 * persistent sidebar for an overlay menu at small screens). Most
 * responsive work belongs in vanilla-extract `@media` blocks — reach for
 * this hook only when JS state has to follow the breakpoint, not when CSS
 * could express the change on its own.
 *
 * Server-safe: returns `false` during the first render when `window` is
 * unavailable, then settles in `useEffect`. Apps in this codebase are CSR
 * so the first render IS the browser render, but the guard keeps the hook
 * usable from any environment.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };
    setMatches(mql.matches);
    mql.addEventListener('change', handler);
    return () => {
      mql.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}
