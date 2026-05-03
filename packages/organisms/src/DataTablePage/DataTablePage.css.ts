import { style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
  minWidth: 0,
});

export const filterBar = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  flexWrap: 'wrap',
  paddingBlockEnd: vars.space[3],
  borderBlockEnd: `1px solid ${vars.color.border}`,
});

export const tableSlot = style({
  minWidth: 0,
  overflowX: 'auto',
});

export const paginationSlot = style({
  display: 'flex',
  justifyContent: 'flex-end',
  paddingBlockStart: vars.space[2],
});

export const emptySlot = style({
  display: 'block',
  minWidth: 0,
});
