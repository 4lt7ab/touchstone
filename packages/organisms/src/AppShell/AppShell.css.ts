import { style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  width: '100%',
  background: vars.color.bgPage,
  color: vars.color.fg,
});

export const headerSlot = style({
  flexShrink: 0,
});

export const bodyRow = style({
  display: 'flex',
  flex: 1,
  minHeight: 0,
});

export const sidebarSlot = style({
  flexShrink: 0,
  alignSelf: 'stretch',
});

export const main = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  overflowY: 'auto',
  padding: vars.space[6],
  gap: vars.space[6],
});
