import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const badge = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space[1],
    paddingInline: vars.space[2],
    height: vars.space[5],
    borderRadius: vars.radius.full,
    fontFamily: vars.font.family.sans,
    fontSize: vars.font.size.xs,
    fontWeight: vars.font.weight.medium,
    lineHeight: vars.font.lineHeight.tight,
    letterSpacing: vars.letterSpacing.wide,
    border: `1px solid transparent`,
    whiteSpace: 'nowrap',
  },
  variants: {
    tone: {
      neutral: {
        background: vars.color.bgMuted,
        color: vars.color.fg,
      },
      success: {
        background: vars.color.successBg,
        color: vars.color.success,
        borderColor: vars.color.success,
      },
      warning: {
        background: vars.color.warningBg,
        color: vars.color.warning,
        borderColor: vars.color.warning,
      },
      danger: {
        background: vars.color.dangerBg,
        color: vars.color.danger,
        borderColor: vars.color.danger,
      },
      info: {
        background: vars.color.infoBg,
        color: vars.color.info,
        borderColor: vars.color.info,
      },
      accent: {
        background: vars.color.actionPrimary,
        color: vars.color.accentFg,
      },
    },
  },
  defaultVariants: {
    tone: 'neutral',
  },
});
