import { cloneElement, forwardRef, isValidElement } from 'react';
import type {
  AriaAttributes,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { Slot } from '@touchstone/atoms';
import type { BaseComponentProps } from '@touchstone/atoms';
import { iconSlot, labelSlot, navItem, trailingSlot } from './NavItem.css.js';

type NavItemVariants = NonNullable<RecipeVariants<typeof navItem>>;

/**
 * Navigation row for sidebars, settings menus, command palettes, and dropdown
 * lists. Composes a leading `icon`, a label (`children`), and an optional
 * `trailing` slot (count, badge, keyboard hint, chevron) into a focusable row
 * with hover, focus, selected, and disabled visuals.
 *
 * `selected` applies the active visual and sets `aria-current="page"`. Pass
 * an explicit `aria-current` to override (e.g. `step`, `location`) for non-
 * page navigation. Pair with `asChild` to forward the row onto an `<a>` or
 * a router `<Link>`; when `asChild` is set, the child element's children
 * become the label, and `icon` / `trailing` still render in their slots.
 */
export interface NavItemProps extends BaseComponentProps, NavItemVariants {
  /** Visible label content. Becomes the row's accessible name. */
  children?: ReactNode;
  /** Leading element — typically an icon. Hidden from assistive tech via `aria-hidden`. */
  icon?: ReactNode;
  /** Trailing element — badge, count, keyboard hint, chevron. */
  trailing?: ReactNode;
  /** Mark the row as the active navigation target. @default false */
  selected?: boolean;
  /** Disable the row. Click handlers won't fire and the recipe applies the disabled style. */
  disabled?: boolean;
  /** Click handler. */
  onClick?: MouseEventHandler<HTMLElement>;
  /** Keyboard handler — used by parent surfaces (e.g. NavSection) for roving focus. */
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
  /** Tab order — typically managed by a parent's roving focus. */
  tabIndex?: number;
  /**
   * Render as the immediate child element instead of `<button>`. Use to
   * forward NavItem styling onto an `<a>` or a router `<Link>`. The child's
   * `children` become the label slot; `icon` / `trailing` still render.
   */
  asChild?: boolean;
  'aria-label'?: AriaAttributes['aria-label'];
  'aria-current'?: AriaAttributes['aria-current'];
  'aria-describedby'?: AriaAttributes['aria-describedby'];
  'aria-haspopup'?: AriaAttributes['aria-haspopup'];
  'aria-expanded'?: AriaAttributes['aria-expanded'];
  'aria-controls'?: AriaAttributes['aria-controls'];
}

export const NavItem = forwardRef<HTMLElement, NavItemProps>(function NavItem(
  {
    size,
    selected = false,
    disabled = false,
    asChild = false,
    icon,
    trailing,
    children,
    'aria-current': ariaCurrent,
    ...rest
  },
  ref,
) {
  const recipeClass = navItem({ size, selected });
  const resolvedAriaCurrent = ariaCurrent ?? (selected ? 'page' : undefined);
  const ariaDisabled = disabled || undefined;

  const renderSlots = (label: ReactNode): ReactNode => (
    <>
      {icon ? (
        <span className={iconSlot} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className={labelSlot}>{label}</span>
      {trailing ? <span className={trailingSlot}>{trailing}</span> : null}
    </>
  );

  if (asChild) {
    if (!isValidElement(children)) return null;
    const child = children as ReactElement<{ children?: ReactNode }>;
    const replaced = cloneElement(child, {}, renderSlots(child.props.children));
    return (
      <Slot
        ref={ref}
        className={recipeClass}
        aria-current={resolvedAriaCurrent}
        aria-disabled={ariaDisabled}
        {...rest}
      >
        {replaced}
      </Slot>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      className={recipeClass}
      disabled={disabled}
      aria-disabled={ariaDisabled}
      aria-current={resolvedAriaCurrent}
      {...rest}
    >
      {renderSlots(children)}
    </button>
  );
});
