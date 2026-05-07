import { style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

export const root = style({
  fontFamily: vars.font.family.sans,
  fontVariantNumeric: 'tabular-nums',
  color: 'inherit',
});
