import { useEffect, useId, useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@touchstone/atoms';
import type { BaseComponentProps } from '@touchstone/atoms';
import * as styles from './Toast.css.js';

type ToastTone = 'info' | 'success' | 'warning' | 'danger';
type ToastPlacement = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface ToastAction {
  /** Visible label of the action button. */
  label: string;
  /** Called when the action is activated. The toast dismisses afterward. */
  onClick: () => void;
}

export interface ToastInput {
  /** Tone — maps to `info` / `success` / `warning` / `danger` theme entries. @default 'info' */
  tone?: ToastTone;
  /** Bold opening line. */
  title?: ReactNode;
  /** Supporting content beneath the title. */
  description?: ReactNode;
  /** Auto-dismiss timer in ms; pass `Infinity` to require manual dismiss. @default 5000 */
  duration?: number;
  /** Optional follow-up button rendered next to the dismiss control. */
  action?: ToastAction;
}

interface ToastItem extends Required<Pick<ToastInput, 'tone' | 'duration'>> {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ToastAction;
}

let items: ReadonlyArray<ToastItem> = [];
let nextId = 0;
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): ReadonlyArray<ToastItem> {
  return items;
}

function dismissOne(id: string): void {
  items = items.filter((i) => i.id !== id);
  notify();
}

function dismissAll(): void {
  if (items.length === 0) return;
  items = [];
  notify();
}

function addToast(input: ToastInput): string {
  const id = String(++nextId);
  const item: ToastItem = {
    id,
    tone: input.tone ?? 'info',
    duration: input.duration ?? 5000,
    title: input.title,
    description: input.description,
    action: input.action,
  };
  items = [...items, item];
  notify();
  return id;
}

/**
 * Push a transient notification into the active `<Toaster />`. Returns the
 * toast id so the caller can dismiss it programmatically.
 *
 * `toast.dismiss(id)` removes a single toast; `toast.dismissAll()` clears
 * the queue. Without an active `<Toaster />` mounted in the tree the call
 * is a no-op visually — the queue still exists, so a Toaster that mounts
 * later picks up pending toasts.
 */
export const toast = Object.assign(addToast, {
  dismiss: dismissOne,
  dismissAll,
});

function DismissGlyph(): React.JSX.Element {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

interface ToastRowProps {
  item: ToastItem;
  dismissLabel: string;
}

function ToastRow({ item, dismissLabel }: ToastRowProps): React.JSX.Element {
  const isAlert = item.tone === 'danger' || item.tone === 'warning';
  const titleId = useId();
  const descId = useId();
  const labelledBy = item.title ? titleId : undefined;
  const describedBy = item.description ? descId : undefined;
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (!Number.isFinite(item.duration)) return;
    const timer = setTimeout(() => dismissOne(item.id), item.duration);
    return () => {
      clearTimeout(timer);
    };
  }, [item.id, item.duration, paused]);

  return (
    <div
      role={isAlert ? 'alert' : 'status'}
      aria-live={isAlert ? 'assertive' : 'polite'}
      aria-atomic="true"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className={styles.toast({ tone: item.tone })}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className={styles.body}>
        {item.title ? (
          <span id={titleId} className={styles.title}>
            {item.title}
          </span>
        ) : null}
        {item.description ? <span id={descId}>{item.description}</span> : null}
      </div>
      <div className={styles.trailing}>
        {item.action ? (
          <Button
            intent="ghost"
            size="sm"
            onClick={() => {
              item.action?.onClick();
              dismissOne(item.id);
            }}
          >
            {item.action.label}
          </Button>
        ) : null}
        <Button
          intent="ghost"
          shape="square"
          size="sm"
          aria-label={dismissLabel}
          onClick={() => dismissOne(item.id)}
        >
          <DismissGlyph />
        </Button>
      </div>
    </div>
  );
}

export interface ToasterProps extends BaseComponentProps {
  /** Corner of the viewport to anchor the stack. @default 'bottom-right' */
  placement?: ToastPlacement;
  /** Maximum visible stack depth. Older toasts queue beyond this. @default 4 */
  max?: number;
  /** Accessible label for each dismiss button. @default 'dismiss' */
  dismissLabel?: string;
}

/**
 * Mount-once notification stack. Subscribes to the toast queue and renders
 * the visible items into a portal at `vars.zIndex.toast`. The viewport is
 * anchored to one of four corners; new toasts grow toward the corner so the
 * latest entry sits closest to it. Each toast carries `role="status"` for
 * `info` / `success` and `role="alert"` for `warning` / `danger`, so screen
 * readers announce them appropriately.
 *
 * Hovering or focusing a toast pauses its dismiss timer; pressing Escape
 * dismisses the newest toast.
 */
export function Toaster({
  placement = 'bottom-right',
  max = 4,
  dismissLabel = 'dismiss',
  id,
  'data-testid': dataTestId,
}: ToasterProps): React.JSX.Element | null {
  const queue = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent): void {
      if (e.key !== 'Escape') return;
      if (items.length === 0) return;
      const newest = items[items.length - 1];
      if (newest) dismissOne(newest.id);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  if (typeof document === 'undefined') return null;
  const visible = queue.slice(-max);

  return createPortal(
    <div id={id} data-testid={dataTestId} className={styles.viewport({ placement })}>
      {visible.map((item) => (
        <ToastRow key={item.id} item={item} dismissLabel={dismissLabel} />
      ))}
    </div>,
    document.body,
  );
}
