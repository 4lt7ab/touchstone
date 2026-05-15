import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const marker = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '1.4em',
    height: '1.4em',
    paddingInline: '0.35em',
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.radius.full,
    background: vars.color.bgRaised,
    color: vars.color.fgMuted,
    fontFamily: vars.font.family.sans,
    fontSize: '0.75em',
    fontWeight: vars.font.weight.semibold,
    lineHeight: 1,
    verticalAlign: '0.2em',
    cursor: 'pointer',
    transition: `background-color ${vars.duration.fast} ${vars.easing.standard}`,
    selectors: {
      '&:hover, &:focus-visible': {
        background: vars.color.bgMuted,
        color: vars.color.fg,
      },
      '&:focus-visible': {
        outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
        outlineOffset: vars.focus.ringOffset,
      },
    },
  },
  variants: {
    tone: {
      neutral: {},
      accent: {
        borderColor: vars.color.accent,
        color: vars.color.accent,
      },
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  maxWidth: '22rem',
  padding: vars.space[3],
});

export const title = style({
  fontWeight: vars.font.weight.semibold,
  color: vars.color.fg,
});

export const snippet = style({
  color: vars.color.fgMuted,
  fontSize: vars.font.size.sm,
  lineHeight: vars.font.lineHeight.normal,
});

export const link = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
  color: vars.color.fgLink,
  fontSize: vars.font.size.sm,
  textDecoration: 'none',
  selectors: {
    '&:hover, &:focus-visible': { textDecoration: 'underline' },
  },
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  padding: 0,
  margin: 0,
  listStyle: 'none',
});

export const listItem = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space[2],
  fontSize: vars.font.size.sm,
  color: vars.color.fgMuted,
});

export const listIndex = style({
  flexShrink: 0,
  minWidth: '1.6em',
  fontFamily: vars.font.family.mono,
  fontSize: vars.font.size.xs,
  color: vars.color.fgMuted,
});
