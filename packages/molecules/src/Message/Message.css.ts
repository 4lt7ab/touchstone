import { keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

const blink = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0 },
});

export const row = recipe({
  base: {
    display: 'flex',
    gap: vars.space[3],
    width: '100%',
    minWidth: 0,
  },
  variants: {
    align: {
      start: { flexDirection: 'row', justifyContent: 'flex-start' },
      end: { flexDirection: 'row-reverse', justifyContent: 'flex-start' },
      stretch: { flexDirection: 'row', justifyContent: 'flex-start' },
    },
  },
  defaultVariants: {
    align: 'start',
  },
});

export const column = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space[1],
    minWidth: 0,
  },
  variants: {
    align: {
      start: { alignItems: 'flex-start' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch', flex: 1 },
    },
  },
  defaultVariants: {
    align: 'start',
  },
});

export const header = style({
  display: 'inline-flex',
  alignItems: 'baseline',
  gap: vars.space[2],
  color: vars.color.fgMuted,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.xs,
});

export const authorName = style({
  color: vars.color.fg,
  fontWeight: vars.font.weight.semibold,
});

export const bubble = recipe({
  base: {
    maxWidth: '38rem',
    minWidth: 0,
    paddingBlock: vars.space[3],
    paddingInline: vars.space[4],
    borderRadius: vars.radius.lg,
    border: `1px solid transparent`,
    fontFamily: vars.font.family.sans,
    fontSize: vars.font.size.md,
    lineHeight: vars.font.lineHeight.normal,
    color: vars.color.fg,
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
  },
  variants: {
    author: {
      user: {
        background: vars.color.actionPrimary,
        color: vars.color.accentFg,
      },
      assistant: {
        background: vars.color.bgRaised,
        borderColor: vars.color.border,
      },
      system: {
        maxWidth: 'none',
        background: vars.color.bgMuted,
        color: vars.color.fgMuted,
        fontSize: vars.font.size.sm,
        textAlign: 'center',
      },
      tool: {
        maxWidth: 'none',
        background: vars.color.bgPanel,
        borderColor: vars.color.border,
        fontSize: vars.font.size.sm,
      },
    },
    state: {
      complete: {},
      streaming: {},
      error: {
        borderColor: vars.color.danger,
        background: vars.color.dangerBg,
        color: vars.color.danger,
      },
    },
  },
  defaultVariants: {
    author: 'assistant',
    state: 'complete',
  },
});

export const body = style({
  display: 'inline',
});

export const caret = style({
  display: 'inline-block',
  width: '0.6ch',
  height: '1em',
  marginInlineStart: '0.15em',
  verticalAlign: '-0.15em',
  background: 'currentColor',
  borderRadius: '1px',
  animation: `${blink} 1s steps(2, start) infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      opacity: 0.7,
    },
  },
});

export const actionRow = style({
  display: 'flex',
  width: '100%',
});
