import { createTheme, globalStyle } from '@vanilla-extract/css';
import {
  borderWidth,
  duration,
  easing,
  font,
  letterSpacing,
  radius,
  space,
  zIndex,
} from '@touchstone/tokens';
import { vars } from './contract.css.js';

const monoStack =
  '"Fira Code", "Cascadia Code", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

export const pipboyTheme = createTheme(vars, {
  color: {
    bg: '#0a0a0a',
    bgSolid: '#0a0a0a',
    bgRaised: '#0f1a0f',
    bgMuted: '#1a2e1a',
    bgPanel: '#0a0a0a',
    bgOverlay: 'rgba(0, 0, 0, 0.92)',
    bgInput: '#0d140d',
    bgDisabled: '#1a2e1a',
    bgPage: '#0a0a0a',
    fg: '#33ff33',
    fgSecondary: '#66cc66',
    fgMuted: '#339933',
    fgPlaceholder: '#339933',
    fgDisabled: '#1a4a1a',
    fgInverse: '#0a0a0a',
    fgLink: '#ffb347',
    border: '#1a2e1a',
    borderFocus: '#ffb347',
    borderError: '#ff4444',
    accent: '#ffb347',
    accentFg: '#0a0a0a',
    actionPrimary: '#ffb347',
    actionPrimaryHover: '#ffc46b',
    actionSecondary: '#0f1a0f',
    actionSecondaryHover: '#1a2e1a',
    danger: '#ff4444',
    dangerHover: '#ff6666',
    dangerFg: '#0a0a0a',
    dangerBg: 'rgba(255, 68, 68, 0.10)',
    success: '#33ff33',
    successBg: 'rgba(51, 255, 51, 0.10)',
    warning: '#ffb347',
    warningBg: 'rgba(255, 179, 71, 0.10)',
    info: '#33ff33',
    infoBg: 'rgba(51, 255, 51, 0.10)',
    glow: '#33ff33',
    glowFg: '#0a0a0a',
  },
  space,
  radius,
  zIndex,
  shadow: {
    sm: '0 0 4px rgba(51, 255, 51, 0.15)',
    md: '0 0 8px rgba(51, 255, 51, 0.20)',
    lg: '0 0 16px rgba(51, 255, 51, 0.25)',
  },
  borderWidth,
  letterSpacing,
  duration,
  easing,
  font: {
    family: {
      sans: monoStack,
      mono: monoStack,
      serif: monoStack,
      display: monoStack,
    },
    size: font.size,
    weight: font.weight,
    lineHeight: font.lineHeight,
  },
  focus: {
    ringColor: '#33ff33',
    ringWidth: '2px',
    ringOffset: '2px',
  },
});

globalStyle(`.${pipboyTheme}::after`, {
  content: '""',
  position: 'fixed',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 1,
  background:
    'repeating-linear-gradient(to bottom, transparent 0, transparent 2px, ' +
    'rgba(0, 0, 0, 0.15) 2px, rgba(0, 0, 0, 0.15) 4px)',
});

globalStyle(`.${pipboyTheme}`, {
  textShadow: '0 0 8px rgba(51, 255, 51, 0.4)',
});

globalStyle(`.${pipboyTheme} h1, .${pipboyTheme} h2, .${pipboyTheme} h3`, {
  textShadow: '0 0 12px rgba(51, 255, 51, 0.6)',
});
