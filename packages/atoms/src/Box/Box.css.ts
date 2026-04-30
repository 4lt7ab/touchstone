import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const box = recipe({
  base: {
    boxSizing: 'border-box',
    minWidth: 0,
  },
  variants: {
    padding: {
      none: { padding: vars.space[0] },
      sm: { padding: vars.space[2] },
      md: { padding: vars.space[4] },
      lg: { padding: vars.space[6] },
    },
    radius: {
      none: { borderRadius: vars.radius.none },
      sm: { borderRadius: vars.radius.sm },
      md: { borderRadius: vars.radius.md },
      lg: { borderRadius: vars.radius.lg },
      full: { borderRadius: vars.radius.full },
    },
    surface: {
      none: {},
      base: { background: vars.color.bg },
      raised: { background: vars.color.bgRaised },
      muted: { background: vars.color.bgMuted },
    },
    glow: {
      none: {},
      soft: { boxShadow: vars.shadow.md },
      pulse: {
        boxShadow:
          `0 0 calc(var(--ts-glow-strength, 0) * 16px) ` +
          `calc(var(--ts-glow-strength, 0) * 2px) ` +
          `color-mix(in srgb, ${vars.color.glow} ` +
          `calc(var(--ts-glow-strength, 0) * 70%), transparent)`,
      },
    },
  },
  defaultVariants: {
    padding: 'none',
    radius: 'none',
    surface: 'none',
    glow: 'none',
  },
});
