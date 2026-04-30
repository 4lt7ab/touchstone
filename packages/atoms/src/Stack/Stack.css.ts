import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const stack = recipe({
  base: {
    display: 'flex',
    boxSizing: 'border-box',
    minWidth: 0,
  },
  variants: {
    direction: {
      row: { flexDirection: 'row' },
      column: { flexDirection: 'column' },
    },
    gap: {
      none: { gap: vars.space[0] },
      xs: { gap: vars.space[1] },
      sm: { gap: vars.space[2] },
      md: { gap: vars.space[4] },
      lg: { gap: vars.space[6] },
      xl: { gap: vars.space[8] },
    },
    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
      baseline: { alignItems: 'baseline' },
    },
    justify: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
      around: { justifyContent: 'space-around' },
      evenly: { justifyContent: 'space-evenly' },
    },
    wrap: {
      true: { flexWrap: 'wrap' },
      false: { flexWrap: 'nowrap' },
    },
  },
  defaultVariants: {
    direction: 'column',
    gap: 'md',
    wrap: false,
  },
});
