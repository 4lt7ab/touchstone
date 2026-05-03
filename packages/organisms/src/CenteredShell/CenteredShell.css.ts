import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  width: '100%',
  background: vars.color.bgPage,
  color: vars.color.fg,
  padding: vars.space[6],
  gap: vars.space[6],
});

export const brand = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space[2],
});

export const card = recipe({
  base: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  variants: {
    size: {
      sm: { maxWidth: '22rem' },
      md: { maxWidth: '28rem' },
      lg: { maxWidth: '36rem' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const footer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space[1],
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.sm,
  color: vars.color.fgMuted,
  textAlign: 'center',
});
