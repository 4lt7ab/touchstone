import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

export const root = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space[2],
    width: '100%',
    minWidth: 0,
    height: vars.space[10],
    paddingInline: vars.space[3],
    '@media': {
      // Shrink the inner gap on narrow viewports so date + time pack
      // tightly when nested inside `DateRangeInput`'s chrome.
      '(max-width: 600px)': {
        gap: vars.space[1],
      },
    },
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.radius.md,
    background: vars.color.bgInput,
    color: vars.color.fg,
    fontFamily: vars.font.family.sans,
    fontSize: vars.font.size.md,
    transition:
      `border-color ${vars.duration.base} ${vars.easing.standard}, ` +
      `box-shadow ${vars.duration.base} ${vars.easing.standard}`,
    selectors: {
      '&:focus-within': {
        borderColor: vars.color.borderFocus,
        boxShadow: `0 0 0 ${vars.focus.ringWidth} ${vars.focus.ringColor}`,
      },
    },
  },
  variants: {
    invalid: {
      true: {
        borderColor: vars.color.borderError,
        selectors: {
          '&:focus-within': {
            borderColor: vars.color.borderError,
            boxShadow: `0 0 0 ${vars.focus.ringWidth} ${vars.color.borderError}`,
          },
        },
      },
    },
    disabled: {
      true: {
        cursor: 'not-allowed',
        background: vars.color.bgDisabled,
        color: vars.color.fgDisabled,
      },
    },
    /** Strip chrome so an outer wrapper can provide a unified container —
     * e.g. `DateRangeInput` placing two `DateTimeInput`s under one border. */
    bare: {
      true: {
        width: 'auto',
        height: 'auto',
        paddingInline: 0,
        border: 'none',
        background: 'transparent',
        selectors: {
          '&:focus-within': {
            borderColor: 'transparent',
            boxShadow: 'none',
          },
        },
      },
    },
  },
  defaultVariants: {
    invalid: false,
    disabled: false,
    bare: false,
  },
});

export const divider = style({
  width: '1px',
  height: vars.space[5],
  background: vars.color.border,
  flexShrink: 0,
  // Hide the divider on narrow viewports — the gap + the slash/colon
  // separators inside the segments make the date↔time boundary clear
  // enough without a vertical line eating horizontal space.
  '@media': {
    '(max-width: 600px)': {
      display: 'none',
    },
  },
});
