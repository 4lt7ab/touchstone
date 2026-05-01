import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const grid = recipe({
  base: {
    display: 'grid',
    boxSizing: 'border-box',
    minWidth: 0,
  },
  variants: {
    gap: {
      none: { gap: vars.space[0] },
      xs: { gap: vars.space[1] },
      sm: { gap: vars.space[2] },
      md: { gap: vars.space[4] },
      lg: { gap: vars.space[6] },
      xl: { gap: vars.space[8] },
    },
    align: {
      start: { alignItems: 'start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'end' },
      stretch: { alignItems: 'stretch' },
    },
    justify: {
      start: { justifyItems: 'start' },
      center: { justifyItems: 'center' },
      end: { justifyItems: 'end' },
      stretch: { justifyItems: 'stretch' },
    },
  },
  defaultVariants: {
    gap: 'md',
  },
});
