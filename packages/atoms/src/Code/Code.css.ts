import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const code = recipe({
  base: {
    fontFamily: vars.font.family.mono,
    fontSize: vars.font.size.sm,
    color: vars.color.fg,
  },
  variants: {
    block: {
      true: {
        display: 'block',
        background: 'transparent',
        padding: 0,
        borderRadius: 0,
        border: 'none',
        lineHeight: vars.font.lineHeight.relaxed,
        whiteSpace: 'pre',
      },
      false: {
        display: 'inline',
        background: vars.color.bgMuted,
        padding: `0 ${vars.space[1]}`,
        borderRadius: vars.radius.sm,
        border: `${vars.borderWidth.thin} solid ${vars.color.border}`,
      },
    },
  },
  defaultVariants: {
    block: false,
  },
});

export const pre = style({
  position: 'relative',
  background: vars.color.bgMuted,
  color: vars.color.fg,
  padding: `${vars.space[5]} ${vars.space[4]} ${vars.space[3]}`,
  borderRadius: vars.radius.md,
  border: `${vars.borderWidth.thin} solid ${vars.color.border}`,
  overflowX: 'auto',
  margin: 0,
});

export const language = style({
  position: 'absolute',
  top: vars.space[2],
  right: vars.space[3],
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.medium,
  color: vars.color.fgMuted,
  letterSpacing: vars.letterSpacing.wide,
  textTransform: 'uppercase',
  pointerEvents: 'none',
});
