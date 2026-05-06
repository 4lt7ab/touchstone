import { style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

export const root = style({
  display: 'inline-block',
  width: '100%',
});

export const inputRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  width: '100%',
});

export const rangeRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  flex: 1,
  minWidth: 0,
});

export const rangeArrow = style({
  color: vars.color.fgMuted,
  fontSize: vars.font.size.sm,
  userSelect: 'none',
});

export const triggerButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: vars.space[10],
  height: vars.space[10],
  padding: 0,
  background: vars.color.bgInput,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  color: vars.color.fgSecondary,
  cursor: 'pointer',
  transition:
    `background-color ${vars.duration.fast} ${vars.easing.standard}, ` +
    `border-color ${vars.duration.fast} ${vars.easing.standard}, ` +
    `color ${vars.duration.fast} ${vars.easing.standard}`,
  selectors: {
    '&:hover:not(:disabled)': {
      borderColor: vars.color.borderFocus,
      color: vars.color.fg,
    },
    '&:focus-visible': {
      outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
      outlineOffset: vars.focus.ringOffset,
    },
    '&:disabled': {
      opacity: 0.55,
      cursor: 'not-allowed',
    },
    '&[aria-expanded="true"]': {
      borderColor: vars.color.borderFocus,
      color: vars.color.fg,
    },
  },
});
