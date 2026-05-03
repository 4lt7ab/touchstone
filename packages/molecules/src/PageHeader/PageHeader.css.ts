import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const pageHeader = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space[2],
    paddingBlockEnd: vars.space[4],
    minWidth: 0,
  },
  variants: {
    divider: {
      true: {
        borderBlockEnd: `1px solid ${vars.color.border}`,
        marginBlockEnd: vars.space[4],
      },
      false: {},
    },
  },
  defaultVariants: {
    divider: false,
  },
});

export const breadcrumbs = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[1],
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.sm,
  color: vars.color.fgMuted,
});

export const headingRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space[4],
  flexWrap: 'wrap',
});

export const titleBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  flex: 1,
  minWidth: 0,
});

export const titleRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  flexWrap: 'wrap',
});

export const title = style({
  margin: 0,
  fontFamily: vars.font.family.display ?? vars.font.family.sans,
  fontSize: vars.font.size['2xl'],
  fontWeight: vars.font.weight.bold,
  lineHeight: vars.font.lineHeight.tight,
  color: vars.color.fg,
});

export const description = style({
  margin: 0,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.md,
  lineHeight: vars.font.lineHeight.normal,
  color: vars.color.fgMuted,
  maxWidth: '60ch',
});

export const meta = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[2],
});

export const actions = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[2],
  flexWrap: 'wrap',
  flexShrink: 0,
});
