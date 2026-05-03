import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  background: vars.color.bgInput,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.full,
  padding: vars.space[1],
});

export const segment = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingInline: vars.space[3],
    border: 'none',
    borderRadius: vars.radius.full,
    background: 'transparent',
    color: vars.color.fgMuted,
    fontFamily: vars.font.family.sans,
    fontWeight: vars.font.weight.regular,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    lineHeight: vars.font.lineHeight.tight,
    transition:
      `background-color ${vars.duration.base} ${vars.easing.standard}, ` +
      `color ${vars.duration.base} ${vars.easing.standard}`,
    selectors: {
      '&:hover:not([aria-checked="true"])': {
        color: vars.color.fg,
      },
      '&:focus-visible': {
        outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
        outlineOffset: vars.focus.ringOffset,
      },
      '&[aria-checked="true"]': {
        background: vars.color.actionPrimary,
        color: vars.color.accentFg,
        fontWeight: vars.font.weight.semibold,
      },
    },
  },
  variants: {
    size: {
      sm: {
        height: vars.space[6],
        fontSize: vars.font.size.xs,
      },
      md: {
        height: vars.space[8],
        fontSize: vars.font.size.sm,
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
