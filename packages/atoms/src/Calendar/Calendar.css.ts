import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const root = style({
  display: 'inline-flex',
  flexDirection: 'column',
  gap: vars.space[3],
  padding: vars.space[3],
  background: vars.color.bgPanel,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  color: vars.color.fg,
  fontFamily: vars.font.family.sans,
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[2],
  paddingInline: vars.space[1],
});

export const headerLabel = style({
  flex: 1,
  textAlign: 'center',
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.medium,
  color: vars.color.fg,
});

export const navButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: vars.space[8],
  height: vars.space[8],
  padding: 0,
  background: 'transparent',
  border: 'none',
  borderRadius: vars.radius.md,
  color: vars.color.fgSecondary,
  cursor: 'pointer',
  transition: `background-color ${vars.duration.fast} ${vars.easing.standard}, color ${vars.duration.fast} ${vars.easing.standard}`,
  selectors: {
    '&:hover:not(:disabled)': {
      background: vars.color.bgMuted,
      color: vars.color.fg,
    },
    '&:focus-visible': {
      outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
      outlineOffset: vars.focus.ringOffset,
    },
    '&:disabled': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  },
});

export const months = style({
  display: 'flex',
  gap: vars.space[5],
  alignItems: 'flex-start',
});

export const monthBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
});

export const monthLabel = style({
  textAlign: 'center',
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  color: vars.color.fgSecondary,
});

export const monthLabelHidden = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
});

export const grid = style({
  borderCollapse: 'separate',
  borderSpacing: 0,
});

export const weekdayRow = style({});

export const weekdayCell = style({
  width: vars.space[8],
  height: vars.space[6],
  paddingBlock: vars.space[1],
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.medium,
  color: vars.color.fgMuted,
  textAlign: 'center',
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.wide,
});

export const dayCell = style({
  padding: 0,
});

export const day = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: vars.space[8],
    height: vars.space[8],
    margin: 0,
    padding: 0,
    background: 'transparent',
    border: 'none',
    borderRadius: vars.radius.md,
    fontFamily: 'inherit',
    fontSize: vars.font.size.sm,
    fontVariantNumeric: 'tabular-nums',
    color: vars.color.fg,
    cursor: 'pointer',
    transition: `background-color ${vars.duration.fast} ${vars.easing.standard}, color ${vars.duration.fast} ${vars.easing.standard}`,
    selectors: {
      '&:focus-visible': {
        outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
        outlineOffset: vars.focus.ringOffset,
      },
    },
  },
  variants: {
    state: {
      idle: {
        selectors: {
          '&:hover:not(:disabled)': {
            background: vars.color.bgMuted,
          },
        },
      },
      inRange: {
        background: `color-mix(in srgb, ${vars.color.actionPrimary} 18%, transparent)`,
        borderRadius: 0,
        selectors: {
          '&:hover:not(:disabled)': {
            background: `color-mix(in srgb, ${vars.color.actionPrimary} 28%, transparent)`,
          },
        },
      },
      selected: {
        background: vars.color.actionPrimary,
        color: vars.color.accentFg,
        fontWeight: vars.font.weight.medium,
        selectors: {
          '&:hover:not(:disabled)': {
            background: vars.color.actionPrimaryHover,
          },
        },
      },
      disabled: {
        color: vars.color.fgDisabled,
        cursor: 'not-allowed',
        selectors: {
          '&:hover': {
            background: 'transparent',
          },
        },
      },
    },
    today: {
      true: {
        boxShadow: `inset 0 0 0 1px ${vars.color.accent}`,
      },
    },
    outsideMonth: {
      true: {
        color: vars.color.fgMuted,
        opacity: 0.55,
      },
    },
    rangeEdge: {
      none: {},
      start: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
      end: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      },
      both: {},
    },
  },
  defaultVariants: {
    state: 'idle',
    today: false,
    outsideMonth: false,
    rangeEdge: 'none',
  },
});
