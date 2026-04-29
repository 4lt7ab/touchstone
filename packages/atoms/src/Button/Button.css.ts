import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const button = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space[2],
    border: '1px solid transparent',
    borderRadius: vars.radius.md,
    fontFamily: vars.font.family.sans,
    fontWeight: vars.font.weight.medium,
    lineHeight: vars.font.lineHeight.tight,
    cursor: 'pointer',
    transition: 'background-color 120ms ease, border-color 120ms ease, color 120ms ease',
    ':disabled': {
      cursor: 'not-allowed',
      opacity: 0.55,
    },
    ':focus-visible': {
      outline: `2px solid ${vars.color.accent}`,
      outlineOffset: '2px',
    },
  },
  variants: {
    intent: {
      primary: {
        background: vars.color.accent,
        color: vars.color.accentFg,
        selectors: {
          '&:hover:not(:disabled)': { filter: 'brightness(0.95)' },
        },
      },
      secondary: {
        background: vars.color.bgRaised,
        color: vars.color.fg,
        borderColor: vars.color.border,
        selectors: {
          '&:hover:not(:disabled)': { background: vars.color.bgMuted },
        },
      },
      ghost: {
        background: 'transparent',
        color: vars.color.fg,
        selectors: {
          '&:hover:not(:disabled)': { background: vars.color.bgMuted },
        },
      },
      danger: {
        background: vars.color.danger,
        color: vars.color.dangerFg,
        selectors: {
          '&:hover:not(:disabled)': { filter: 'brightness(0.95)' },
        },
      },
    },
    size: {
      sm: {
        height: vars.space[8],
        paddingInline: vars.space[3],
        fontSize: vars.font.size.sm,
      },
      md: {
        height: vars.space[10],
        paddingInline: vars.space[4],
        fontSize: vars.font.size.md,
      },
      lg: {
        height: vars.space[12],
        paddingInline: vars.space[5],
        fontSize: vars.font.size.lg,
      },
    },
    fullWidth: {
      true: { width: '100%' },
    },
  },
  defaultVariants: {
    intent: 'primary',
    size: 'md',
    fullWidth: false,
  },
});
