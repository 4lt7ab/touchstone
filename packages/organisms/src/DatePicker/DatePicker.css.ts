import { style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

export const root = style({
  display: 'inline-block',
  width: '100%',
});

/**
 * The picker's outer row. In single mode it holds the input + a separate
 * trigger button on the right. In range mode it holds the `DateRangeInput`
 * (which embeds the trigger as its `endAdornment`) and nothing else.
 */
export const inputRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  width: '100%',
});

/** Container for the single-mode input — grows to fill the available row. */
export const inputs = style({
  flex: 1,
  minWidth: 0,
});

/** Standalone trigger button next to a single-mode input. */
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

/**
 * Trigger button rendered inside `DateRangeInput`'s adornment slot — sits
 * within the chrome of another input, so it goes ghost (no border, no
 * background) and lights up on hover. Hit target stays comfortable.
 */
export const embeddedTrigger = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: vars.space[8],
  height: vars.space[8],
  padding: 0,
  background: 'transparent',
  border: 'none',
  borderRadius: vars.radius.sm,
  color: vars.color.fgSecondary,
  cursor: 'pointer',
  transition:
    `background-color ${vars.duration.fast} ${vars.easing.standard}, ` +
    `color ${vars.duration.fast} ${vars.easing.standard}`,
  selectors: {
    '&:hover:not(:disabled)': {
      background: vars.color.bgMuted,
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
      background: vars.color.bgMuted,
      color: vars.color.fg,
    },
  },
});
