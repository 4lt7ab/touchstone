import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const trigger = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space[2],
    width: '100%',
    paddingInline: vars.space[3],
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.radius.md,
    background: vars.color.bgInput,
    color: vars.color.fg,
    fontFamily: vars.font.family.sans,
    textAlign: 'left',
    cursor: 'pointer',
    transition:
      `border-color ${vars.duration.base} ${vars.easing.standard}, ` +
      `box-shadow ${vars.duration.base} ${vars.easing.standard}`,
    ':focus-visible': {
      outline: 'none',
      borderColor: vars.color.borderFocus,
      boxShadow: `0 0 0 ${vars.focus.ringWidth} ${vars.focus.ringColor}`,
    },
    ':disabled': {
      cursor: 'not-allowed',
      background: vars.color.bgDisabled,
      color: vars.color.fgDisabled,
    },
    selectors: {
      '&[aria-disabled="true"]': {
        cursor: 'not-allowed',
        background: vars.color.bgDisabled,
        color: vars.color.fgDisabled,
      },
    },
  },
  variants: {
    size: {
      sm: {
        minHeight: vars.space[8],
        fontSize: vars.font.size.sm,
      },
      md: {
        minHeight: vars.space[10],
        fontSize: vars.font.size.md,
      },
      lg: {
        minHeight: vars.space[12],
        fontSize: vars.font.size.md,
      },
    },
    shape: {
      select: {},
      badge: {
        width: 'auto',
        minHeight: 0,
        height: vars.space[5],
        gap: vars.space[1],
        paddingInline: vars.space[2],
        borderRadius: vars.radius.full,
        fontSize: vars.font.size.xs,
        fontWeight: vars.font.weight.medium,
        lineHeight: vars.font.lineHeight.tight,
        letterSpacing: vars.letterSpacing.wide,
      },
    },
    tone: {
      neutral: {},
      success: {},
      warning: {},
      danger: {},
      info: {},
      accent: {},
    },
    invalid: {
      true: {
        borderColor: vars.color.borderError,
        ':focus-visible': {
          borderColor: vars.color.borderError,
          boxShadow: `0 0 0 ${vars.focus.ringWidth} ${vars.color.borderError}`,
        },
      },
    },
    open: {
      true: {
        borderColor: vars.color.borderFocus,
      },
    },
  },
  compoundVariants: [
    {
      variants: { shape: 'badge', tone: 'neutral' },
      style: {
        background: vars.color.bgMuted,
        color: vars.color.fg,
        borderColor: 'transparent',
      },
    },
    {
      variants: { shape: 'badge', tone: 'success' },
      style: {
        background: vars.color.successBg,
        color: vars.color.success,
        borderColor: vars.color.success,
      },
    },
    {
      variants: { shape: 'badge', tone: 'warning' },
      style: {
        background: vars.color.warningBg,
        color: vars.color.warning,
        borderColor: vars.color.warning,
      },
    },
    {
      variants: { shape: 'badge', tone: 'danger' },
      style: {
        background: vars.color.dangerBg,
        color: vars.color.danger,
        borderColor: vars.color.danger,
      },
    },
    {
      variants: { shape: 'badge', tone: 'info' },
      style: {
        background: vars.color.infoBg,
        color: vars.color.info,
        borderColor: vars.color.info,
      },
    },
    {
      variants: { shape: 'badge', tone: 'accent' },
      style: {
        background: vars.color.actionPrimary,
        color: vars.color.accentFg,
        borderColor: 'transparent',
      },
    },
    {
      variants: { shape: 'badge', invalid: true },
      style: {
        borderColor: vars.color.borderError,
      },
    },
    {
      variants: { shape: 'badge', open: true },
      style: {
        borderColor: vars.color.borderFocus,
      },
    },
  ],
  defaultVariants: {
    size: 'md',
    shape: 'select',
    tone: 'neutral',
    invalid: false,
    open: false,
  },
});

export const triggerLabel = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const placeholder = style({
  color: vars.color.fgPlaceholder,
});

export const chevron = style({
  flexShrink: 0,
  width: '0.875rem',
  height: '0.875rem',
  opacity: 0.6,
});

