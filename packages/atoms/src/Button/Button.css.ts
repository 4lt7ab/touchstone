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
    transition:
      `background-color ${vars.duration.base} ${vars.easing.standard}, ` +
      `border-color ${vars.duration.base} ${vars.easing.standard}, ` +
      `color ${vars.duration.base} ${vars.easing.standard}`,
    ':disabled': {
      cursor: 'not-allowed',
      opacity: 0.55,
    },
    ':focus-visible': {
      outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
      outlineOffset: vars.focus.ringOffset,
    },
  },
  variants: {
    intent: {
      primary: {
        background: vars.color.actionPrimary,
        color: vars.color.accentFg,
        selectors: {
          '&:hover:not(:disabled)': {
            background: vars.color.actionPrimaryHover,
          },
        },
      },
      secondary: {
        background: vars.color.actionSecondary,
        color: vars.color.fg,
        borderColor: vars.color.border,
        selectors: {
          '&:hover:not(:disabled)': {
            background: vars.color.actionSecondaryHover,
          },
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
          '&:hover:not(:disabled)': { background: vars.color.dangerHover },
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
    shape: {
      rect: {},
      square: {
        paddingInline: 0,
        flexShrink: 0,
      },
    },
  },
  compoundVariants: [
    {
      variants: { shape: 'square', size: 'sm' },
      style: { width: vars.space[8] },
    },
    {
      variants: { shape: 'square', size: 'md' },
      style: { width: vars.space[10] },
    },
    {
      variants: { shape: 'square', size: 'lg' },
      style: { width: vars.space[12] },
    },
  ],
  defaultVariants: {
    intent: 'primary',
    size: 'md',
    fullWidth: false,
    shape: 'rect',
  },
});
