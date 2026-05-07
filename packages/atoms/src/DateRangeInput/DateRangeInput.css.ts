import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

export const root = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space[2],
    width: '100%',
    height: vars.space[10],
    paddingLeft: vars.space[3],
    paddingRight: vars.space[3],
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.radius.md,
    background: vars.color.bgInput,
    color: vars.color.fg,
    fontFamily: vars.font.family.sans,
    fontSize: vars.font.size.md,
    minWidth: 0,
    transition:
      `border-color ${vars.duration.base} ${vars.easing.standard}, ` +
      `box-shadow ${vars.duration.base} ${vars.easing.standard}`,
    selectors: {
      '&:focus-within': {
        borderColor: vars.color.borderFocus,
        boxShadow: `0 0 0 ${vars.focus.ringWidth} ${vars.focus.ringColor}`,
      },
    },
    // Tighten gaps and padding on narrow viewports so the inline
    // start → end + adornment fits without horizontal overflow.
    '@media': {
      '(max-width: 600px)': {
        gap: vars.space[1],
        paddingLeft: vars.space[2],
      },
    },
  },
  variants: {
    invalid: {
      true: {
        borderColor: vars.color.borderError,
        selectors: {
          '&:focus-within': {
            borderColor: vars.color.borderError,
            boxShadow: `0 0 0 ${vars.focus.ringWidth} ${vars.color.borderError}`,
          },
        },
      },
    },
    disabled: {
      true: {
        cursor: 'not-allowed',
        background: vars.color.bgDisabled,
        color: vars.color.fgDisabled,
      },
    },
    /**
     * Drops the right padding when an adornment is present — the adornment
     * sits flush to the chrome edge with its own internal padding so it
     * lives at the edge instead of leaving a gap before the chrome border.
     */
    hasAdornment: {
      true: {
        paddingRight: 0,
      },
    },
  },
  defaultVariants: {
    invalid: false,
    disabled: false,
    hasAdornment: false,
  },
});

export const arrow = style({
  color: vars.color.fgMuted,
  fontSize: vars.font.size.sm,
  userSelect: 'none',
  flexShrink: 0,
});

/**
 * The end-adornment wrapper. Pulls flush to the chrome's right edge,
 * stretches to the chrome height so any button inside has a comfortable
 * full-height click target, and adds a thin divider on its left so the
 * adornment reads as a separate affordance instead of crowding the end
 * input's last segment.
 */
export const adornment = style({
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: 'auto',
  flexShrink: 0,
  alignSelf: 'stretch',
  paddingInline: vars.space[2],
  borderLeft: `1px solid ${vars.color.border}`,
  '@media': {
    // Drop the divider and inline padding on narrow viewports so the
    // adornment is just the icon button — every pixel earns its keep.
    '(max-width: 600px)': {
      paddingInline: 0,
      borderLeft: 'none',
    },
  },
});
