import { synthwaveScene } from './synthwave.js';
import { blackholeScene } from './blackhole.js';
import { neuralScene } from './neural.js';
import { pipboyScene } from './pipboy.js';
import { pacmanScene } from './pacman.js';

/**
 * A scene paints the canvas (`requestAnimationFrame` loop, `setInterval`,
 * whatever the visual demands) and returns a cleanup function that tears
 * down every timer and listener it raised. The contract matches the
 * lifecycle the `Background` atom owns — mount, paint, unmount.
 */
export type BackgroundSceneFn = (canvas: HTMLCanvasElement) => () => void;

export type BackgroundSceneName = 'synthwave' | 'blackhole' | 'neural' | 'pipboy' | 'pacman';

export const sceneRegistry: Record<BackgroundSceneName, BackgroundSceneFn> = {
  synthwave: synthwaveScene,
  blackhole: blackholeScene,
  neural: neuralScene,
  pipboy: pipboyScene,
  pacman: pacmanScene,
};

export { synthwaveScene, blackholeScene, neuralScene, pipboyScene, pacmanScene };

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function parseColor(value: string): Rgb | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0]! + hex[0]!, 16),
        g: parseInt(hex[1]! + hex[1]!, 16),
        b: parseInt(hex[2]! + hex[2]!, 16),
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
      };
    }
  }

  const rgb = trimmed.match(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/);
  if (rgb) {
    return {
      r: parseInt(rgb[1]!, 10),
      g: parseInt(rgb[2]!, 10),
      b: parseInt(rgb[3]!, 10),
    };
  }

  return null;
}

const DEFAULT_ACCENT: Rgb = { r: 167, g: 139, b: 250 };

/**
 * Resolve `--ts-scene-accent` (set on the canvas by the `Background` atom
 * from `vars.color.accent`) into an RGB triple. Scenes call this every
 * frame so a theme swap retints without remounting.
 */
export function readSceneAccent(canvas: HTMLCanvasElement): Rgb {
  const value = getComputedStyle(canvas).getPropertyValue('--ts-scene-accent');
  return parseColor(value) ?? DEFAULT_ACCENT;
}
