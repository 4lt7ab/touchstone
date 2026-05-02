import { keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

const enter = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

export const viewport = recipe({
  base: {
    position: 'fixed',
    zIndex: vars.zIndex.toast,
    display: 'flex',
    gap: vars.space[2],
    padding: vars.space[4],
    pointerEvents: 'none',
    maxWidth: '24rem',
    width: '100%',
    boxSizing: 'border-box',
  },
  variants: {
    placement: {
      'top-left': { top: 0, left: 0, flexDirection: 'column-reverse' },
      'top-right': { top: 0, right: 0, flexDirection: 'column-reverse' },
      'bottom-left': { bottom: 0, left: 0, flexDirection: 'column' },
      'bottom-right': { bottom: 0, right: 0, flexDirection: 'column' },
    },
  },
  defaultVariants: { placement: 'bottom-right' },
});

export const toast = recipe({
  base: {
    pointerEvents: 'auto',
    display: 'flex',
    alignItems: 'flex-start',
    gap: vars.space[2],
    padding: vars.space[3],
    borderRadius: vars.radius.md,
    boxShadow: vars.shadow.lg,
    border: '1px solid transparent',
    fontFamily: vars.font.family.sans,
    fontSize: vars.font.size.sm,
    lineHeight: vars.font.lineHeight.normal,
    background: vars.color.bgRaised,
    color: vars.color.fg,
    animation: `${enter} ${vars.duration.base} ${vars.easing.standard}`,
  },
  variants: {
    tone: {
      info: {
        background: vars.color.infoBg,
        color: vars.color.info,
        borderColor: vars.color.info,
      },
      success: {
        background: vars.color.successBg,
        color: vars.color.success,
        borderColor: vars.color.success,
      },
      warning: {
        background: vars.color.warningBg,
        color: vars.color.warning,
        borderColor: vars.color.warning,
      },
      danger: {
        background: vars.color.dangerBg,
        color: vars.color.danger,
        borderColor: vars.color.danger,
      },
    },
  },
  defaultVariants: { tone: 'info' },
});

export const body = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  minWidth: 0,
  color: vars.color.fg,
});

export const title = style({
  fontWeight: vars.font.weight.semibold,
});

export const trailing = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
  flexShrink: 0,
});