export const chevronSm = style({
  flexShrink: 0,
  width: '0.6875rem',
  height: '0.6875rem',
  opacity: 0.7,
});

export const comboboxInput = recipe({
  base: {
    flex: 1,
    minWidth: 0,
    border: 'none',
    background: 'transparent',
    color: 'inherit',
    font: 'inherit',
    padding: 0,
    outline: 'none',
    '::placeholder': {
      color: vars.color.fgPlaceholder,
    },
    ':disabled': {
      cursor: 'not-allowed',
      color: vars.color.fgDisabled,
    },
  },
});

export const listbox = recipe({
  base: {
    listStyle: 'none',
    margin: 0,
    padding: vars.space[1],
    zIndex: vars.zIndex.popover,
    background: vars.color.bgRaised,
    color: vars.color.fg,
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.radius.md,
    boxShadow: vars.shadow.md,
    fontFamily: vars.font.family.sans,
    minWidth: '12rem',
    maxHeight: '20rem',
    overflowY: 'auto',
    outline: 'none',
  },
  variants: {
    size: {
      sm: { fontSize: vars.font.size.sm },
      md: { fontSize: vars.font.size.md },
      lg: { fontSize: vars.font.size.md },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const option = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: vars.space[2],
    paddingInline: vars.space[3],
    borderRadius: vars.radius.sm,
    color: vars.color.fg,
    cursor: 'pointer',
    userSelect: 'none',
    selectors: {
      '&[aria-disabled="true"]': {
        cursor: 'not-allowed',
        color: vars.color.fgDisabled,
      },
      '&[data-active="true"]:not([aria-disabled="true"])': {
        background: vars.color.bgMuted,
      },
    },
  },
  variants: {
    size: {
      sm: { minHeight: vars.space[8], paddingBlock: vars.space[1] },
      md: { minHeight: vars.space[10], paddingBlock: vars.space[2] },
      lg: { minHeight: vars.space[12], paddingBlock: vars.space[2] },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const optionLabel = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const optionGlyph = style({
  flexShrink: 0,
  width: '1rem',
  height: '1rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const checkboxBox = style({
  flexShrink: 0,
  width: '1rem',
  height: '1rem',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  background: vars.color.bgInput,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const checkboxBoxChecked = style({
  background: vars.color.accent,
  borderColor: vars.color.accent,
  color: vars.color.accentFg,
});

export const empty = style({
  padding: vars.space[3],
  color: vars.color.fgMuted,
  textAlign: 'center',
  fontSize: vars.font.size.sm,
});

export const groupLabel = style({
  paddingInline: vars.space[3],
  paddingBlock: vars.space[1],
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.medium,
  letterSpacing: vars.letterSpacing.wide,
  color: vars.color.fgMuted,
  textTransform: 'uppercase',
  userSelect: 'none',
});

export const listboxDivider = style({
  height: '1px',
  background: vars.color.border,
  margin: `${vars.space[1]} 0`,
  border: 'none',
  listStyle: 'none',
});

export const chipList = style({
  display: 'flex',
  flexWrap: 'wrap',
  flex: 1,
  minWidth: 0,
  gap: vars.space[1],
  alignItems: 'center',
  paddingBlock: vars.space[1],
});

export const chip = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
  paddingInline: vars.space[2],
  paddingBlock: '0.125rem',
  borderRadius: vars.radius.sm,
  background: vars.color.bgMuted,
  color: vars.color.fg,
  fontSize: vars.font.size.sm,
  maxWidth: '100%',
});

export const chipLabel = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const chipRemove = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '0.875rem',
  height: '0.875rem',
  border: 'none',
  background: 'transparent',
  color: 'currentColor',
  cursor: 'pointer',
  borderRadius: vars.radius.full,
  padding: 0,
  opacity: 0.7,
  ':hover': {
    opacity: 1,
    background: vars.color.bgRaised,
  },
  ':focus-visible': {
    outline: 'none',
    opacity: 1,
    boxShadow: `0 0 0 ${vars.focus.ringWidth} ${vars.focus.ringColor}`,
  },
});

