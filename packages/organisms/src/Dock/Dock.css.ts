import { keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

const slideUp = keyframes({
  from: { transform: 'translateY(100%)' },
  to: { transform: 'translateY(0)' },
});

// The dock floats at the bottom edge of the viewport — it doesn't take
// layout space, doesn't trap focus, doesn't cover the page with a backdrop.
// `position: fixed` + `inset-inline: 0` + `inset-block-end: 0` pin it.
// Sits at zIndex.sticky so modals (zIndex.modal) and popovers
// (zIndex.popover) float above it.
export const panel = recipe({
  base: {
    position: 'fixed',
    insetInline: 0,
    insetBlockEnd: 0,
    zIndex: vars.zIndex.sticky,
    background: vars.color.bgRaised,
    color: vars.color.fg,
    fontFamily: vars.font.family.sans,
    boxShadow: vars.shadow.lg,
    borderBlockStart: `${vars.borderWidth.thin} solid ${vars.color.border}`,
    borderStartStartRadius: vars.radius.lg,
    borderStartEndRadius: vars.radius.lg,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    overflow: 'hidden',
    animation: `${slideUp} ${vars.duration.base} ${vars.easing.emphasized}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        animation: 'none',
      },
    },
  },
  variants: {
    size: {
      sm: { height: '8rem', maxHeight: '40vh' },
      md: { height: '18rem', maxHeight: '60vh' },
      lg: { height: '28rem', maxHeight: '80vh' },
    },
    width: {
      // Edge-to-edge — the default. The dock pins to both viewport edges
      // and gets rounded only on the top corners (the bottom corners meet
      // the viewport).
      full: {},
      // Centered reading column. `inset-inline: 0` plus `margin-inline:
      // auto` distributes remaining space evenly. A bottom gutter lets
      // the panel float free of the viewport edge, and the bottom corners
      // get rounded too so the panel reads as a self-contained surface —
      // the natural shape for an AI chatbox or a "ask the workshop" pill.
      reading: {
        maxWidth: '40rem',
        marginInline: 'auto',
        insetBlockEnd: vars.space[4],
        borderEndStartRadius: vars.radius.lg,
        borderEndEndRadius: vars.radius.lg,
        borderInlineStart: `${vars.borderWidth.thin} solid ${vars.color.border}`,
        borderInlineEnd: `${vars.borderWidth.thin} solid ${vars.color.border}`,
      },
    },
  },
  defaultVariants: {
    size: 'md',
    width: 'full',
  },
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  paddingBlock: vars.space[2],
  paddingInline: vars.space[4],
  borderBlockEnd: `${vars.borderWidth.thin} solid ${vars.color.border}`,
  flexShrink: 0,
});

export const title = style({
  margin: 0,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  letterSpacing: vars.letterSpacing.wide,
  color: vars.color.fg,
  flex: 1,
  minWidth: 0,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const actions = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
  flexShrink: 0,
});

export const body = recipe({
  base: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  variants: {
    padded: {
      // `padded: true` matches the standard chrome — comfortable interior
      // padding and gap for log entries / status rows.
      true: {
        padding: vars.space[4],
        gap: vars.space[3],
      },
      // `padded: false` zeroes the body box so the consumer can fill the
      // whole panel themselves (used by chrome="bare", which expects an
      // edge-to-edge inner surface like a Composer).
      false: {},
    },
  },
  defaultVariants: {
    padded: true,
  },
});
