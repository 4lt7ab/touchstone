import { style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

export const backdrop = style({
  position: 'fixed',
  inset: 0,
  background: vars.color.bgOverlay,
  zIndex: vars.zIndex.modal,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '15vh',
  paddingInline: vars.space[4],
});

export const panel = style({
  width: '100%',
  maxWidth: '640px',
  background: vars.color.bgRaised,
  color: vars.color.fg,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  boxShadow: vars.shadow.lg,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  outline: 'none',
});

export const inputRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  paddingBlock: vars.space[3],
  paddingInline: vars.space[4],
  borderBottom: `1px solid ${vars.color.border}`,
});

export const inputIcon = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.fgSecondary,
  width: vars.space[5],
  height: vars.space[5],
});

export const input = style({
  flex: 1,
  minWidth: 0,
  background: 'transparent',
  border: 'none',
  outline: 'none',
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.md,
  color: vars.color.fg,
  '::placeholder': {
    color: vars.color.fgPlaceholder,
  },
});

export const list = style({
  maxHeight: '400px',
  overflowY: 'auto',
  paddingBlock: vars.space[2],
  paddingInline: vars.space[2],
});

export const groupHeading = style({
  paddingBlock: vars.space[1],
  paddingInline: vars.space[3],
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.semibold,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.wide,
  color: vars.color.fgMuted,
});

export const empty = style({
  padding: vars.space[6],
  textAlign: 'center',
  color: vars.color.fgMuted,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.sm,
});

export const footer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBlock: vars.space[2],
  paddingInline: vars.space[4],
  borderTop: `1px solid ${vars.color.border}`,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.xs,
  color: vars.color.fgMuted,
  gap: vars.space[3],
});

export const footerHints = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[3],
});

export const footerHint = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
});
