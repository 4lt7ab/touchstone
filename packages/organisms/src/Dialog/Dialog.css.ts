import { style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

export const backdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: vars.zIndex.modal,
  background: vars.color.bgOverlay,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: vars.space[4],
});

export const panel = style({
  position: 'relative',
  width: '100%',
  maxWidth: '32rem',
  maxHeight: 'calc(100vh - 2rem)',
  overflowY: 'auto',
  background: vars.color.bgRaised,
  color: vars.color.fg,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.lg,
  padding: vars.space[6],
  fontFamily: vars.font.family.sans,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  outline: 'none',
  selectors: {
    '&:focus-visible': {
      outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
      outlineOffset: vars.focus.ringOffset,
    },
  },
});

export const title = style({
  margin: 0,
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.font.lineHeight.tight,
  color: vars.color.fg,
});

export const description = style({
  margin: 0,
  fontSize: vars.font.size.sm,
  color: vars.color.fgMuted,
  lineHeight: vars.font.lineHeight.normal,
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
});

export const dismissSlot = style({
  position: 'absolute',
  top: vars.space[3],
  right: vars.space[3],
  display: 'inline-flex',
});
