import { createTheme } from '@vanilla-extract/css';
import { color, font, radius, space, zIndex } from '@touchstone/tokens';
import { vars } from './contract.css.js';

export const darkTheme = createTheme(vars, {
  color: {
    bg: color.neutral[900],
    bgRaised: color.neutral[800],
    bgMuted: color.neutral[700],
    fg: color.neutral[50],
    fgMuted: color.neutral[300],
    border: color.neutral[700],
    accent: color.accent[300],
    accentFg: color.neutral[900],
    danger: color.danger[100],
    dangerFg: color.danger[700],
    success: color.success[500],
  },
  space,
  radius,
  zIndex,
  font: {
    family: font.family,
    size: font.size,
    weight: font.weight,
    lineHeight: font.lineHeight,
  },
});
