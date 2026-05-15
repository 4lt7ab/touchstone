import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const root = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space[2],
    padding: vars.space[2],
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.radius.lg,
    background: vars.color.bgInput,
    transition: `border-color ${vars.duration.base} ${vars.easing.standard}`,
    selectors: {
      '&:focus-within': {
        borderColor: vars.color.borderFocus,
      },
    },
  },
  variants: {
    state: {
      idle: {},
      sending: { opacity: 0.85 },
      streaming: { opacity: 0.9 },
      disabled: {
        opacity: 0.55,
        cursor: 'not-allowed',
      },
    },
  },
  defaultVariants: { state: 'idle' },
});

export const textareaRow = style({
  display: 'flex',
  alignItems: 'flex-start',
});

export const textarea = style({
  flex: 1,
  minWidth: 0,
  display: 'block',
  width: '100%',
  paddingBlock: vars.space[2],
  paddingInline: vars.space[3],
  border: 'none',
  background: 'transparent',
  color: vars.color.fg,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.md,
  lineHeight: vars.font.lineHeight.normal,
  resize: 'none',
  outline: 'none',
  selectors: {
    '&::placeholder': { color: vars.color.fgPlaceholder },
    '&:disabled': { cursor: 'not-allowed' },
  },
});

export const footer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[2],
  paddingInline: vars.space[1],
});

export const leftCluster = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
});

export const rightCluster = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[2],
});

export const meta = style({
  color: vars.color.fgMuted,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.xs,
});
