import { style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

export const panel = style({
  zIndex: vars.zIndex.popover,
  background: vars.color.bgRaised,
  color: vars.color.fg,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  boxShadow: vars.shadow.md,
  padding: vars.space[3],
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.sm,
  outline: 'none',
  selectors: {
    '&:focus-visible': {
      outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
      outlineOffset: vars.focus.ringOffset,
    },
  },
});
