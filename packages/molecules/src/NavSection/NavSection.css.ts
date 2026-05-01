import { style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
});

export const label = style({
  paddingInline: vars.space[3],
  paddingBlockStart: vars.space[2],
  paddingBlockEnd: vars.space[1],
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.medium,
  color: vars.color.fgMuted,
  letterSpacing: vars.letterSpacing.wide,
  textTransform: 'uppercase',
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
});
