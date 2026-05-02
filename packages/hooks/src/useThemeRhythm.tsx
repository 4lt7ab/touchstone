import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';

export type ThemeRhythmEasing = 'sine' | 'triangle' | 'square';

export interface ThemeRhythm {
  bpm: number;
  easing: ThemeRhythmEasing;
  intensity: number;
}

type Subscriber = (phase: number) => void;

interface RhythmContextValue {
  subscribe: (cb: Subscriber) => () => void;
}

const RhythmContext = createContext<RhythmContextValue | null>(null);

const easers: Record<ThemeRhythmEasing, (t: number) => number> = {
  sine: (t) => (Math.sin(2 * Math.PI * t - Math.PI / 2) + 1) / 2,
  triangle: (t) => 1 - Math.abs(2 * t - 1),
  square: (t) => (t < 0.5 ? 1 : 0),
};

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface ThemeRhythmProviderProps {
  rhythm: ThemeRhythm | null;
  children: ReactNode;
}

export function ThemeRhythmProvider({ rhythm, children }: ThemeRhythmProviderProps) {
  const subscribersRef = useRef<Set<Subscriber>>(new Set());

  const subscribe = useCallback((cb: Subscriber) => {
    subscribersRef.current.add(cb);
    return () => {
      subscribersRef.current.delete(cb);
    };
  }, []);

  useEffect(() => {
    const subscribers = subscribersRef.current;

    // No rhythm: emit 0 so opted-in glows are invisible (and stay invisible).
    if (rhythm == null || rhythm.bpm <= 0) {
      for (const cb of subscribers) cb(0);
      return;
    }

    // Reduced motion: emit a constant mid-amplitude value, no animation.
    if (prefersReducedMotion()) {
      const constant = 0.5 * rhythm.intensity;
      for (const cb of subscribers) cb(constant);
      return;
    }

    const ease = easers[rhythm.easing];
    const periodMs = 60_000 / rhythm.bpm;
    let frame = 0;

    const tick = () => {
      const t = (performance.now() / periodMs) % 1;
      const phase = ease(t) * rhythm.intensity;
      for (const cb of subscribers) cb(phase);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [rhythm]);

  const value = useMemo<RhythmContextValue>(() => ({ subscribe }), [subscribe]);

  return <RhythmContext.Provider value={value}>{children}</RhythmContext.Provider>;
}

/**
 * Subscribe to the active theme's rhythm. Returns a no-op subscriber when
 * no `ThemeRhythmProvider` is mounted, so calling components stay safe.
 */
export function useThemeRhythm(): RhythmContextValue {
  const ctx = useContext(RhythmContext);
  if (ctx) return ctx;
  return { subscribe: () => () => {} };
}
