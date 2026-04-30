import { useEffect } from 'react';
import type { RefObject } from 'react';
import { useThemeRhythm } from './useThemeRhythm.js';

const GLOW_VAR = '--ts-glow-strength';

/**
 * Subscribes the ref'd element to the active theme rhythm and writes the
 * current phase (0..1, already scaled by rhythm intensity) directly to a
 * `--ts-glow-strength` CSS custom property. Components that opt into a
 * glow recipe variant pick the value up via `var(--ts-glow-strength, 0)`.
 *
 * Direct DOM writes — no React re-renders per frame.
 */
export function useGlowPulse(ref: RefObject<HTMLElement | null>): void {
  const { subscribe } = useThemeRhythm();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const unsubscribe = subscribe((phase) => {
      el.style.setProperty(GLOW_VAR, String(phase));
    });
    return () => {
      unsubscribe();
      el.style.removeProperty(GLOW_VAR);
    };
  }, [subscribe, ref]);
}
