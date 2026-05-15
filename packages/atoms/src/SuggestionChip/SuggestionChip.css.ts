import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const iconSlot = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: vars.color.fgMuted,
});

export const chip = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space[2],
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.radius.full,
    background: vars.color.bgRaised,
    color: vars.color.fg,
    fontFamily: vars.font.family.sans,
    fontWeight: vars.font.weight.medium,
    lineHeight: vars.font.lineHeight.tight,
    textAlign: 'left',
    cursor: 'pointer',
    transition:
      `background-color ${vars.duration.base} ${vars.easing.standard}, ` +
      `border-color ${vars.duration.base} ${vars.easing.standard}, ` +
      `color ${vars.duration.base} ${vars.easing.standard}`,
    selectors: {
      '&:hover:not(:disabled)': {
        background: vars.color.actionSecondaryHover,
        borderColor: vars.color.borderFocus,
      },
      '&:focus-visible': {
        outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
        outlineOffset: vars.focus.ringOffset,
      },
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 0.55,
      },
    },
  },
  variants: {
    size: {
      sm: {
        height: vars.space[6],
        paddingInline: vars.space[3],
        fontSize: vars.font.size.xs,
      },
      md: {
        height: vars.space[8],
        paddingInline: vars.space[4],
        fontSize: vars.font.size.sm,
      },
    },
    tone: {
      neutral: {},
      accent: {
        borderColor: vars.color.accent,
        color: vars.color.accent,
      },
    },
  },
  defaultVariants: {
    size: 'md',
    tone: 'neutral',
  },
});
