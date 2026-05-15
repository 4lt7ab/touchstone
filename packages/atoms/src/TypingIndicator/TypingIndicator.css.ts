import { keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

const bounce = keyframes({
  '0%, 80%, 100%': { transform: 'translateY(0)', opacity: 0.4 },
  '40%': { transform: 'translateY(-0.25em)', opacity: 1 },
});

export const root = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'flex-end',
    gap: '0.25em',
    color: vars.color.fgMuted,
    lineHeight: 1,
  },
  variants: {
    size: {
      sm: { fontSize: vars.font.size.sm },
      md: { fontSize: vars.font.size.md },
      lg: { fontSize: vars.font.size.lg },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const dot = style({
  display: 'inline-block',
  width: '0.4em',
  height: '0.4em',
  borderRadius: '50%',
  background: 'currentColor',
  animation: `${bounce} 1.1s infinite ease-in-out`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      opacity: 0.6,
    },
  },
});

export const dotOne = style({ animationDelay: '0s' });
export const dotTwo = style({ animationDelay: '0.18s' });
export const dotThree = style({ animationDelay: '0.36s' });

export const srOnly = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
});
