import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const root = recipe({
  base: {
    display: 'block',
    width: '100%',
    overflow: 'hidden',
    background: vars.color.bgMuted,
    borderRadius: vars.radius.full,
  },
  variants: {
    size: {
      sm: { height: vars.space[1] },
      md: { height: vars.space[2] },
      lg: { height: vars.space[3] },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const fill = recipe({
  base: {
    display: 'block',
    height: '100%',
    transition: `width ${vars.duration.base} ${vars.easing.standard}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  },
  variants: {
    tone: {
      accent: { background: vars.color.actionPrimary },
      success: { background: vars.color.success },
      warning: { background: vars.color.warning },
      danger: { background: vars.color.danger },
    },
  },
  defaultVariants: {
    tone: 'accent',
  },
});

export const srOnly = style({
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
});
