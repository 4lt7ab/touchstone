import { createTheme } from '@vanilla-extract/css';
import { color, font, radius, space, zIndex } from '@touchstone/tokens';
import { vars } from './contract.css.js';

export const lightTheme = createTheme(vars, {
  color: {
    bg: color.neutral[0],
    bgRaised: color.neutral[50],
    bgMuted: color.neutral[100],
    fg: color.neutral[900],
    fgMuted: color.neutral[600],
    border: color.neutral[200],
    accent: color.accent[500],
    accentFg: color.neutral[0],
    danger: color.danger[500],
    dangerFg: color.neutral[0],
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
