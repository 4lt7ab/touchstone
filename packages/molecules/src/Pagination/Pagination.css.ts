import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const root = style({
  display: 'inline-block',
});

export const layout = style({
  display: 'inline-flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space[4],
});

export const pageSize = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[2],
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.sm,
  color: vars.color.fgMuted,
});

export const pageSizeLabel = style({
  whiteSpace: 'nowrap',
});

export const list = style({
  display: 'inline-flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space[1],
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

export const item = style({
  display: 'inline-flex',
});

export const ellipsis = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: vars.color.fgMuted,
    fontFamily: vars.font.family.sans,
    userSelect: 'none',
  },
  variants: {
    size: {
      sm: {
        height: vars.space[8],
        minWidth: vars.space[6],
        fontSize: vars.font.size.sm,
      },
      md: {
        height: vars.space[10],
        minWidth: vars.space[8],
        fontSize: vars.font.size.md,
      },
    },
  },
  defaultVariants: { size: 'md' },
});

export const button = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid transparent',
    borderRadius: vars.radius.md,
    background: 'transparent',
    color: vars.color.fg,
    fontFamily: vars.font.family.sans,
    fontWeight: vars.font.weight.medium,
    fontVariantNumeric: 'tabular-nums',
    cursor: 'pointer',
    transition:
      `background-color ${vars.duration.base} ${vars.easing.standard}, ` +
      `color ${vars.duration.base} ${vars.easing.standard}`,
    selectors: {
      '&:hover:not(:disabled):not([aria-current="page"])': {
        background: vars.color.bgMuted,
      },
      '&:focus-visible': {
        outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
        outlineOffset: vars.focus.ringOffset,
      },
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 0.4,
      },
      '&[aria-current="page"]': {
        background: vars.color.actionPrimary,
        color: vars.color.accentFg,
        cursor: 'default',
      },
    },
  },
  variants: {
    size: {
      sm: {
        height: vars.space[8],
        minWidth: vars.space[8],
        paddingInline: vars.space[2],
        fontSize: vars.font.size.sm,
      },
      md: {
        height: vars.space[10],
        minWidth: vars.space[10],
        paddingInline: vars.space[3],
        fontSize: vars.font.size.md,
      },
    },
  },
  defaultVariants: { size: 'md' },
});
