import { recipe } from '@vanilla-extract/recipes';
import { keyframes, style } from '@vanilla-extract/css';

const spin = keyframes({
  to: { transform: 'rotate(360deg)' },
});

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const ring = recipe({
  base: {
    display: 'inline-block',
    borderStyle: 'solid',
    borderColor: 'currentColor',
    borderRightColor: 'transparent',
    borderRadius: '50%',
    animation: `${spin} 700ms linear infinite`,
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        animation: 'none',
        opacity: 0.7,
      },
    },
  },
  variants: {
    size: {
      sm: {
        width: '0.875em',
        height: '0.875em',
        borderWidth: '2px',
      },
      md: {
        width: '1em',
        height: '1em',
        borderWidth: '2px',
      },
      lg: {
        width: '1.5em',
        height: '1.5em',
        borderWidth: '3px',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
