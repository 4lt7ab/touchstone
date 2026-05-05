import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@touchstone/themes';

export const root = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: vars.space[3],
    padding: vars.space[2],
    paddingInline: vars.space[3],
    border: '1px solid transparent',
    borderRadius: vars.radius.md,
    background: 'transparent',
    color: vars.color.fg,
    fontFamily: vars.font.family.sans,
    fontSize: vars.font.size.sm,
    lineHeight: vars.font.lineHeight.tight,
    textAlign: 'left',
    cursor: 'pointer',
    minWidth: 0,
    transition: `background-color ${vars.duration.fast} ${vars.easing.standard}`,
    selectors: {
      '&[aria-disabled="true"]': {
        cursor: 'not-allowed',
        opacity: 0.55,
      },
      '&:focus-visible': {
        outline: 'none',
      },
    },
  },
  variants: {
    highlighted: {
      true: {
        background: vars.color.bgMuted,
        color: vars.color.fg,
      },
      false: {},
    },
    tone: {
      default: {},
      danger: {
        color: vars.color.danger,
        selectors: {
          '&[aria-selected="true"], &[data-highlighted="true"]': {
            background: vars.color.dangerBg,
            color: vars.color.danger,
          },
        },
      },
    },
  },
  defaultVariants: {
    highlighted: false,
    tone: 'default',
  },
});

export const iconSlot = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: vars.space[5],
  height: vars.space[5],
  color: vars.color.fgSecondary,
});

export const textBlock = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const label = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontWeight: vars.font.weight.medium,
});

export const description = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: vars.color.fgMuted,
  fontSize: vars.font.size.xs,
});

export const trailingSlot = style({
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
  marginInlineStart: vars.space[2],
  color: vars.color.fgMuted,
  fontSize: vars.font.size.xs,
});
