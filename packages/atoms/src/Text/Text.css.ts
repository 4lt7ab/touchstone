import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const text = recipe({
  base: {
    margin: 0,
    fontFamily: vars.font.family.sans,
    color: vars.color.fg,
  },
  variants: {
    size: {
      xs: { fontSize: vars.font.size.xs, lineHeight: vars.font.lineHeight.normal },
      sm: { fontSize: vars.font.size.sm, lineHeight: vars.font.lineHeight.normal },
      md: { fontSize: vars.font.size.md, lineHeight: vars.font.lineHeight.normal },
      lg: { fontSize: vars.font.size.lg, lineHeight: vars.font.lineHeight.normal },
      xl: { fontSize: vars.font.size.xl, lineHeight: vars.font.lineHeight.tight },
      '2xl': { fontSize: vars.font.size['2xl'], lineHeight: vars.font.lineHeight.tight },
    },
    weight: {
      regular: { fontWeight: vars.font.weight.regular },
      medium: { fontWeight: vars.font.weight.medium },
      semibold: { fontWeight: vars.font.weight.semibold },
      bold: { fontWeight: vars.font.weight.bold },
    },
    tone: {
      default: { color: vars.color.fg },
      muted: { color: vars.color.fgMuted },
      accent: { color: vars.color.accent },
      danger: { color: vars.color.danger },
    },
  },
  defaultVariants: {
    size: 'md',
    weight: 'regular',
    tone: 'default',
  },
});
