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

const pixelStack = '"Press Start 2P", "VT323", ui-monospace, SFMono-Regular, Menlo, monospace';

export const pacmanTheme = createTheme(vars, {
  color: {
    bg: '#000000',
    bgSolid: '#000000',
    bgRaised: '#0a0a2a',
    bgMuted: '#1a1a4a',
    bgPanel: '#000000',
    bgOverlay: 'rgba(0, 0, 0, 0.90)',
    bgInput: '#0a0a2a',
    bgDisabled: '#1a1a4a',
    bgPage: '#000000',
    fg: '#e0e0e0',
    fgSecondary: '#b0b0b0',
    fgMuted: '#5555ff',
    fgPlaceholder: '#5555ff',
    fgDisabled: '#333366',
    fgInverse: '#000000',
    fgLink: '#ffff00',
    border: '#2121de',
    borderFocus: '#ffff00',
    borderError: '#ff4444',
    accent: '#ffff00',
    accentFg: '#000000',
    actionPrimary: '#ffff00',
    actionPrimaryHover: '#ffff66',
    actionSecondary: '#0a0a2a',
    actionSecondaryHover: '#1a1a4a',
    danger: '#ff4444',
    dangerHover: '#ff6666',
    dangerFg: '#000000',
    dangerBg: 'rgba(255, 68, 68, 0.10)',
    success: '#22c55e',
    successBg: 'rgba(34, 197, 94, 0.10)',
    warning: '#ffb852',
    warningBg: 'rgba(255, 184, 82, 0.10)',
    info: '#00ffff',
    infoBg: 'rgba(0, 255, 255, 0.10)',
    glow: '#ffff00',
    glowFg: '#000000',
  },
  space,
  radius: {
    none: '0',
    sm: '0',
    md: '0',
    lg: '0',
    xl: '0',
    full: radius.full,
  },
  zIndex,
  shadow: {
    sm: '0 0 4px rgba(33, 33, 222, 0.20)',
    md: '0 0 8px rgba(33, 33, 222, 0.30)',
    lg: '0 0 16px rgba(255, 255, 0, 0.20)',
  },
  borderWidth,
  letterSpacing,
  duration,
  easing,
  font: {
    family: {
      sans: pixelStack,
      mono: pixelStack,
      serif: pixelStack,
      display: pixelStack,
    },
    size: font.size,
    weight: font.weight,
    lineHeight: font.lineHeight,
  },
  focus: {
    ringColor: '#ffff00',
    ringWidth: '2px',
    ringOffset: '2px',
  },
});

globalStyle(`.${pacmanTheme} h1`, {
  fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
  lineHeight: 1.6,
  letterSpacing: '0.5px',
});

globalStyle(`.${pacmanTheme} h2`, {
  fontSize: 'clamp(0.9rem, 2.5vw, 1.15rem)',
  lineHeight: 1.6,
  letterSpacing: '0.5px',
});

globalStyle(`.${pacmanTheme} h3`, {
  fontSize: '0.85rem',
  lineHeight: 1.6,
  letterSpacing: '0.5px',
});

globalStyle(`.${pacmanTheme} img`, {
  imageRendering: 'pixelated',
});
