import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const root = style({
  position: 'fixed',
  inset: 0,
  zIndex: -1,
  pointerEvents: 'none',
  background: vars.color.bgPage,
  overflow: 'hidden',
});

export const canvas = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  vars: {
    '--ts-scene-accent': vars.color.accent,
    '--ts-scene-glow': vars.color.glow,
  },
});

export const layer = recipe({
  base: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    transition: `opacity ${vars.duration.base} ${vars.easing.standard}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  },
  variants: {
    pattern: {
      none: { display: 'none' },
      grid: {
        backgroundImage:
          `linear-gradient(to right, ${vars.color.border} 1px, transparent 1px), ` +
          `linear-gradient(to bottom, ${vars.color.border} 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
        opacity: 0.35,
      },
      dots: {
        backgroundImage: `radial-gradient(circle, ${vars.color.border} 1px, transparent 1.5px)`,
        backgroundSize: '20px 20px',
        opacity: 0.5,
      },
      mesh: {
        backgroundImage:
          `radial-gradient(at 20% 20%, ` +
          `color-mix(in srgb, ${vars.color.accent} 30%, transparent), ` +
          `transparent 50%), ` +
          `radial-gradient(at 80% 30%, ` +
          `color-mix(in srgb, ${vars.color.glow} 25%, transparent), ` +
          `transparent 55%), ` +
          `radial-gradient(at 50% 80%, ` +
          `color-mix(in srgb, ${vars.color.accent} 20%, transparent), ` +
          `transparent 60%)`,
        opacity: 0.6,
      },
    },
    pulse: {
      true: {
        opacity: `calc(0.25 + var(--ts-glow-strength, 0) * 0.6)`,
      },
      false: {},
    },
  },
  defaultVariants: {
    pattern: 'none',
    pulse: false,
  },
});
