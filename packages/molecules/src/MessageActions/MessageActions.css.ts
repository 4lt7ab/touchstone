import { style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
  color: vars.color.fgMuted,
});
