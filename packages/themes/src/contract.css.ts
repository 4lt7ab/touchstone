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

const mapToNull = <T extends Record<string, unknown>>(obj: T): { [K in keyof T]: null } => {
  const out = {} as { [K in keyof T]: null };
  for (const key of Object.keys(obj) as (keyof T)[]) {
    out[key] = null;
  }
  return out;
};

export const vars = createThemeContract({
  color: {
    // ── Surfaces ─────────────────────────────────────────────────────────
    bg: null,
    bgSolid: null,
    bgRaised: null,
    bgMuted: null,
    bgPanel: null,
    bgOverlay: null,
    bgInput: null,
    bgDisabled: null,
    bgPage: null,
    // ── Foreground (text) ────────────────────────────────────────────────
    fg: null,
    fgSecondary: null,
    fgMuted: null,
    fgPlaceholder: null,
    fgDisabled: null,
    fgInverse: null,
    fgLink: null,
    // ── Borders ──────────────────────────────────────────────────────────
    border: null,
    borderFocus: null,
    borderError: null,
    // ── Accent ───────────────────────────────────────────────────────────
    accent: null,
    accentFg: null,
    // ── Actions ──────────────────────────────────────────────────────────
    actionPrimary: null,
    actionPrimaryHover: null,
    actionSecondary: null,
    actionSecondaryHover: null,
    // ── Feedback (foreground + tinted background pairs) ──────────────────
    danger: null,
    dangerHover: null,
    dangerFg: null,
    dangerBg: null,
    success: null,
    successBg: null,
    warning: null,
    warningBg: null,
    info: null,
    infoBg: null,
    // ── Theme accents (rhythm/glow) ──────────────────────────────────────
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
