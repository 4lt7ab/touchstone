import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const root = recipe({
  base: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minWidth: 0,
    cursor: 'pointer',
    userSelect: 'none',
    touchAction: 'none',
    selectors: {
      '&[aria-disabled="true"]': {
        cursor: 'not-allowed',
        opacity: 0.55,
      },
    },
  },
  variants: {
    size: {
      sm: { height: vars.space[5], paddingBlock: vars.space[2] },
      md: { height: vars.space[6], paddingBlock: vars.space[2] },
      lg: { height: vars.space[8], paddingBlock: vars.space[3] },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const track = recipe({
  base: {
    position: 'relative',
    flex: 1,
    background: vars.color.bgMuted,
    borderRadius: vars.radius.full,
  },
  variants: {
    size: {
      sm: { height: '4px' },
      md: { height: '6px' },
      lg: { height: '8px' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const fill = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
  background: vars.color.actionPrimary,
  borderRadius: vars.radius.full,
  transition: `background-color ${vars.duration.base} ${vars.easing.standard}`,
});

export const thumb = recipe({
  base: {
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    background: vars.color.bg,
    border: `2px solid ${vars.color.actionPrimary}`,
    borderRadius: vars.radius.full,
    boxShadow: vars.shadow.sm,
    cursor: 'grab',
    transition:
      `transform ${vars.duration.fast} ${vars.easing.standard}, ` +
      `box-shadow ${vars.duration.fast} ${vars.easing.standard}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
    selectors: {
      '&:focus-visible': {
        outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
        outlineOffset: vars.focus.ringOffset,
      },
      '&:active': {
        cursor: 'grabbing',
      },
      '&[aria-disabled="true"]': {
        cursor: 'not-allowed',
      },
    },
  },
  variants: {
    size: {
      sm: { width: vars.space[3], height: vars.space[3] },
      md: { width: vars.space[4], height: vars.space[4] },
      lg: { width: vars.space[5], height: vars.space[5] },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
