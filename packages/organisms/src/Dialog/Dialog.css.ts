import { keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

const backdropEnter = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const panelEnter = keyframes({
  from: { opacity: 0, transform: 'translateY(8px) scale(0.98)' },
  to: { opacity: 1, transform: 'translateY(0) scale(1)' },
});

export const backdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: vars.zIndex.modal,
  background: vars.color.bgOverlay,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: vars.space[4],
  animation: `${backdropEnter} ${vars.duration.base} ${vars.easing.standard}`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});

export const panel = recipe({
  base: {
    position: 'relative',
    width: '100%',
    maxHeight: 'calc(100vh - 2rem)',
    background: vars.color.bgRaised,
    color: vars.color.fg,
    borderRadius: vars.radius.lg,
    boxShadow: vars.shadow.lg,
    fontFamily: vars.font.family.sans,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    outline: 'none',
    overflow: 'hidden',
    animation: `${panelEnter} ${vars.duration.slow} ${vars.easing.emphasized}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        animation: 'none',
      },
    },
    selectors: {
      '&:focus-visible': {
        outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
        outlineOffset: vars.focus.ringOffset,
      },
    },
  },
  variants: {
    size: {
      sm: { maxWidth: '24rem' },
      md: { maxWidth: '32rem' },
      lg: { maxWidth: '40rem' },
      xl: { maxWidth: '52rem' },
      full: {
        maxWidth: 'calc(100vw - 2rem)',
        maxHeight: 'calc(100vh - 2rem)',
        height: '100%',
      },
    },
    severity: {
      default: {},
      danger: {
        boxShadow: `${vars.shadow.lg}, inset 4px 0 0 0 ${vars.color.danger}`,
      },
    },
  },
  defaultVariants: {
    size: 'md',
    severity: 'default',
  },
});

export const header = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space[2],
  },
  variants: {
    mode: {
      default: {
        padding: `${vars.space[6]} ${vars.space[6]} 0`,
      },
      reader: {
        padding: `${vars.space[10]} ${vars.space[8]} ${vars.space[4]}`,
        alignItems: 'center',
      },
    },
  },
  defaultVariants: {
    mode: 'default',
  },
});

export const headerInner = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space[2],
    width: '100%',
  },
  variants: {
    mode: {
      default: {},
      reader: {
        maxWidth: '65ch',
      },
    },
  },
  defaultVariants: {
    mode: 'default',
  },
});

export const title = recipe({
  base: {
    margin: 0,
    fontWeight: vars.font.weight.semibold,
    lineHeight: vars.font.lineHeight.tight,
    color: vars.color.fg,
  },
  variants: {
    mode: {
      default: {
        fontSize: vars.font.size.lg,
        paddingRight: vars.space[8],
      },
      reader: {
        fontSize: vars.font.size.xl,
      },
    },
  },
  defaultVariants: {
    mode: 'default',
  },
});

export const description = style({
  margin: 0,
  fontSize: vars.font.size.sm,
  color: vars.color.fgMuted,
  lineHeight: vars.font.lineHeight.normal,
});

export const body = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    flex: 1,
    minHeight: 0,
  },
  variants: {
    mode: {
      default: {
        padding: `${vars.space[4]} ${vars.space[6]}`,
      },
      reader: {
        padding: `${vars.space[6]} ${vars.space[8]} ${vars.space[10]}`,
        lineHeight: vars.font.lineHeight.relaxed,
        alignItems: 'center',
      },
    },
  },
  defaultVariants: {
    mode: 'default',
  },
});

export const bodyInner = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space[4],
    width: '100%',
  },
  variants: {
    mode: {
      default: {},
      reader: {
        gap: vars.space[5],
        maxWidth: '65ch',
      },
    },
  },
  defaultVariants: {
    mode: 'default',
  },
});

export const footer = recipe({
  base: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: vars.space[3],
    padding: `${vars.space[4]} ${vars.space[6]}`,
    borderTop: `${vars.borderWidth.thin} solid ${vars.color.border}`,
    background: vars.color.bgRaised,
    flexShrink: 0,
  },
  variants: {
    align: {
      start: { justifyContent: 'flex-start' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
    },
  },
  defaultVariants: {
    align: 'end',
  },
});

export const dismissSlot = style({
  position: 'absolute',
  top: vars.space[3],
  right: vars.space[3],
  display: 'inline-flex',
});
