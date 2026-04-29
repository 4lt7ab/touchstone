import { style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
});

export const label = style({
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  color: vars.color.fg,
});

export const hint = style({
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.xs,
  color: vars.color.fgMuted,
});

export const error = style({
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.xs,
  color: vars.color.danger,
});
