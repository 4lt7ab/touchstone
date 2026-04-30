import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const divider = recipe({
  base: {
    border: 'none',
    background: vars.color.border,
    flexShrink: 0,
  },
  variants: {
    orientation: {
      horizontal: {
        width: '100%',
        height: '1px',
      },
      vertical: {
        width: '1px',
        alignSelf: 'stretch',
      },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});
