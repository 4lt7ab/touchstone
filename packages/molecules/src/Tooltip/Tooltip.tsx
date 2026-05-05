import { cloneElement, isValidElement, useId, useRef } from 'react';
import type {
  FocusEventHandler,
  PointerEventHandler,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { createPortal } from 'react-dom';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import {
  useAnchoredPosition,
  useEscapeKey,
  useHoverIntent,
  useMergedRefs,
  type AnchoredPositionAlign,
  type AnchoredPositionSide,
} from '@touchstone/hooks';
import type { BaseComponentProps } from '@touchstone/atoms';
import { tooltip } from './Tooltip.css.js';

type TooltipVariants = NonNullable<RecipeVariants<typeof tooltip>>;

/**
 * Hover-with-intent label for an interactive element. Composes
 * `useHoverIntent` for the open/close cadence, `useAnchoredPosition` for
 * placement, `useEscapeKey` for keyboard dismiss. Pointer entry shows the
 * tip after `openDelay`; pointer exit hides it after `closeDelay`. Focus
 * shows it instantly so keyboard users aren't laggy.
 *
 * The tip is wired to the trigger via `aria-describedby` — pair with
 * elements that already have a visible label (icon-only `Button`, an
 * input, a control). Don't use a tooltip as the *only* label; for
 * icon-only triggers, also pass `aria-label` on the icon.
 *
 * The trigger is forwarded through `Slot`, so any single-child element
 * works: a `Button`, an `<a>`, a custom component that forwards refs.
 */
export interface TooltipProps extends BaseComponentProps, TooltipVariants {
  /** The tip's content. Plain string is the typical case; `ReactNode` allowed. */
  content: ReactNode;
  /** Side of the trigger to render on. @default 'top' */
  side?: AnchoredPositionSide;
  /** Alignment along the trigger edge. @default 'center' */
  align?: AnchoredPositionAlign;
  /** Gap (px) between the trigger and the tip. @default 6 */
  offset?: number;
  /** Delay (ms) before opening on hover. @default 200 */
  openDelay?: number;
  /** Delay (ms) before closing on hover-out. @default 100 */
  closeDelay?: number;
  /** Disable the tooltip (e.g. when the trigger is itself inert). */
  disabled?: boolean;
  /** Controlled open state (escape hatch — most callers use the hover defaults). */
  open?: boolean;
  /** Called when open changes. */
  onOpenChange?: (open: boolean) => void;
  /** A single trigger element. Cloned via `Slot` to receive aria + event wiring. */
  children: ReactNode;
}

export function Tooltip({
  content,
  side = 'top',
  align = 'center',
  offset = 6,
  openDelay,
  closeDelay,
  disabled = false,
  open: controlledOpen,
  onOpenChange,
  tone,
  children,
  id: providedId,
  'data-testid': dataTestId,
}: TooltipProps): React.JSX.Element | null {
  const reactId = useId();
  const tipId = providedId ?? reactId;

  const intent = useHoverIntent({
    enabled: !disabled,
    ...(openDelay !== undefined ? { openDelay } : {}),
    ...(closeDelay !== undefined ? { closeDelay } : {}),
    ...(onOpenChange ? { onOpenChange } : {}),
  });

  const open = controlledOpen ?? intent.open;

  const anchorRef = useRef<HTMLElement | null>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  useEscapeKey(() => intent.setOpen(false), open && !disabled);

  if (!isValidElement(children)) return null;
  const child = children as ReactElement<TriggerChildProps> & { ref?: Ref<unknown> };
  const existingDescribedBy = child.props['aria-describedby'];
  const describedBy = open
    ? [existingDescribedBy, tipId].filter(Boolean).join(' ')
    : existingDescribedBy;

  const wrappedProps: Record<string, unknown> = {
    ref: composeRefs(anchorRef, child.ref),
    'aria-describedby': describedBy,
    onPointerEnter: chainHandler(
      intent.triggerProps.onPointerEnter,
      child.props.onPointerEnter,
    ),
    onPointerLeave: chainHandler(
      intent.triggerProps.onPointerLeave,
      child.props.onPointerLeave,
    ),
    onFocus: chainHandler(intent.triggerProps.onFocus, child.props.onFocus),
    onBlur: chainHandler(intent.triggerProps.onBlur, child.props.onBlur),
  };
  const wrapped = cloneElement(child, wrappedProps as Partial<TriggerChildProps>);

  return (
    <>
      {wrapped}
      {open && !disabled ? (
        <TooltipSurface
          tipRef={tipRef}
          anchorRef={anchorRef}
          tipId={tipId}
          side={side}
          align={align}
          offset={offset}
          tone={tone}
          contentProps={intent.contentProps}
          dataTestId={dataTestId}
        >
          {content}
        </TooltipSurface>
      ) : null}
    </>
  );
}

interface TriggerChildProps {
  'aria-describedby'?: string;
  onPointerEnter?: PointerEventHandler<Element>;
  onPointerLeave?: PointerEventHandler<Element>;
  onFocus?: FocusEventHandler<Element>;
  onBlur?: FocusEventHandler<Element>;
}

function chainHandler<E extends React.SyntheticEvent>(
  primary: (e: E) => void,
  secondary: ((e: E) => void) | undefined,
): (e: E) => void {
  return (e) => {
    primary(e);
    if (!e.defaultPrevented) secondary?.(e);
  };
}

function composeRefs<T>(
  a: React.MutableRefObject<T | null>,
  b: Ref<T> | Ref<unknown> | undefined,
): Ref<T> {
  return (instance: T | null) => {
    a.current = instance;
    if (typeof b === 'function') (b as (v: T | null) => void)(instance);
    else if (b && typeof b === 'object') (b as { current: T | null }).current = instance;
  };
}

interface TooltipSurfaceProps {
  tipRef: React.RefObject<HTMLDivElement>;
  anchorRef: React.MutableRefObject<HTMLElement | null>;
  tipId: string;
  side: AnchoredPositionSide;
  align: AnchoredPositionAlign;
  offset: number;
  tone: TooltipVariants['tone'];
  contentProps: {
    onPointerEnter: React.PointerEventHandler;
    onPointerLeave: React.PointerEventHandler;
  };
  dataTestId?: string;
  children: ReactNode;
}

function TooltipSurface({
  tipRef,
  anchorRef,
  tipId,
  side,
  align,
  offset,
  tone,
  contentProps,
  dataTestId,
  children,
}: TooltipSurfaceProps): React.ReactPortal | null {
  const internalRef = useRef<HTMLDivElement>(null);
  const merged = useMergedRefs<HTMLDivElement>(internalRef, tipRef);
  const { style: positionStyle } = useAnchoredPosition(anchorRef, internalRef, {
    side,
    align,
    offset,
  });
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div
      ref={merged}
      role="tooltip"
      id={tipId}
      data-testid={dataTestId}
      className={tooltip({ tone })}
      style={positionStyle}
      {...contentProps}
    >
      {children}
    </div>,
    document.body,
  );
}

/**
 * Standalone helper for callers that already manage open state externally
 * — pass `anchorRef`, `open`, and `content` to render the tip without the
 * wrapped trigger semantics. Most callers should use `<Tooltip>`.
 */
export interface TooltipContentProps extends BaseComponentProps, TooltipVariants {
  open: boolean;
  anchorRef: React.MutableRefObject<HTMLElement | null>;
  side?: AnchoredPositionSide;
  align?: AnchoredPositionAlign;
  offset?: number;
  children: ReactNode;
}

export function TooltipContent({
  open,
  anchorRef,
  side = 'top',
  align = 'center',
  offset = 6,
  tone,
  children,
  id,
  'data-testid': dataTestId,
}: TooltipContentProps): React.JSX.Element | null {
  const tipRef = useRef<HTMLDivElement>(null);
  if (!open) return null;
  return (
    <TooltipSurface
      tipRef={tipRef}
      anchorRef={anchorRef}
      tipId={id ?? 'tooltip'}
      side={side}
      align={align}
      offset={offset}
      tone={tone}
      contentProps={{ onPointerEnter: () => {}, onPointerLeave: () => {} }}
      {...(dataTestId !== undefined ? { dataTestId } : {})}
    >
      {children}
    </TooltipSurface>
  );
}
