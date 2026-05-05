import { style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

const MOBILE_BREAKPOINT = '(max-width: 959px)';
const DESKTOP_BREAKPOINT = '(min-width: 960px)';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  width: '100%',
  background: vars.color.bgPage,
  color: vars.color.fg,
});

export const headerRow = style({
  display: 'flex',
  alignItems: 'stretch',
  flexShrink: 0,
});

export const headerSlot = style({
  flex: 1,
  minWidth: 0,
});

export const menuTrigger = style({
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: vars.space[10],
  height: vars.space[10],
  margin: vars.space[2],
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  background: vars.color.bgRaised,
  color: vars.color.fg,
  cursor: 'pointer',
  position: 'relative',
  transition:
    `background-color ${vars.duration.fast} ${vars.easing.standard}, ` +
    `border-color ${vars.duration.fast} ${vars.easing.standard}`,
  '@media': {
    [MOBILE_BREAKPOINT]: {
      display: 'inline-flex',
    },
  },
  selectors: {
    '&:hover': { background: vars.color.bgMuted },
    '&:focus-visible': {
      outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
      outlineOffset: vars.focus.ringOffset,
    },
    // While the overlay is open, lift the trigger above the sidebar so the
    // user can still tap it to close. Without this, the slid-in sidebar
    // (zIndex.modal) intercepts the click and the menu can only be closed
    // via Escape or the backdrop. Literal value rather than vars.zIndex.popover
    // because the same var hash differs between packages in some build paths.
    '&[aria-expanded="true"]': {
      '@media': {
        [MOBILE_BREAKPOINT]: {
          zIndex: 1500,
        },
      },
    },
  },
});

export const menuTriggerStandalone = style({
  '@media': {
    [MOBILE_BREAKPOINT]: {
      position: 'fixed',
      top: vars.space[3],
      left: vars.space[3],
      zIndex: vars.zIndex.sticky,
    },
  },
});

export const bodyRow = style({
  display: 'flex',
  flex: 1,
  minHeight: 0,
  position: 'relative',
});

export const sidebarSlot = style({
  flexShrink: 0,
  alignSelf: 'stretch',
  '@media': {
    [MOBILE_BREAKPOINT]: {
      position: 'fixed',
      insetBlockStart: 0,
      insetInlineStart: 0,
      blockSize: '100vh',
      zIndex: vars.zIndex.modal,
      transform: 'translateX(-100%)',
      transition: `transform ${vars.duration.base} ${vars.easing.standard}`,
      boxShadow: vars.shadow.lg,
    },
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
  selectors: {
    '&[data-mobile-open="true"]': {
      '@media': {
        [MOBILE_BREAKPOINT]: {
          transform: 'translateX(0)',
        },
      },
    },
  },
});

export const backdrop = style({
  display: 'none',
  position: 'fixed',
  inset: 0,
  background: vars.color.bgVeil,
  zIndex: vars.zIndex.overlay,
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  '@media': {
    [MOBILE_BREAKPOINT]: {
      display: 'block',
    },
  },
});

export const main = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  overflowY: 'auto',
  padding: vars.space[6],
  gap: vars.space[6],
});

// Pure-CSS helpers used by tests / consumers that want to know which mode
// is active. Don't read these in component code — read it through
// useMediaQuery instead.
export const onlyMobile = style({
  '@media': {
    [DESKTOP_BREAKPOINT]: {
      display: 'none !important',
    },
  },
});

export const onlyDesktop = style({
  '@media': {
    [MOBILE_BREAKPOINT]: {
      display: 'none !important',
    },
  },
});
