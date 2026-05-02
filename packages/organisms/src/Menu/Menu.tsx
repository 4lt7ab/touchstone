import { Children, cloneElement, forwardRef, isValidElement, useEffect, useRef } from 'react';
import type { AriaAttributes, KeyboardEvent, ReactElement, ReactNode, Ref } from 'react';
import { createPortal } from 'react-dom';
import {
  createCompoundContext,
  useAnchoredPosition,
  useDisclosure,
  useEscapeKey,
  useFocusReturn,
  useMergedRefs,
  useRovingFocus,
  type AnchoredPositionAlign,
  type AnchoredPositionSide,
} from '@touchstone/hooks';
import { Slot } from '@touchstone/atoms';
import type { BaseComponentProps } from '@touchstone/atoms';
import { NavItem } from '@touchstone/molecules';
import * as styles from './Menu.css.js';

interface MenuContextValue {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  contentId: string;
  anchorRef: React.MutableRefObject<HTMLElement | null>;
}

const [MenuProvider, useMenuScope] = createCompoundContext<MenuContextValue>('Menu');

export interface MenuProps extends BaseComponentProps {
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  /** Called when the menu wants to open or close. */
  onOpenChange?: (open: boolean) => void;
  /** A `Menu.Trigger` and `Menu.Content`, in either order. */
  children: ReactNode;
}

/**
 * Keyboard-navigable dropdown anchored to a trigger. Composes `Popover`'s
 * primitives — `useDisclosure`, `useAnchoredPosition`, `useEscapeKey`,
 * `useFocusReturn` — and adds menu semantics: `role="menu"` on the surface,
 * `role="menuitem"` on rows, arrow-key roving focus across items, and
 * close-on-select. Use for AppBar profile menus, table row actions, and
 * `PageHeader` overflow menus.
 *
 * Non-modal (no focus trap, no scroll lock). For a modal centered surface,
 * use `Dialog`. For a free-form panel that isn't a list of choices, use
 * `Popover`.
 */
function MenuRoot({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  children,
}: MenuProps): React.JSX.Element {
  const disclosure = useDisclosure({
    ...(controlledOpen !== undefined ? { open: controlledOpen } : {}),
    ...(defaultOpen !== undefined ? { defaultOpen } : {}),
    ...(onOpenChange ? { onOpenChange } : {}),
  });
  const anchorRef = useRef<HTMLElement | null>(null);

  return (
    <MenuProvider
      value={{
        open: disclosure.open,
        onToggle: disclosure.onToggle,
        onClose: disclosure.onClose,
        contentId: disclosure.contentProps.id,
        anchorRef,
      }}
    >
      {children}
    </MenuProvider>
  );
}

export interface MenuTriggerProps {
  /** A single element to use as the trigger; receives `onClick` and ARIA wiring. */
  children: ReactNode;
}

function MenuTrigger({ children }: MenuTriggerProps): React.JSX.Element {
  const ctx = useMenuScope('Menu.Trigger');
  return (
    <Slot
      ref={ctx.anchorRef as Ref<unknown>}
      onClick={ctx.onToggle}
      aria-expanded={ctx.open}
      aria-controls={ctx.contentId}
      aria-haspopup="menu"
    >
      {children}
    </Slot>
  );
}

export interface MenuContentProps extends BaseComponentProps {
  /** Side of the trigger to render on. @default 'bottom' */
  side?: AnchoredPositionSide;
  /** Alignment along the trigger edge. @default 'start' */
  align?: AnchoredPositionAlign;
  /** Gap (px) between the trigger and the menu surface. @default 8 */
  offset?: number;
  /** Required accessible label for the menu surface. */
  'aria-label'?: AriaAttributes['aria-label'];
  /** Or labelledby — id of an external label element. */
  'aria-labelledby'?: AriaAttributes['aria-labelledby'];
  /** `Menu.Item`s and `Menu.Separator`s. */
  children?: ReactNode;
}

const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(function MenuContent(props, ref) {
  const ctx = useMenuScope('Menu.Content');
  if (!ctx.open) return null;
  if (typeof document === 'undefined') return null;
  return <MenuPanel {...props} forwardedRef={ref} />;
});

interface MenuPanelProps extends MenuContentProps {
  forwardedRef: Ref<HTMLDivElement>;
}

