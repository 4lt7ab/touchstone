import { keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

const backdropEnter = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const slideFromLeft = keyframes({
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(0)' },
});

const slideFromRight = keyframes({
  from: { transform: 'translateX(100%)' },
  to: { transform: 'translateX(0)' },
});

const slideFromTop = keyframes({
  from: { transform: 'translateY(-100%)' },
  to: { transform: 'translateY(0)' },
});

const slideFromBottom = keyframes({
  from: { transform: 'translateY(100%)' },
  to: { transform: 'translateY(0)' },
});

export const backdrop = recipe({
  base: {
    position: 'fixed',
    inset: 0,
    zIndex: vars.zIndex.modal,
    background: vars.color.bgOverlay,
    display: 'flex',
    animation: `${backdropEnter} ${vars.duration.base} ${vars.easing.standard}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        animation: 'none',
      },
    },
  },
  variants: {
    side: {
      left: { justifyContent: 'flex-start', alignItems: 'stretch' },
      right: { justifyContent: 'flex-end', alignItems: 'stretch' },
      top: { alignItems: 'flex-start', justifyContent: 'stretch' },
      bottom: { alignItems: 'flex-end', justifyContent: 'stretch' },
    },
  },
  defaultVariants: {
    side: 'right',
  },
});

export const panel = recipe({
  base: {
    position: 'relative',
    background: vars.color.bgRaised,
    color: vars.color.fg,
    boxShadow: vars.shadow.lg,
    fontFamily: vars.font.family.sans,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    outline: 'none',
    overflow: 'hidden',
    selectors: {
      '&:focus-visible': {
        outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
        outlineOffset: `calc(-1 * ${vars.focus.ringWidth})`,
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        animation: 'none',
      },
    },
  },
  variants: {
    side: {
      left: {
        height: '100%',
        animation: `${slideFromLeft} ${vars.duration.slow} ${vars.easing.emphasized}`,
        borderTopRightRadius: vars.radius.lg,
        borderBottomRightRadius: vars.radius.lg,
      },
      right: {
        height: '100%',
        animation: `${slideFromRight} ${vars.duration.slow} ${vars.easing.emphasized}`,
        borderTopLeftRadius: vars.radius.lg,
        borderBottomLeftRadius: vars.radius.lg,
      },
      top: {
        width: '100%',
        animation: `${slideFromTop} ${vars.duration.slow} ${vars.easing.emphasized}`,
        borderBottomLeftRadius: vars.radius.lg,
        borderBottomRightRadius: vars.radius.lg,
      },
      bottom: {
        width: '100%',
        animation: `${slideFromBottom} ${vars.duration.slow} ${vars.easing.emphasized}`,
        borderTopLeftRadius: vars.radius.lg,
        borderTopRightRadius: vars.radius.lg,
      },
    },
    size: {
      sm: {},
      md: {},
      lg: {},
      full: {},
    },
  },
  compoundVariants: [
    { variants: { side: 'left', size: 'sm' }, style: { width: '18rem', maxWidth: '90vw' } },
    { variants: { side: 'left', size: 'md' }, style: { width: '24rem', maxWidth: '90vw' } },
    { variants: { side: 'left', size: 'lg' }, style: { width: '32rem', maxWidth: '90vw' } },
    { variants: { side: 'left', size: 'full' }, style: { width: '90vw' } },
    { variants: { side: 'right', size: 'sm' }, style: { width: '18rem', maxWidth: '90vw' } },
    { variants: { side: 'right', size: 'md' }, style: { width: '24rem', maxWidth: '90vw' } },
    { variants: { side: 'right', size: 'lg' }, style: { width: '32rem', maxWidth: '90vw' } },
    { variants: { side: 'right', size: 'full' }, style: { width: '90vw' } },
    { variants: { side: 'top', size: 'sm' }, style: { height: '12rem', maxHeight: '90vh' } },
    { variants: { side: 'top', size: 'md' }, style: { height: '20rem', maxHeight: '90vh' } },
    { variants: { side: 'top', size: 'lg' }, style: { height: '32rem', maxHeight: '90vh' } },
    { variants: { side: 'top', size: 'full' }, style: { height: '90vh' } },
    { variants: { side: 'bottom', size: 'sm' }, style: { height: '12rem', maxHeight: '90vh' } },
    { variants: { side: 'bottom', size: 'md' }, style: { height: '20rem', maxHeight: '90vh' } },
    { variants: { side: 'bottom', size: 'lg' }, style: { height: '32rem', maxHeight: '90vh' } },
    { variants: { side: 'bottom', size: 'full' }, style: { height: '90vh' } },
  ],
  defaultVariants: {
    side: 'right',
    size: 'md',
  },
});

export const header = style({
  padding: `${vars.space[6]} ${vars.space[6]} 0`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
});

export const title = style({
  margin: 0,
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.font.lineHeight.tight,
  color: vars.color.fg,
  paddingRight: vars.space[8],
});

export const description = style({
  margin: 0,
  fontSize: vars.font.size.sm,
  color: vars.color.fgMuted,
  lineHeight: vars.font.lineHeight.normal,
});

export const body = style({
  padding: `${vars.space[4]} ${vars.space[6]}`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  overflowY: 'auto',
  flex: 1,
  minHeight: 0,
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
