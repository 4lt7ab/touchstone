import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const container = recipe({
  base: {
    width: '100%',
    marginInline: 'auto',
    minWidth: 0,
  },
  variants: {
    width: {
      narrow: { maxWidth: '32rem' },
      prose: { maxWidth: '65ch' },
      wide: { maxWidth: '72rem' },
      full: { maxWidth: 'none' },
    },
    padding: {
      none: { padding: vars.space[0] },
      sm: { paddingBlock: vars.space[2], paddingInline: vars.space[4] },
      md: { paddingBlock: vars.space[4], paddingInline: vars.space[6] },
      lg: { paddingBlock: vars.space[6], paddingInline: vars.space[8] },
    },
  },
  defaultVariants: {
    width: 'wide',
    padding: 'none',
  },
});
