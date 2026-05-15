import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const sidebar = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    background: vars.color.bgSolid,
    color: vars.color.fg,
    transition:
      `width ${vars.duration.base} ${vars.easing.standard}, ` +
      `min-width ${vars.duration.base} ${vars.easing.standard}`,
  },
  variants: {
    // The variants set both width and minWidth, but read through a CSS
    // custom property first — when AppShell drives a live drag preview it
    // sets `--touchstone-sidebar-rail-width` on the slot wrapper and the
    // variant value becomes the fallback. Without the var set, behaviour is
    // exactly the same as before this change.
    width: {
      sm: {
        width: `var(--touchstone-sidebar-rail-width, ${vars.space[12]})`,
        minWidth: `var(--touchstone-sidebar-rail-width, ${vars.space[12]})`,
      },
      md: {
        width: 'var(--touchstone-sidebar-rail-width, 15rem)',
        minWidth: 'var(--touchstone-sidebar-rail-width, 15rem)',
      },
      lg: {
        width: 'var(--touchstone-sidebar-rail-width, 18rem)',
        minWidth: 'var(--touchstone-sidebar-rail-width, 18rem)',
      },
    },
    divider: {
      true: { borderInlineEnd: `1px solid ${vars.color.border}` },
      false: {},
    },
    height: {
      full: { height: '100%' },
      auto: {},
    },
    collapsed: {
      true: {
        width: vars.space[16],
        minWidth: vars.space[16],
      },
      false: {},
    },
  },
  defaultVariants: {
    width: 'md',
    divider: true,
    height: 'full',
    collapsed: false,
  },
});

export const headerCompact = style({
  paddingInline: vars.space[2],
  justifyContent: 'center',
});

export const footerCompact = style({
  paddingInline: vars.space[2],
  justifyContent: 'center',
});

export const bodyCompact = style({
  paddingInline: vars.space[2],
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  padding: vars.space[4],
  borderBlockEnd: `1px solid ${vars.color.border}`,
  flexShrink: 0,
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  padding: vars.space[3],
  overflowY: 'auto',
  flex: 1,
  minHeight: 0,
});

export const footer = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  padding: vars.space[4],
  borderBlockStart: `1px solid ${vars.color.border}`,
  flexShrink: 0,
});
