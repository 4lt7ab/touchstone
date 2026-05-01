import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const navItem = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    width: '100%',
    gap: vars.space[2],
    paddingInline: vars.space[3],
    border: '1px solid transparent',
    borderRadius: vars.radius.md,
    background: 'transparent',
    color: vars.color.fg,
    fontFamily: vars.font.family.sans,
    fontWeight: vars.font.weight.medium,
    fontSize: vars.font.size.sm,
    lineHeight: vars.font.lineHeight.tight,
    textAlign: 'left',
    textDecoration: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
    minWidth: 0,
    transition:
      `background-color ${vars.duration.base} ${vars.easing.standard}, ` +
      `border-color ${vars.duration.base} ${vars.easing.standard}, ` +
      `color ${vars.duration.base} ${vars.easing.standard}`,
    selectors: {
      '&:hover:not(:disabled):not([aria-disabled="true"])': {
        background: vars.color.bgMuted,
      },
      '&:disabled, &[aria-disabled="true"]': {
        cursor: 'not-allowed',
        opacity: 0.55,
      },
    },
    ':focus-visible': {
      outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
      outlineOffset: vars.focus.ringOffset,
    },
  },
  variants: {
    size: {
      sm: { height: vars.space[8] },
      md: { height: vars.space[10] },
    },
    selected: {
      true: {
        background: vars.color.actionSecondary,
        color: vars.color.fg,
        fontWeight: vars.font.weight.semibold,
        selectors: {
          '&:hover:not(:disabled):not([aria-disabled="true"])': {
            background: vars.color.actionSecondaryHover,
          },
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    size: 'md',
    selected: false,
  },
});

export const iconSlot = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: vars.space[5],
  height: vars.space[5],
});

export const labelSlot = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const trailingSlot = style({
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
  marginInlineStart: vars.space[2],
});
