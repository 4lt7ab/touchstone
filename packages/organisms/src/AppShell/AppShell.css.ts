import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
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

export const skipLink = style({
  position: 'absolute',
  insetInlineStart: vars.space[3],
  insetBlockStart: vars.space[3],
  zIndex: vars.zIndex.toast,
  padding: `${vars.space[2]} ${vars.space[4]}`,
  borderRadius: vars.radius.md,
  background: vars.color.bgRaised,
  color: vars.color.fg,
  border: `1px solid ${vars.color.border}`,
  boxShadow: vars.shadow.md,
  fontSize: vars.font.size.sm,
  textDecoration: 'none',
  clipPath: 'inset(50%)',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  selectors: {
    '&:focus': {
      clipPath: 'none',
      width: 'auto',
      height: 'auto',
      overflow: 'visible',
      outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
      outlineOffset: vars.focus.ringOffset,
    },
    '&:focus-visible': {
      clipPath: 'none',
      width: 'auto',
      height: 'auto',
      overflow: 'visible',
      outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
      outlineOffset: vars.focus.ringOffset,
    },
  },
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
    // via Escape or the backdrop.
    '&[aria-expanded="true"]': {
      '@media': {
        [MOBILE_BREAKPOINT]: {
          zIndex: vars.zIndex.popover,
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

export const inspectorSlot = style({
  flexShrink: 0,
  alignSelf: 'stretch',
  borderInlineStart: `1px solid ${vars.color.border}`,
  // Inspector is binary on desktop (visible or display:none) and always
  // hidden on mobile — the consumer is free to render its content elsewhere
  // when the viewport can't host two persistent rails.
  '@media': {
    [MOBILE_BREAKPOINT]: {
      display: 'none',
    },
  },
  selectors: {
    '&[data-open="false"]': {
      display: 'none',
    },
  },
});

// Sticky expand affordance docked to the trailing edge when the inspector
// is closed. Without this the panel is invisible to a cold viewer — they'd
// only know to press ⌘I if they'd read the docs.
export const inspectorEdgeTab = style({
  position: 'absolute',
  insetBlockStart: '50%',
  insetInlineEnd: 0,
  transform: 'translateY(-50%)',
  width: vars.space[5],
  height: vars.space[16],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: vars.color.bgRaised,
  color: vars.color.fgMuted,
  border: `1px solid ${vars.color.border}`,
  borderInlineEnd: 'none',
  borderStartStartRadius: vars.radius.md,
  borderEndStartRadius: vars.radius.md,
  cursor: 'pointer',
  padding: 0,
  zIndex: 1,
  transition:
    `background-color ${vars.duration.fast} ${vars.easing.standard}, ` +
    `color ${vars.duration.fast} ${vars.easing.standard}`,
  '@media': {
    [MOBILE_BREAKPOINT]: {
      // Inspector is hidden entirely on mobile; the tab follows suit.
      display: 'none',
    },
  },
  selectors: {
    '&:hover': {
      background: vars.color.bgMuted,
      color: vars.color.fg,
    },
    '&:focus-visible': {
      outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
      outlineOffset: vars.focus.ringOffset,
    },
  },
});

// Drag handle that sits in the seam between rail and main. 4px wide hit
// zone with a 1px visible line drawn via ::before so the affordance is
// generous but the visual stays thin. Cursor signals the resize.
export const resizeHandle = style({
  flexShrink: 0,
  width: '6px',
  marginInline: '-3px',
  cursor: 'ew-resize',
  position: 'relative',
  zIndex: 1,
  background: 'transparent',
  border: 'none',
  padding: 0,
  alignSelf: 'stretch',
  touchAction: 'none',
  '@media': {
    [MOBILE_BREAKPOINT]: {
      // No drag on mobile — the rail collapses into the overlay and the
      // inspector hides outright. Hide the handle to match.
      display: 'none',
    },
  },
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      insetInline: '2.5px',
      insetBlock: 0,
      background: 'transparent',
      transition: `background-color ${vars.duration.fast} ${vars.easing.standard}`,
    },
    '&:hover::before': {
      background: vars.color.borderFocus,
    },
    '&:focus-visible': {
      outline: `${vars.focus.ringWidth} solid ${vars.focus.ringColor}`,
      outlineOffset: vars.focus.ringOffset,
    },
    '&[data-dragging="true"]::before': {
      background: vars.color.accent,
    },
  },
});

// Keyboard cheat-sheet dialog body — a few small flex containers with
// monospace key labels on the trailing edge.
export const hintList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
});

export const hintGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
});

export const hintGroupHeading = style({
  margin: 0,
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.semibold,
  textTransform: 'uppercase',
  letterSpacing: vars.letterSpacing.wide,
  color: vars.color.fgMuted,
});

export const hintRows = style({
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
});

export const hintRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[4],
  paddingBlock: vars.space[2],
  borderBlockEnd: `1px solid ${vars.color.border}`,
  selectors: {
    '&:last-of-type': { borderBlockEnd: 'none' },
  },
});

export const hintDescription = style({
  margin: 0,
  fontSize: vars.font.size.sm,
  color: vars.color.fg,
});

export const hintKeys = style({
  margin: 0,
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
});

export const main = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    overflowY: 'auto',
  },
  variants: {
    density: {
      comfortable: {
        padding: vars.space[8],
        gap: vars.space[8],
      },
      default: {
        padding: vars.space[6],
        gap: vars.space[6],
      },
      compact: {
        padding: vars.space[3],
        gap: vars.space[3],
      },
    },
    // Escape hatch — `padded: false` zeroes padding regardless of density,
    // for consumers who own their own inner layout (chat columns, full-
    // bleed canvases, viewer surfaces).
    padded: {
      true: {},
      false: { padding: 0, gap: 0 },
    },
  },
  defaultVariants: {
    density: 'default',
    padded: true,
  },
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
