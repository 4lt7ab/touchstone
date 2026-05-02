import { style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

export const root = style({
  margin: 0,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.sm,
  lineHeight: vars.font.lineHeight.tight,
  color: vars.color.fgMuted,
});

export const list = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: vars.space[1],
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const item = style({
  display: 'inline-flex',
  alignItems: 'center',
  minWidth: 0,
  selectors: {
    '&:not(:first-child)::before': {
      content: '"/"',
      display: 'inline-block',
      paddingInline: vars.space[1],
      color: vars.color.fgMuted,
    },
  },
});

export const link = style({
  display: 'inline-block',
  color: 'inherit',
  textDecoration: 'none',
  borderRadius: vars.radius.sm,
  paddingInline: vars.space[1],
  transition: `color ${vars.duration.base} ${vars.easing.standard}`,
  selectors: {
    '&:hover': {
      color: vars.color.fg,
      textDecoration: 'underline',
    },
    '&:focus-visible': {
      outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
      outlineOffset: vars.focus.ringOffset,
    },
  },
});

export const current = style({
  display: 'inline-block',
  paddingInline: vars.space[1],
  color: vars.color.fg,
  fontWeight: vars.font.weight.medium,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
