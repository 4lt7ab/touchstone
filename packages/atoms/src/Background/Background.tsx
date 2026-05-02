import { forwardRef, useEffect, useRef } from 'react';
import { useGlowPulse, useMergedRefs } from '@touchstone/hooks';
import type { BaseComponentProps } from '../types.js';
import * as styles from './Background.css.js';
import { sceneRegistry, type BackgroundSceneFn, type BackgroundSceneName } from './scenes/index.js';

export type { BackgroundSceneFn, BackgroundSceneName } from './scenes/index.js';

/**
 * Full-bleed, fixed-position decorative background that sits behind the app
 * and optionally rides the active theme's rhythm. Renders one layer at
 * `position: fixed; inset: 0; zIndex: -1` painting `vars.color.bgPage` and
 * an optional pattern overlay drawn entirely from CSS gradients.
 *
 * `pulse` opts into the rhythm bridge: the layer's opacity follows the
 * theme's `useGlowPulse` phase, so on themes with a heartbeat
 * (`synthwaveTheme`, `terminalTheme`) the surface breathes; on light/dark
 * it stays at the resting opacity.
 *
 * `scene` opts into a kit-shipped canvas animation — `'synthwave'`,
 * `'blackhole'`, `'neural'`, `'pipboy'`, `'pacman'` — or a consumer-supplied
 * `(canvas) => () => void` function. The scene paints below the optional
 * pattern, so `<Background scene="blackhole" pattern="grid" />` composes.
 * Scenes are skipped on viewports ≤ 768px and when the user prefers
 * reduced motion.
 *
 * Decorative — `aria-hidden` is set, and `pointer-events` are off so the
 * layer never intercepts clicks.
 */
export interface BackgroundProps extends BaseComponentProps {
  /** Pattern overlay drawn on top of the page colour. @default 'none' */
  pattern?: 'none' | 'grid' | 'dots' | 'mesh';
  /** Modulate opacity through the active theme's rhythm. @default false */
  pulse?: boolean;
  /**
   * Canvas scene painted below the pattern. A string picks a kit-shipped
   * scene; a function lets the consumer plug in their own `(canvas) =>
   * cleanup`.
   */
  scene?: BackgroundSceneName | BackgroundSceneFn;
}

export const Background = forwardRef<HTMLDivElement, BackgroundProps>(function Background(
  { pattern = 'none', pulse = false, scene, id, 'data-testid': dataTestId },
  ref,
) {
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mergedRef = useMergedRefs<HTMLDivElement>(layerRef, ref);
  useGlowPulse(pulse ? layerRef : NOOP_REF);

  useEffect(() => {
    if (scene === undefined) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (typeof window === 'undefined') return;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const small = window.innerWidth <= 768;
    if (reduced || small) return;

    if (!canvas.getContext('2d')) return;

    const sceneFn: BackgroundSceneFn | undefined =
      typeof scene === 'function' ? scene : sceneRegistry[scene];
    if (!sceneFn) return;

    return sceneFn(canvas);
  }, [scene]);

  return (
    <div aria-hidden="true" id={id} data-testid={dataTestId} className={styles.root}>
      {scene !== undefined && <canvas ref={canvasRef} className={styles.canvas} />}
      <div ref={mergedRef} className={styles.layer({ pattern, pulse })} />
    </div>
  );
});

const NOOP_REF = { current: null } as const;
