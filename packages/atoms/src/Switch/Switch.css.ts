import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

const TRACK_HEIGHT = vars.space[5];
const THUMB_SIZE = vars.space[4];
const PADDING = '2px';

export const root = recipe({
  base: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    width: vars.space[10],
    height: TRACK_HEIGHT,
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.radius.full,
    background: vars.color.bgInput,
    padding: PADDING,
    cursor: 'pointer',
    transition:
      `background-color ${vars.duration.base} ${vars.easing.standard}, ` +
      `border-color ${vars.duration.base} ${vars.easing.standard}`,
    selectors: {
      '&[aria-checked="true"]': {
        background: vars.color.actionPrimary,
        borderColor: vars.color.actionPrimary,
      },
      '&:focus-visible': {
        outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
        outlineOffset: vars.focus.ringOffset,
      },
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 0.55,
      },
    },
  },
  variants: {},
});

export const thumb = recipe({
  base: {
    display: 'block',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: vars.radius.full,
    background: vars.color.bg,
    boxShadow: vars.shadow.sm,
    transform: 'translateX(0)',
    transition: `transform ${vars.duration.base} ${vars.easing.standard}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
    selectors: {
      '[aria-checked="true"] > &': {
        transform: `translateX(calc(${vars.space[10]} - ${THUMB_SIZE} - ${PADDING} - ${PADDING} - 2px))`,
      },
    },
  },
});
