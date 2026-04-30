import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

export const root = recipe({
  base: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: vars.space[3],
    padding: vars.space[3],
    borderRadius: vars.radius.md,
    border: `1px solid transparent`,
    fontFamily: vars.font.family.sans,
    fontSize: vars.font.size.sm,
    lineHeight: vars.font.lineHeight.normal,
  },
  variants: {
    tone: {
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
    },
  },
  defaultVariants: {
    tone: 'info',
  },
});

export const body = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  color: vars.color.fg,
});

export const title = style({
  fontWeight: vars.font.weight.semibold,
});
