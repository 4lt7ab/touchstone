import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const table = style({
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.sm,
  color: vars.color.fg,
});

export const head = style({});
export const body = style({});
export const foot = style({});

export const row = style({
  selectors: {
    '&[data-selected="true"]': {
      background: vars.color.actionSecondary,
    },
    [`${table}[data-striped="true"] ${body} &:nth-of-type(even)`]: {
      background: vars.color.bgMuted,
    },
    [`${table}[data-striped="true"] ${body} &:nth-of-type(even)[data-selected="true"]`]: {
      background: vars.color.actionSecondary,
    },
  },
});

const cellBase = {
  paddingBlock: vars.space[3],
  paddingInline: vars.space[4],
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.sm,
  lineHeight: vars.font.lineHeight.normal,
  verticalAlign: 'middle',
} as const;

const compactDensity = `${table}[data-density="compact"] &`;

export const headerCell = recipe({
  base: {
    ...cellBase,
    color: vars.color.fgMuted,
    fontWeight: vars.font.weight.semibold,
    letterSpacing: vars.letterSpacing.wide,
    textAlign: 'left',
    background: vars.color.bg,
    borderBottom: `${vars.borderWidth.thin} solid ${vars.color.border}`,
    selectors: {
      [compactDensity]: {
        paddingBlock: vars.space[2],
        paddingInline: vars.space[3],
      },
      [`${table}[data-sticky-header="true"] &`]: {
        position: 'sticky',
        top: 0,
        zIndex: vars.zIndex.sticky,
      },
    },
  },
  variants: {
    align: {
      start: { textAlign: 'left' },
      center: { textAlign: 'center' },
      end: { textAlign: 'right' },
      numeric: {
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
      },
    },
  },
  defaultVariants: { align: 'start' },
});

export const cell = recipe({
  base: {
    ...cellBase,
    color: vars.color.fg,
    textAlign: 'left',
    borderBottom: `${vars.borderWidth.thin} solid ${vars.color.border}`,
    selectors: {
      [compactDensity]: {
        paddingBlock: vars.space[2],
        paddingInline: vars.space[3],
      },
      [`${body} ${row}:last-of-type &`]: {
        borderBottom: 'none',
      },
      [`${foot} ${row} &`]: {
        borderTop: `${vars.borderWidth.thick} solid ${vars.color.border}`,
        borderBottom: 'none',
        fontWeight: vars.font.weight.semibold,
      },
    },
  },
  variants: {
    align: {
      start: { textAlign: 'left' },
      center: { textAlign: 'center' },
      end: { textAlign: 'right' },
      numeric: {
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
      },
    },
  },
  defaultVariants: { align: 'start' },
});

export const sortButton = style({
  background: 'none',
  border: 0,
  margin: 0,
  padding: 0,
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[2],
  cursor: 'pointer',
  font: 'inherit',
  color: 'inherit',
  letterSpacing: 'inherit',
  textAlign: 'inherit',
  transition: `color ${vars.duration.base} ${vars.easing.standard}`,
  selectors: {
    '&:hover': { color: vars.color.fg },
    '&:focus-visible': {
      outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
      outlineOffset: vars.focus.ringOffset,
      borderRadius: vars.radius.sm,
    },
  },
});

export const sortGlyph = style({
  width: '0.875em',
  height: '0.875em',
  flexShrink: 0,
  color: 'currentColor',
});

globalStyle(`${sortGlyph} > path[data-arm="asc"]`, { opacity: 0.35 });
globalStyle(`${sortGlyph} > path[data-arm="desc"]`, { opacity: 0.35 });
globalStyle(`${sortGlyph}[data-direction="asc"] > path[data-arm="asc"]`, {
  opacity: 1,
});
globalStyle(`${sortGlyph}[data-direction="desc"] > path[data-arm="desc"]`, {
  opacity: 1,
});

const selectCellBase = {
  ...cellBase,
  width: '1%',
  whiteSpace: 'nowrap',
  textAlign: 'center',
  borderBottom: `${vars.borderWidth.thin} solid ${vars.color.border}`,
} as const;

export const selectCell = style({
  ...selectCellBase,
  color: vars.color.fg,
  selectors: {
    [compactDensity]: {
      paddingBlock: vars.space[2],
      paddingInline: vars.space[3],
    },
    [`${body} ${row}:last-of-type &`]: {
      borderBottom: 'none',
    },
  },
});

export const selectHeaderCell = style({
  ...selectCellBase,
  color: vars.color.fgMuted,
  background: vars.color.bg,
  selectors: {
    [compactDensity]: {
      paddingBlock: vars.space[2],
      paddingInline: vars.space[3],
    },
    [`${table}[data-sticky-header="true"] &`]: {
      position: 'sticky',
      top: 0,
      zIndex: vars.zIndex.sticky,
    },
  },
});
