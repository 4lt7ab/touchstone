import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

export const group = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
});

export const row = style({
  display: 'inline-flex',
  alignItems: 'flex-start',
  gap: vars.space[3],
  cursor: 'pointer',
  selectors: {
    '&[data-disabled="true"]': {
      cursor: 'not-allowed',
      opacity: 0.55,
    },
  },
});

export const indicator = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: vars.space[5],
    height: vars.space[5],
    flexShrink: 0,
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.radius.full,
    background: vars.color.bgInput,
    color: vars.color.fgInverse,
    padding: 0,
    cursor: 'pointer',
    transition:
      `background-color ${vars.duration.base} ${vars.easing.standard}, ` +
      `border-color ${vars.duration.base} ${vars.easing.standard}`,
    selectors: {
      '&[aria-checked="true"]': {
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

export const dot = style({
  display: 'block',
  width: vars.space[3],
  height: vars.space[3],
  borderRadius: vars.radius.full,
  background: vars.color.actionPrimary,
});

export const label = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.md,
  color: vars.color.fg,
  paddingBlockStart: '2px',
  selectors: {
    '[data-disabled="true"] &': {
      color: vars.color.fgDisabled,
    },
  },
});
