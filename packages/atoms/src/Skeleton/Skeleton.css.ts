import { recipe } from '@vanilla-extract/recipes';
import { keyframes } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

const pulse = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.5 },
});

export const skeleton = recipe({
  base: {
    display: 'block',
    background: vars.color.bgMuted,
    animation: `${pulse} 1.6s ease-in-out infinite`,
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        animation: 'none',
        opacity: 0.7,
      },
    },
  },
  variants: {
    shape: {
      text: {
        height: '0.875em',
        borderRadius: vars.radius.sm,
      },
      box: {
        borderRadius: vars.radius.md,
      },
      circle: {
        borderRadius: vars.radius.full,
        aspectRatio: '1',
      },
    },
  },
  defaultVariants: {
    shape: 'text',
  },
});
