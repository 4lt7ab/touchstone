import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
});

export const trigger = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: vars.space[3],
    width: '100%',
    paddingBlock: vars.space[3],
    paddingInline: vars.space[4],
    border: 'none',
    borderRadius: vars.radius.md,
    background: 'transparent',
    color: vars.color.fg,
    fontFamily: vars.font.family.sans,
    fontSize: vars.font.size.md,
    fontWeight: vars.font.weight.medium,
    lineHeight: vars.font.lineHeight.tight,
    cursor: 'pointer',
    textAlign: 'left',
    transition: `background-color ${vars.duration.base} ${vars.easing.standard}`,
    selectors: {
      '&:hover': { background: vars.color.bgMuted },
      '&:focus-visible': {
        outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
        outlineOffset: vars.focus.ringOffset,
      },
    },
  },
  variants: {},
});

export const triggerLabel = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const chevron = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.fgMuted,
  transform: 'rotate(0deg)',
  transition: `transform ${vars.duration.base} ${vars.easing.standard}`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
  selectors: {
    '&[data-open="true"]': {
      transform: 'rotate(180deg)',
    },
  },
});

export const content = style({
  paddingBlock: vars.space[3],
  paddingInline: vars.space[4],
  color: vars.color.fg,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.md,
  lineHeight: vars.font.lineHeight.normal,
});

export const peek = style({
  position: 'relative',
  overflow: 'hidden',
  WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
  maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
});
