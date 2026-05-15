import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const root = recipe({
  base: {
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.radius.md,
    background: vars.color.bgPanel,
    overflow: 'hidden',
    fontFamily: vars.font.family.sans,
    fontSize: vars.font.size.sm,
  },
  variants: {
    status: {
      pending: {},
      success: {},
      error: {
        borderColor: vars.color.danger,
      },
    },
  },
  defaultVariants: {
    status: 'pending',
  },
});

export const summary = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  width: '100%',
  paddingBlock: vars.space[2],
  paddingInline: vars.space[3],
  border: 'none',
  background: 'transparent',
  color: vars.color.fg,
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: vars.font.weight.medium,
  textAlign: 'left',
  cursor: 'pointer',
  transition: `background-color ${vars.duration.base} ${vars.easing.standard}`,
  selectors: {
    '&:hover': { background: vars.color.bgMuted },
    '&:focus-visible': {
      outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
      outlineOffset: `-${vars.focus.ringWidth}`,
    },
  },
});

export const iconSlot = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.fgMuted,
  flexShrink: 0,
});

export const name = style({
  flex: 1,
  minWidth: 0,
  fontFamily: vars.font.family.mono,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const chevron = style({
  display: 'inline-flex',
  alignItems: 'center',
  color: vars.color.fgMuted,
  transition: `transform ${vars.duration.base} ${vars.easing.standard}`,
  selectors: {
    '&[data-open="true"]': { transform: 'rotate(180deg)' },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  padding: vars.space[3],
  borderTop: `1px solid ${vars.color.border}`,
});

export const sectionLabel = style({
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.semibold,
  letterSpacing: vars.letterSpacing.wide,
  textTransform: 'uppercase',
  color: vars.color.fgMuted,
});

export const sectionBody = style({
  display: 'block',
});
