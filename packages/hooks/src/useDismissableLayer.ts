import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

interface Layer {
  panelRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLElement | null> | undefined;
  onDismiss: () => void;
  dismissible: boolean;
}

const layers: Layer[] = [];
let listenersAttached = false;

function targetIsInsideLayer(layer: Layer, target: Node | null): boolean {
  if (target === null) return false;
  const panel = layer.panelRef.current;
  if (panel && panel.contains(target)) return true;
  const trigger = layer.triggerRef?.current;
  if (trigger && trigger.contains(target)) return true;
  return false;
}

function dismissTopFor(target: Node | null): void {
  if (layers.length === 0) return;
  const top = layers[layers.length - 1];
  if (!top) return;
  if (target !== null && targetIsInsideLayer(top, target)) return;
  if (!top.dismissible) return;
  top.onDismiss();
}

function onMouseDown(event: MouseEvent): void {
  dismissTopFor(event.target as Node | null);
}

function onKeyDown(event: KeyboardEvent): void {
  if (event.key !== 'Escape') return;
  if (layers.length === 0) return;
  const top = layers[layers.length - 1];
  if (!top) return;
  if (!top.dismissible) return;
  top.onDismiss();
}

function ensureListeners(): void {
  if (listenersAttached) return;
  // Capture phase so the layer-stack snapshot is taken before any React
  // handler on the click target runs — otherwise a setState that unmounts
  // the layer (e.g. Dropdown's option click closing the listbox) flushes
  // first, and our handler then sees the click as "outside" the parent.
  document.addEventListener('mousedown', onMouseDown, true);
  document.addEventListener('keydown', onKeyDown, true);
  listenersAttached = true;
}

function maybeDetachListeners(): void {
  if (layers.length > 0) return;
  if (!listenersAttached) return;
  document.removeEventListener('mousedown', onMouseDown, true);
  document.removeEventListener('keydown', onKeyDown, true);
  listenersAttached = false;
}

export interface UseDismissableLayerOptions {
  /**
   * Called when the layer is the topmost open layer and a dismiss gesture
   * (outside press or Escape) fires. Suppressed when `dismissible` is false.
   */
  onDismiss: () => void;
  /**
   * Trigger or anchor element. Clicks inside it are treated as inside the
   * layer, so the trigger's own toggle handler runs without the layer
   * dismissing first.
   */
  triggerRef?: RefObject<HTMLElement | null>;
  /** When false, this layer never dismisses and blocks layers below it from dismissing. @default true */
  dismissible?: boolean;
  /** When false, the layer is not registered. @default true */
  active?: boolean;
}

/**
 * Register an open overlay (modal panel, popover, listbox) in a single
 * top-of-stack dismiss coordinator. The topmost active layer owns
 * outside-press and Escape — clicks inside any registered layer's panel or
 * trigger count as inside it, so a Dropdown listbox portaled out of a
 * Dialog does not dismiss the Dialog when its options are clicked.
 *
 * Use this from any surface that wants close-on-press / close-on-Escape
 * semantics. For modal surfaces, prefer `useModalSurface`, which composes
 * this with scroll lock, focus trap, focus return, and modal-stack
 * registration.
 */
export function useDismissableLayer(
  panelRef: RefObject<HTMLElement | null>,
  options: UseDismissableLayerOptions,
): void {
  const { onDismiss, triggerRef, dismissible = true, active = true } = options;

  const layerRef = useRef<Layer | null>(null);
  if (layerRef.current === null) {
    layerRef.current = { panelRef, triggerRef, onDismiss, dismissible };
  } else {
    layerRef.current.panelRef = panelRef;
    layerRef.current.triggerRef = triggerRef;
    layerRef.current.onDismiss = onDismiss;
    layerRef.current.dismissible = dismissible;
  }

  useEffect(() => {
    if (!active) return;
    const layer = layerRef.current;
    if (layer === null) return;
    layers.push(layer);
    ensureListeners();
    return () => {
      const i = layers.indexOf(layer);
      if (i !== -1) layers.splice(i, 1);
      maybeDetachListeners();
    };
  }, [active]);
}
