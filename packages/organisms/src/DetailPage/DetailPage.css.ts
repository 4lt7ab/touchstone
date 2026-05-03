import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const root = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: vars.space[6],
  minWidth: 0,
});

export const rootWithPanel = style({
  '@media': {
    '(min-width: 960px)': {
      gridTemplateColumns: 'minmax(0, 1fr) 22rem',
      alignItems: 'start',
    },
  },
});

export const main = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
  minWidth: 0,
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  paddingBlockEnd: vars.space[4],
  borderBlockEnd: `1px solid ${vars.color.border}`,
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

export const title = style({
  margin: 0,
  fontFamily: vars.font.family.display ?? vars.font.family.sans,
  fontSize: vars.font.size['2xl'],
  fontWeight: vars.font.weight.bold,
  lineHeight: vars.font.lineHeight.tight,
  color: vars.color.fg,
});

export const subtitle = style({
  margin: 0,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.md,
  color: vars.color.fgMuted,
});

export const actionsSlot = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[2],
  flexWrap: 'wrap',
  flexShrink: 0,
});

export const meta = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))',
  gap: vars.space[3],
  margin: 0,
  padding: 0,
});

export const metaItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
});

export const metaLabel = style({
  margin: 0,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.medium,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.wide,
  color: vars.color.fgMuted,
});

export const metaValue = style({
  margin: 0,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.md,
  color: vars.color.fg,
});

export const body = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space[4],
    minWidth: 0,
  },
  variants: {},
});

export const rightPanel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  minWidth: 0,
  '@media': {
    '(min-width: 960px)': {
      position: 'sticky',
      top: vars.space[4],
    },
  },
});
