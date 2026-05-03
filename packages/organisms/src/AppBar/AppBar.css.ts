import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const appBar = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: vars.space[4],
    paddingInline: vars.space[5],
    minWidth: 0,
    width: '100%',
    background: vars.color.bgSolid,
    color: vars.color.fg,
  },
  variants: {
    height: {
      sm: { minHeight: vars.space[10] },
      md: { minHeight: vars.space[12] },
    },
    divider: {
      true: { borderBlockEnd: `1px solid ${vars.color.border}` },
      false: {},
    },
    sticky: {
      true: {
        position: 'sticky',
        insetBlockStart: 0,
        zIndex: vars.zIndex.sticky,
      },
      false: {},
    },
  },
  defaultVariants: {
    height: 'md',
    divider: true,
    sticky: false,
  },
});

export const brand = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  flexShrink: 0,
  fontFamily: vars.font.family.display ?? vars.font.family.sans,
  fontWeight: vars.font.weight.semibold,
  fontSize: vars.font.size.md,
  color: vars.color.fg,
});

export const center = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  flex: 1,
  minWidth: 0,
});

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  flexShrink: 0,
  marginInlineStart: 'auto',
});
