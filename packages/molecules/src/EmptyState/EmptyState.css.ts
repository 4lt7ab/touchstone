import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const root = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: vars.space[3],
    color: vars.color.fg,
  },
  variants: {
    level: {
      section: {
        paddingBlock: vars.space[8],
        paddingInline: vars.space[6],
      },
      page: {
        minHeight: '60vh',
        justifyContent: 'center',
        paddingBlock: vars.space[12],
        paddingInline: vars.space[6],
      },
    },
  },
  defaultVariants: {
    level: 'section',
  },
});

export const icon = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: vars.color.fgMuted,
  },
  variants: {
    level: {
      section: {
        width: vars.space[10],
        height: vars.space[10],
      },
      page: {
        width: vars.space[16],
        height: vars.space[16],
      },
    },
  },
  defaultVariants: {
    level: 'section',
  },
});

export const title = recipe({
  base: {
    margin: 0,
    fontFamily: vars.font.family.display ?? vars.font.family.sans,
    fontWeight: vars.font.weight.semibold,
    lineHeight: vars.font.lineHeight.tight,
    color: vars.color.fg,
  },
  variants: {
    level: {
      section: { fontSize: vars.font.size.lg },
      page: { fontSize: vars.font.size['3xl'] },
    },
  },
  defaultVariants: {
    level: 'section',
  },
});

export const description = style({
  margin: 0,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.md,
  lineHeight: vars.font.lineHeight.normal,
  color: vars.color.fgMuted,
  maxWidth: '52ch',
});

export const actions = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[2],
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginBlockStart: vars.space[2],
});
