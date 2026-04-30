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

export const terminalTheme = createTheme(vars, {
  color: {
    bg: '#0a0a0a',
    bgRaised: '#101410',
    bgMuted: '#181c18',
    bgOverlay: 'rgba(10, 10, 10, 0.85)',
    bgInput: '#0a0a0a',
    bgPage: '#000000',
    fg: '#33ff33',
    fgMuted: '#33ff3399',
    fgInverse: '#000000',
    fgLink: '#7fff7f',
    border: 'rgba(51, 255, 51, 0.30)',
    borderFocus: '#33ff33',
    accent: '#33ff33',
    accentFg: '#000000',
    actionPrimary: '#33ff33',
    actionPrimaryHover: '#7fff7f',
    actionSecondary: '#0a0a0a',
    actionSecondaryHover: '#181c18',
    danger: '#ff3333',
    dangerFg: '#000000',
    success: '#33ff33',
    warning: '#ffe44d',
    info: '#7fff7f',
    glow: '#33ff33',
    glowFg: '#000000',
  },
  space,
  radius,
  zIndex,
  shadow: {
    sm: '0 0 4px rgba(51, 255, 51, 0.15)',
    md: '0 0 8px rgba(51, 255, 51, 0.20)',
    lg: '0 0 24px rgba(51, 255, 51, 0.35)',
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

// CRT scanline overlay — heavier than synthwave's, with darker stripes.
globalStyle(`.${terminalTheme}::after`, {
  content: '""',
  position: 'fixed',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 1,
  background:
    'repeating-linear-gradient(to bottom, transparent 0, transparent 2px, ' +
    'rgba(0, 0, 0, 0.15) 2px, rgba(0, 0, 0, 0.15) 4px)',
});

// Phosphor heading glow.
globalStyle(
  `.${terminalTheme} h1, .${terminalTheme} h2, .${terminalTheme} h3`,
  {
    textShadow: '0 0 12px rgba(51, 255, 51, 0.6)',
  },
);
