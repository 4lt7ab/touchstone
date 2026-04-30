import { forwardRef, useEffect, useRef } from 'react';
import type { ReactNode, Ref } from 'react';
import { createPortal } from 'react-dom';
import {
  createCompoundContext,
  useAnchoredPosition,
  useDisclosure,
  useEscapeKey,
  useFocusReturn,
  useMergedRefs,
  type AnchoredPositionAlign,
  type AnchoredPositionSide,
} from '@touchstone/hooks';
import { Slot } from '@touchstone/atoms';
import type { BaseComponentProps } from '@touchstone/atoms';
import * as styles from './Popover.css.js';

interface PopoverContextValue {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  contentId: string;
  anchorRef: React.MutableRefObject<HTMLElement | null>;
}

const [PopoverProvider, usePopoverScope] =
  createCompoundContext<PopoverContextValue>('Popover');

export interface PopoverProps extends BaseComponentProps {
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  /** Called when the popover wants to open or close. */
  onOpenChange?: (open: boolean) => void;
  /** A `Popover.Trigger` and `Popover.Content`, in either order. */
  children: ReactNode;
}

/**
 * Non-modal panel anchored to a trigger. Composes `useDisclosure` for state,
 * `useAnchoredPosition` for placement, `useEscapeKey` for dismiss, and
 * `useFocusReturn` so focus comes back to the trigger on close. Click
 * outside the panel and trigger also dismisses.
 *
 * Use for filter pickers, settings flyouts, action menus, hover cards. For
 * a modal centered surface that locks page scroll, use `Dialog`.
 */
function PopoverRoot({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  children,
}: PopoverProps): React.JSX.Element {
  const disclosure = useDisclosure({
    ...(controlledOpen !== undefined ? { open: controlledOpen } : {}),
    ...(defaultOpen !== undefined ? { defaultOpen } : {}),
    ...(onOpenChange ? { onOpenChange } : {}),
  });
  const anchorRef = useRef<HTMLElement | null>(null);

  return (
    <PopoverProvider
      value={{
        open: disclosure.open,
        onToggle: disclosure.onToggle,
        onClose: disclosure.onClose,
        contentId: disclosure.contentProps.id,
        anchorRef,
      }}
    >
      {children}
    </PopoverProvider>
  );
}

export interface PopoverTriggerProps {
  /** A single element to use as the trigger; receives `onClick` and ARIA wiring. */
  children: ReactNode;
}

function PopoverTrigger({ children }: PopoverTriggerProps): React.JSX.Element {
  const ctx = usePopoverScope('Popover.Trigger');
  return (
    <Slot
      ref={ctx.anchorRef as Ref<unknown>}
      onClick={ctx.onToggle}
      aria-expanded={ctx.open}
      aria-controls={ctx.contentId}
      aria-haspopup="dialog"
    >
      {children}
    </Slot>
  );
}

export interface PopoverContentProps extends BaseComponentProps {
  /** Side of the trigger to render on. @default 'bottom' */
  side?: AnchoredPositionSide;
  /** Alignment along the trigger edge. @default 'start' */
  align?: AnchoredPositionAlign;
  /** Gap (px) between the trigger and the panel. @default 8 */
  offset?: number;
  /**
   * Allow Escape and outside-click to close. @default true
   * Set to false to require an explicit close affordance inside the panel.
   */
  dismissible?: boolean;
  /**
   * Optional accessible label for the panel. When the panel contains a
   * heading, set `aria-labelledby` to its id instead.
   */
  'aria-label'?: string;
  /** Id of an internal heading element used to label the panel. */
  'aria-labelledby'?: string;
  /** Panel content. */
  children?: ReactNode;
}

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent(props, ref) {
    const ctx = usePopoverScope('Popover.Content');
    if (!ctx.open) return null;
    if (typeof document === 'undefined') return null;
    return <PopoverPanel {...props} forwardedRef={ref} />;
  },
);

interface PopoverPanelProps extends PopoverContentProps {
  forwardedRef: Ref<HTMLDivElement>;
}

function PopoverPanel({
  side = 'bottom',
  align = 'start',
  offset = 8,
  dismissible = true,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  id,
  'data-testid': dataTestId,
  forwardedRef,
}: PopoverPanelProps): React.ReactPortal {
  const ctx = usePopoverScope('Popover.Content');
  const panelRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(panelRef, forwardedRef);
  const { style: positionStyle } = useAnchoredPosition(
    ctx.anchorRef,
    panelRef,
    { side, align, offset },
  );

  useFocusReturn(true);
  useEscapeKey(() => {
    if (dismissible) ctx.onClose();
  }, true);

  useEffect(() => {
    if (!dismissible) return;
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
  }, [dismissible, ctx]);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  return createPortal(
    <div
      ref={mergedRef}
      role="dialog"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      tabIndex={-1}
      id={id ?? ctx.contentId}
      data-testid={dataTestId}
      className={styles.panel}
      style={positionStyle}
    >
      {children}
    </div>,
    document.body,
  );
}

export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
});
