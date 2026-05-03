import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const kbd = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space[1],
    fontFamily: vars.font.family.mono,
    fontWeight: vars.font.weight.medium,
    color: vars.color.fgMuted,
    background: vars.color.bgMuted,
    border: `${vars.borderWidth.thin} solid ${vars.color.border}`,
    borderRadius: vars.radius.sm,
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    lineHeight: vars.font.lineHeight.tight,
  },
  variants: {
    size: {
      sm: {
        height: vars.space[5],
        minWidth: vars.space[5],
        paddingInline: vars.space[1],
        fontSize: vars.font.size.xs,
      },
      md: {
        height: vars.space[6],
        minWidth: vars.space[6],
        paddingInline: vars.space[2],
        fontSize: vars.font.size.sm,
      },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});
