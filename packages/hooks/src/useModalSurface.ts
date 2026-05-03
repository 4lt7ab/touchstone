import { useEffect } from 'react';
import type { RefObject } from 'react';
import { useDismissableLayer } from './useDismissableLayer.js';
import { useFocusReturn } from './useFocusReturn.js';
import { useFocusTrap } from './useFocusTrap.js';
import { useModalStackEntry } from './useModalStack.js';
import { useScrollLock } from './useScrollLock.js';

export interface UseModalSurfaceOptions {
  /**
   * Called when Escape or a backdrop press should dismiss the surface. The
   * call is suppressed when `dismissible` is false or when this surface is
   * not the topmost open modal.
   */
  onDismiss: () => void;
  /** When false, Escape and backdrop click are ignored. @default true */
  dismissible?: boolean;
  /**
   * Optional element to focus when the surface mounts. Defaults to the
   * panel itself, which must be a focusable container (`tabIndex={-1}`).
   */
  initialFocusRef?: RefObject<HTMLElement | null>;
}

export interface UseModalSurfaceReturn {
  /** Zero-based depth in the modal stack (0 = bottom). */
  stackIndex: number;
  /** True when this surface is the topmost open modal. */
  isTopOfStack: boolean;
  /** Total open modal surfaces. */
  stackSize: number;
}

/**
 * Compose the full modal-surface recipe: scroll lock, focus trap, focus
 * return on close, dismissable-layer registration (outside-press + Escape,
 * top-of-stack only), initial focus, and a modal-only stack entry for
 * z-index layering. Intended for use inside a panel that is conditionally
 * mounted while open — the hook activates as soon as the calling component
 * mounts.
 *
 * Dismiss coordination flows through `useDismissableLayer`, a single stack
 * shared with non-modal overlays (popovers, menus, dropdown listboxes), so
 * a click on a portaled listbox inside this surface counts as inside.
 *
 * Returns live modal-stack position so the panel can offset its z-index
 * when stacked (a Dialog opened from inside a Drawer should sit above it).
 */
export function useModalSurface(
  panelRef: RefObject<HTMLElement | null>,
  options: UseModalSurfaceOptions,
): UseModalSurfaceReturn {
  const { onDismiss, dismissible = true, initialFocusRef } = options;

  const { index, isTop, size } = useModalStackEntry(true);

  useScrollLock(true);
  useFocusTrap(panelRef);
  useFocusReturn(true);

  useDismissableLayer(panelRef, { onDismiss, dismissible });

  useEffect(() => {
    const target = initialFocusRef?.current ?? panelRef.current;
    target?.focus();
  }, [initialFocusRef, panelRef]);

  return { stackIndex: index, isTopOfStack: isTop, stackSize: size };
}
