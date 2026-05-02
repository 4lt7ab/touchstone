import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const textarea = recipe({
  base: {
    display: 'block',
    width: '100%',
    paddingBlock: vars.space[2],
    paddingInline: vars.space[3],
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.radius.md,
    background: vars.color.bgInput,
    color: vars.color.fg,
    fontFamily: vars.font.family.sans,
    fontSize: vars.font.size.md,
    lineHeight: vars.font.lineHeight.normal,
    transition:
      `border-color ${vars.duration.base} ${vars.easing.standard}, ` +
      `box-shadow ${vars.duration.base} ${vars.easing.standard}`,
    ':focus-visible': {
      outline: 'none',
      borderColor: vars.color.borderFocus,
      boxShadow: `0 0 0 ${vars.focus.ringWidth} ${vars.focus.ringColor}`,
    },
    ':disabled': {
      cursor: 'not-allowed',
      background: vars.color.bgDisabled,
      color: vars.color.fgDisabled,
    },
    '::placeholder': {
      color: vars.color.fgPlaceholder,
    },
  },
  variants: {
    invalid: {
      true: {
        borderColor: vars.color.borderError,
        ':focus-visible': {
          borderColor: vars.color.borderError,
          boxShadow: `0 0 0 ${vars.focus.ringWidth} ${vars.color.borderError}`,
        },
      },
    },
    resize: {
      none: { resize: 'none' },
      vertical: { resize: 'vertical' },
      horizontal: { resize: 'horizontal' },
      both: { resize: 'both' },
    },
  },
  defaultVariants: {
    invalid: false,
    resize: 'vertical',
  },
});
