import { createThemeContract } from '@vanilla-extract/css';
import {
  borderWidth,
  duration,
  easing,
  font,
  letterSpacing,
  radius,
  shadow,
  space,
  zIndex,
} from '@touchstone/tokens';

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
    bgOverlay: null,
    bgInput: null,
    bgPage: null,
    fg: null,
    fgMuted: null,
    fgInverse: null,
    fgLink: null,
    border: null,
    borderFocus: null,
    accent: null,
    accentFg: null,
    actionPrimary: null,
    actionPrimaryHover: null,
    actionSecondary: null,
    actionSecondaryHover: null,
    danger: null,
    dangerFg: null,
    success: null,
    warning: null,
    info: null,
    glow: null,
    glowFg: null,
  },
  space: mapToNull(space),
  radius: mapToNull(radius),
  zIndex: mapToNull(zIndex),
  shadow: mapToNull(shadow),
  borderWidth: mapToNull(borderWidth),
  letterSpacing: mapToNull(letterSpacing),
  duration: mapToNull(duration),
  easing: mapToNull(easing),
  font: {
    family: mapToNull(font.family),
    size: mapToNull(font.size),
    weight: mapToNull(font.weight),
    lineHeight: mapToNull(font.lineHeight),
  },
  focus: {
    ringColor: null,
    ringWidth: null,
    ringOffset: null,
  },
});

export type ThemeVars = typeof vars;
