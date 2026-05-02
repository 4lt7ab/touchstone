import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const avatar = recipe({
  base: {
    boxSizing: 'border-box',
    display: 'inline-grid',
    placeItems: 'center',
    flexShrink: 0,
    fontFamily: vars.font.family.sans,
    fontWeight: vars.font.weight.bold,
    lineHeight: vars.font.lineHeight.tight,
    letterSpacing: vars.letterSpacing.wide,
    overflow: 'hidden',
    textTransform: 'uppercase',
    userSelect: 'none',
  },
  variants: {
    size: {
      sm: {
        width: vars.space[6],
        height: vars.space[6],
        fontSize: vars.font.size.xs,
      },
      md: {
        width: vars.space[8],
        height: vars.space[8],
        fontSize: vars.font.size.sm,
      },
      lg: {
        width: vars.space[10],
        height: vars.space[10],
        fontSize: vars.font.size.md,
      },
    },
    shape: {
      square: { borderRadius: vars.radius.md },
      round: { borderRadius: vars.radius.full },
    },
    tone: {
      solid: {
        background: vars.color.bgSolid,
        color: vars.color.fg,
      },
      muted: {
        background: vars.color.bgMuted,
        color: vars.color.fg,
      },
      accent: {
        background: vars.color.actionPrimary,
        color: vars.color.accentFg,
      },
    },
  },
  defaultVariants: {
    size: 'md',
    shape: 'round',
    tone: 'solid',
  },
});
