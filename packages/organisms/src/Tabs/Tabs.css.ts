import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  minWidth: 0,
});

export const list = style({
  display: 'inline-flex',
  alignItems: 'stretch',
  borderBottom: `1px solid ${vars.color.border}`,
  gap: vars.space[1],
  minWidth: 0,
  overflow: 'auto',
});

export const trigger = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingInline: vars.space[3],
    paddingBlock: vars.space[2],
    border: 'none',
    background: 'transparent',
    color: vars.color.fgMuted,
    fontFamily: vars.font.family.sans,
    fontWeight: vars.font.weight.medium,
    fontSize: vars.font.size.sm,
    lineHeight: vars.font.lineHeight.tight,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    borderBottom: '2px solid transparent',
    marginBottom: '-1px',
    transition:
      `color ${vars.duration.base} ${vars.easing.standard}, ` +
      `border-color ${vars.duration.base} ${vars.easing.standard}`,
    selectors: {
      '&:hover:not(:disabled):not([aria-selected="true"])': {
        color: vars.color.fg,
      },
      '&:focus-visible': {
        outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
        outlineOffset: vars.focus.ringOffset,
      },
      '&[aria-selected="true"]': {
        color: vars.color.fg,
        borderBottomColor: vars.color.actionPrimary,
        fontWeight: vars.font.weight.semibold,
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
        height: vars.space[8],
        fontSize: vars.font.size.xs,
      },
      md: {
        height: vars.space[10],
        fontSize: vars.font.size.sm,
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const panel = style({
  outline: 'none',
  selectors: {
    '&:focus-visible': {
      outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
      outlineOffset: vars.focus.ringOffset,
      borderRadius: vars.radius.sm,
    },
  },
});
