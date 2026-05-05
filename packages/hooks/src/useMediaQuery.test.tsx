import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery.js';

interface MockMediaQueryList {
  matches: boolean;
  media: string;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  addListener: ReturnType<typeof vi.fn>;
  removeListener: ReturnType<typeof vi.fn>;
  dispatchEvent: ReturnType<typeof vi.fn>;
  onchange: null;
}

function makeMatchMedia(initialMatches: boolean): {
  matchMedia: (q: string) => MockMediaQueryList;
  fire: (matches: boolean) => void;
  list: MockMediaQueryList;
} {
  let handler: ((e: MediaQueryListEvent) => void) | null = null;
  const list: MockMediaQueryList = {
    matches: initialMatches,
    media: '',
    addEventListener: vi.fn((_event: string, cb: (e: MediaQueryListEvent) => void) => {
      handler = cb;
    }),
    removeEventListener: vi.fn(() => {
      handler = null;
    }),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  };
  return {
    list,
    matchMedia: () => list,
    fire: (matches: boolean) => {
      list.matches = matches;
      handler?.({ matches } as MediaQueryListEvent);
    },
  };
}

describe('useMediaQuery', () => {
  let originalMatchMedia: typeof window.matchMedia | undefined;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    if (originalMatchMedia !== undefined) {
      window.matchMedia = originalMatchMedia;
    }
  });

  it('returns the initial match state', () => {
    const { matchMedia } = makeMatchMedia(true);
    window.matchMedia = matchMedia as unknown as typeof window.matchMedia;
    const { result } = renderHook(() => useMediaQuery('(max-width: 600px)'));
    expect(result.current).toBe(true);
  });

  it('returns false when the query does not match', () => {
    const { matchMedia } = makeMatchMedia(false);
    window.matchMedia = matchMedia as unknown as typeof window.matchMedia;
    const { result } = renderHook(() => useMediaQuery('(max-width: 600px)'));
    expect(result.current).toBe(false);
  });

  it('updates when the matchMedia change event fires', () => {
    const { matchMedia, fire } = makeMatchMedia(false);
    window.matchMedia = matchMedia as unknown as typeof window.matchMedia;
    const { result } = renderHook(() => useMediaQuery('(max-width: 600px)'));
    expect(result.current).toBe(false);
    act(() => {
      fire(true);
    });
    expect(result.current).toBe(true);
  });

  it('detaches the listener on unmount', () => {
    const { matchMedia, list } = makeMatchMedia(false);
    window.matchMedia = matchMedia as unknown as typeof window.matchMedia;
    const { unmount } = renderHook(() => useMediaQuery('(max-width: 600px)'));
    unmount();
    expect(list.removeEventListener).toHaveBeenCalled();
  });

  it('rebinds when the query string changes', () => {
    const a = makeMatchMedia(false);
    const queries: string[] = [];
    window.matchMedia = ((q: string) => {
      queries.push(q);
      return a.list;
    }) as unknown as typeof window.matchMedia;
    const { rerender } = renderHook(({ query }: { query: string }) => useMediaQuery(query), {
      initialProps: { query: '(max-width: 600px)' },
    });
    rerender({ query: '(min-width: 1024px)' });
    expect(queries).toContain('(max-width: 600px)');
    expect(queries).toContain('(min-width: 1024px)');
  });
});
