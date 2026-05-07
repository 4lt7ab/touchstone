import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

export const root = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    height: vars.space[10],
    paddingInline: vars.space[3],
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
    /** See `DateInput`'s `bare` variant — strips chrome so an outer wrapper
     * can provide a unified visual container. */
    bare: {
      true: {
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

export const segmentSlot = style({
  display: 'inline-flex',
  alignItems: 'center',
});

export const segment = style({
  margin: 0,
  padding: 0,
  width: '2ch',
  background: 'transparent',
  border: 'none',
  color: 'inherit',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontVariantNumeric: 'tabular-nums',
  textAlign: 'center',
  outline: 'none',
  selectors: {
    '&::placeholder': {
      color: vars.color.fgPlaceholder,
    },
    '&:disabled': {
      color: vars.color.fgDisabled,
      cursor: 'not-allowed',
    },
  },
});

export const separator = style({
  paddingInline: '2px',
  color: vars.color.fgMuted,
  userSelect: 'none',
});
