import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const surface = style({
  zIndex: vars.zIndex.popover,
  background: vars.color.bgRaised,
  color: vars.color.fg,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  boxShadow: vars.shadow.md,
  padding: vars.space[1],
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.sm,
  outline: 'none',
  minWidth: '12rem',
  display: 'flex',
  flexDirection: 'column',
  selectors: {
    '&:focus-visible': {
      outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
      outlineOffset: vars.focus.ringOffset,
    },
  },
});

export const item = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    width: '100%',
    gap: vars.space[2],
    paddingInline: vars.space[3],
    paddingBlock: vars.space[2],
    border: '1px solid transparent',
    borderRadius: vars.radius.sm,
    background: 'transparent',
    color: vars.color.fg,
    fontFamily: vars.font.family.sans,
    fontWeight: vars.font.weight.medium,
    fontSize: vars.font.size.sm,
    lineHeight: vars.font.lineHeight.tight,
    textAlign: 'left',
    cursor: 'pointer',
    boxSizing: 'border-box',
    minWidth: 0,
    transition:
      `background-color ${vars.duration.base} ${vars.easing.standard}, ` +
      `color ${vars.duration.base} ${vars.easing.standard}`,
    selectors: {
      '&:hover:not(:disabled):not([aria-disabled="true"])': {
        background: vars.color.bgMuted,
      },
      '&:focus-visible': {
        outline: 'none',
        background: vars.color.bgMuted,
      },
      '&:disabled, &[aria-disabled="true"]': {
        cursor: 'not-allowed',
        opacity: 0.55,
      },
    },
  },
  variants: {
    tone: {
      default: {},
      danger: {
        color: vars.color.danger,
        selectors: {
          '&:hover:not(:disabled):not([aria-disabled="true"])': {
            background: vars.color.dangerBg,
            color: vars.color.danger,
          },
          '&:focus-visible': {
            background: vars.color.dangerBg,
            color: vars.color.danger,
          },
        },
      },
    },
  },
  defaultVariants: {
    tone: 'default',
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
  color: vars.color.fgMuted,
  fontSize: vars.font.size.xs,
});

export const separator = style({
  height: '1px',
  background: vars.color.border,
  margin: `${vars.space[1]} 0`,
  border: 'none',
});
