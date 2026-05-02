import { style } from '@vanilla-extract/css';
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

export const separator = style({
  height: '1px',
  background: vars.color.border,
  margin: `${vars.space[1]} 0`,
  border: 'none',
});
