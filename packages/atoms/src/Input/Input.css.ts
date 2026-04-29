import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const input = recipe({
  base: {
    display: 'block',
    width: '100%',
    height: vars.space[10],
    paddingInline: vars.space[3],
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.radius.md,
    background: vars.color.bg,
    color: vars.color.fg,
    fontFamily: vars.font.family.sans,
    fontSize: vars.font.size.md,
    transition: 'border-color 120ms ease, box-shadow 120ms ease',
    ':focus-visible': {
      outline: 'none',
      borderColor: vars.color.accent,
      boxShadow: `0 0 0 2px ${vars.color.accent}`,
    },
    ':disabled': {
      cursor: 'not-allowed',
      opacity: 0.55,
    },
    '::placeholder': {
      color: vars.color.fgMuted,
    },
  },
  variants: {
    invalid: {
      true: {
        borderColor: vars.color.danger,
        ':focus-visible': {
          borderColor: vars.color.danger,
          boxShadow: `0 0 0 2px ${vars.color.danger}`,
        },
      },
    },
  },
  defaultVariants: {
    invalid: false,
  },
});
