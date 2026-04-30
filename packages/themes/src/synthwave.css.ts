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

export const synthwaveTheme = createTheme(vars, {
  color: {
    bg: '#0c081c',
    bgSolid: '#0c081c',
    bgRaised: '#16102a',
    bgMuted: '#1f1838',
    bgPanel: '#0c081c',
    bgOverlay: 'rgba(12, 8, 28, 0.85)',
    bgInput: '#0e0e24',
    bgDisabled: 'rgba(31, 24, 56, 0.7)',
    bgPage: '#06020f',
    fg: '#e0d6f6',
    fgSecondary: '#bea8e0',
    fgMuted: '#a0c4e8',
    fgPlaceholder: '#6a82a8',
    fgDisabled: '#3a5a78',
    fgInverse: '#06020f',
    fgLink: '#00fff5',
    border: 'rgba(0, 255, 245, 0.25)',
    borderFocus: '#ff2d95',
    borderError: '#ff4444',
    accent: '#ff2d95',
    accentFg: '#06020f',
    actionPrimary: '#ff2d95',
    actionPrimaryHover: '#ff66b3',
    actionSecondary: '#0e0e24',
    actionSecondaryHover: '#1f1838',
    danger: '#ff4080',
    dangerHover: '#ff66a3',
    dangerFg: '#ffffff',
    dangerBg: 'rgba(255, 64, 128, 0.10)',
    success: '#39ff14',
    successBg: 'rgba(57, 255, 20, 0.10)',
    warning: '#ffe44d',
    warningBg: 'rgba(255, 228, 77, 0.10)',
    info: '#00fff5',
    infoBg: 'rgba(0, 255, 245, 0.10)',
    glow: '#ff2d95',
    glowFg: '#00fff5',
  },
  space,
  radius,
  zIndex,
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.6), 0 0 4px rgba(0, 255, 245, 0.05)',
    md: '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 6px rgba(0, 255, 245, 0.08)',
    lg: '0 0 32px rgba(0, 255, 245, 0.25), 0 0 8px rgba(255, 45, 149, 0.20)',
  },
  borderWidth,
  letterSpacing,
  duration,
  easing,
  font: {
    family: {
      sans: '"Inter", system-ui, -apple-system, sans-serif',
      mono: '"Fira Code", ui-monospace, monospace',
      serif: '"Lora", Georgia, "Times New Roman", serif',
      display: '"Inter", system-ui, -apple-system, sans-serif',
    },
    size: font.size,
    weight: font.weight,
    lineHeight: font.lineHeight,
  },
  focus: {
    ringColor: '#ff2d95',
    ringWidth: '2px',
    ringOffset: '2px',
  },
});

// Scanline overlay — fixed full-viewport pseudo-element with a 2px stripe.
globalStyle(`.${synthwaveTheme}::after`, {
  content: '""',
  position: 'fixed',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 1,
  background:
    'repeating-linear-gradient(transparent 0, transparent 2px, ' +
    'rgba(0, 255, 245, 0.015) 2px, rgba(0, 255, 245, 0.015) 4px)',
});