function MenuPanel({
  side = 'bottom',
  align = 'start',
  offset = 8,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  id,
  'data-testid': dataTestId,
  forwardedRef,
}: MenuPanelProps): React.ReactPortal {
  const ctx = useMenuScope('Menu.Content');
  const panelRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(panelRef, forwardedRef);
  const { style: positionStyle } = useAnchoredPosition(ctx.anchorRef, panelRef, {
    side,
    align,
    offset,
  });

  useFocusReturn(true);
  useEscapeKey(() => ctx.onClose(), true);

  useEffect(() => {
    function handler(event: MouseEvent): void {
      const panel = panelRef.current;
      const anchor = ctx.anchorRef.current;
      const target = event.target as Node;
      if (panel && panel.contains(target)) return;
      if (anchor && anchor.contains(target)) return;
      ctx.onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, [ctx]);

  const childArray = Children.toArray(children);
  const itemCount = childArray.filter((c) => isValidElement(c) && isMenuItemElement(c)).length;

  const { itemRef, onKeyDown, getTabIndex } = useRovingFocus({
    count: itemCount,
    activeIndex: null,
    orientation: 'vertical',
  });

  useEffect(() => {
    const first = panelRef.current?.querySelector<HTMLElement>(
      '[role="menuitem"]:not([aria-disabled="true"]):not([disabled])',
    );
    first?.focus();
  }, []);

  let itemIdx = 0;
  const cloned = childArray.map((child) => {
    if (!isValidElement(child) || !isMenuItemElement(child)) return child;
    const idx = itemIdx++;
    const focusable = child as ReactElement<MenuItemFocusableProps>;
    const existing = focusable.props;
    return cloneElement(focusable, {
      ref: itemRef(idx) as Ref<HTMLButtonElement>,
      tabIndex: getTabIndex(idx),
      onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'Tab') {
          ctx.onClose();
          return;
        }
        existing.onKeyDown?.(e);
        if (!e.defaultPrevented) onKeyDown(idx)(e);
      },
    });
  });

  return createPortal(
    <div
      ref={mergedRef}
      role="menu"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      tabIndex={-1}
      id={id ?? ctx.contentId}
      data-testid={dataTestId}
      className={styles.surface}
      style={positionStyle}
    >
      {cloned}
    </div>,
    document.body,
  );
}

function isMenuItemElement(child: ReactElement): boolean {
  return child.type === MenuItem;
}

interface MenuItemFocusableProps {
  ref?: Ref<HTMLButtonElement>;
  tabIndex?: number;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
}

export interface MenuItemProps extends BaseComponentProps {
  /** Visible label content. */
  children?: ReactNode;
  /** Leading element — typically an icon. */
  icon?: ReactNode;
  /** Trailing element — keyboard hint, count, chevron. */
  trailing?: ReactNode;
  /** Visual emphasis. `danger` reads from `vars.color.danger` / `dangerBg`. @default 'default' */
  tone?: 'default' | 'danger';
  /** Disable the item. */
  disabled?: boolean;
  /**
   * Called when the user activates the item (click, Enter, Space). The menu
   * closes after `onSelect` returns.
   */
  onSelect?: () => void;
  /** @internal Wired by `Menu.Content` for roving focus. */
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  /** @internal Wired by `Menu.Content` for roving focus. */
  tabIndex?: number;
}

const MenuItem = forwardRef<HTMLElement, MenuItemProps>(function MenuItem(
  {
    children,
    icon,
    trailing,
    tone,
    disabled,
    onSelect,
    onKeyDown,
    tabIndex,
    id,
    'data-testid': dataTestId,
  },
  ref,
) {
  const ctx = useMenuScope('Menu.Item');
  return (
    <NavItem
      ref={ref}
      role="menuitem"
      id={id}
      data-testid={dataTestId}
      icon={icon}
      trailing={trailing}
      tone={tone}
      disabled={disabled}
      tabIndex={tabIndex ?? -1}
      onClick={() => {
        if (disabled) return;
        onSelect?.();
        ctx.onClose();
      }}
      onKeyDown={onKeyDown}
    >
      {children}
    </NavItem>
  );
});

export interface MenuSeparatorProps extends BaseComponentProps {
  /** Optional accessible label for the separator. */
  'aria-label'?: AriaAttributes['aria-label'];
}

function MenuSeparator({
  id,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
}: MenuSeparatorProps): React.JSX.Element {
  return (
    <div
      id={id}
      data-testid={dataTestId}
      role="separator"
      aria-label={ariaLabel}
      className={styles.separator}
    />
  );
}

export const Menu = Object.assign(MenuRoot, {
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  Separator: MenuSeparator,
});
