import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const root = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  height: '100%',
  width: '100%',
  background: vars.color.bg,
});

export const scrollArea = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  scrollBehavior: 'smooth',
  scrollbarGutter: 'stable',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      scrollBehavior: 'auto',
    },
  },
});

export const messageList = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space[4],
    paddingBlock: vars.space[6],
    paddingInline: vars.space[4],
    marginInline: 'auto',
    minWidth: 0,
  },
  variants: {
    width: {
      narrow: { maxWidth: '38rem', width: '100%' },
      reading: { maxWidth: '46rem', width: '100%' },
      wide: { maxWidth: '64rem', width: '100%' },
      full: { maxWidth: 'none', width: '100%' },
    },
  },
  defaultVariants: { width: 'reading' },
});

export const empty = style({
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 0,
});

export const typingRow = style({
  display: 'flex',
  alignItems: 'center',
  paddingInline: vars.space[2],
  paddingBlock: vars.space[2],
});

export const footer = style({
  flexShrink: 0,
  borderTop: `1px solid ${vars.color.border}`,
  background: vars.color.bg,
  padding: vars.space[4],
});

export const footerInner = recipe({
  base: {
    marginInline: 'auto',
    minWidth: 0,
  },
  variants: {
    width: {
      narrow: { maxWidth: '38rem', width: '100%' },
      reading: { maxWidth: '46rem', width: '100%' },
      wide: { maxWidth: '64rem', width: '100%' },
      full: { maxWidth: 'none', width: '100%' },
    },
  },
  defaultVariants: { width: 'reading' },
});

export const jumpToLatest = style({
  position: 'absolute',
  insetInlineEnd: vars.space[4],
  insetBlockEnd: vars.space[4],
  zIndex: 1,
  boxShadow: vars.shadow.md,
});
