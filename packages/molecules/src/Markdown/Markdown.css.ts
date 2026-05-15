import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';
import * as prose from '../Prose/Prose.css.js';

export const tableWrap = style({
  marginTop: vars.space[4],
  marginBottom: vars.space[4],
  overflowX: 'auto',
});

// The wrapper carries the rhythm; the inner table loses Prose's table margin
// so there's no doubled top/bottom space inside the overflow box. `width:
// max-content` lets long rows push the table past the wrapper's edge so the
// overflow scroll actually has somewhere to go — `min-width: 100%` keeps
// short tables flush with the surrounding column.
globalStyle(`${tableWrap} > table`, {
  marginTop: 0,
  marginBottom: 0,
  width: 'max-content',
  minWidth: '100%',
});

// Match Prose's compact-density table rhythm on the wrapper.
globalStyle(`${prose.root}[data-density="compact"] ${tableWrap}`, {
  marginTop: vars.space[3],
  marginBottom: vars.space[3],
});

