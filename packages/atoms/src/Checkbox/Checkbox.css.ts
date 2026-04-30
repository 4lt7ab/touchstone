import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const root = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: vars.space[5],
    height: vars.space[5],
    flexShrink: 0,
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.radius.sm,
    background: vars.color.bgInput,
    color: vars.color.fgInverse,
    cursor: 'pointer',
    padding: 0,
    transition:
      `background-color ${vars.duration.base} ${vars.easing.standard}, ` +
      `border-color ${vars.duration.base} ${vars.easing.standard}`,
    selectors: {
      '&[aria-checked="true"], &[aria-checked="mixed"]': {
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

export const glyph = recipe({
  base: {
    display: 'block',
    width: vars.space[3],
    height: vars.space[3],
    color: 'currentColor',
  },
  variants: {},
});
