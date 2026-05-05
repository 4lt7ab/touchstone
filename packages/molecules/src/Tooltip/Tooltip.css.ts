import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const tooltip = recipe({
  base: {
    zIndex: vars.zIndex.popover,
    background: vars.color.bgSolid,
    color: vars.color.fgInverse,
    borderRadius: vars.radius.sm,
    paddingBlock: vars.space[1],
    paddingInline: vars.space[2],
    fontFamily: vars.font.family.sans,
    fontSize: vars.font.size.xs,
    lineHeight: vars.font.lineHeight.tight,
    boxShadow: vars.shadow.md,
    maxWidth: '20rem',
    pointerEvents: 'auto',
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  },
  variants: {
    tone: {
      default: {},
      info: {
        background: vars.color.info,
        color: vars.color.bg,
      },
      danger: {
        background: vars.color.danger,
        color: vars.color.dangerFg,
      },
    },
  },
  defaultVariants: {
    tone: 'default',
  },
});
