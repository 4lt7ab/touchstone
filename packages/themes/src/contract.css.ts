import { createThemeContract } from '@vanilla-extract/css';
import { font, radius, space, zIndex } from '@touchstone/tokens';

const mapToNull = <T extends Record<string, unknown>>(
  obj: T,
): { [K in keyof T]: null } => {
  const out = {} as { [K in keyof T]: null };
  for (const key of Object.keys(obj) as (keyof T)[]) {
    out[key] = null;
  }
  return out;
};

export const vars = createThemeContract({
  color: {
    bg: null,
    bgRaised: null,
    bgMuted: null,
    fg: null,
    fgMuted: null,
    border: null,
    accent: null,
    accentFg: null,
    danger: null,
    dangerFg: null,
    success: null,
  },
  space: mapToNull(space),
  radius: mapToNull(radius),
  zIndex: mapToNull(zIndex),
  font: {
    family: mapToNull(font.family),
    size: mapToNull(font.size),
    weight: mapToNull(font.weight),
    lineHeight: mapToNull(font.lineHeight),
  },
});

export type ThemeVars = typeof vars;
