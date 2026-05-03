import { useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@touchstone/atoms';
import { Dialog } from './Dialog.js';
import type { DialogSeverity, DialogSize } from './Dialog.js';

export interface ConfirmDialogProps {
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  /** Called when the dialog wants to open or close. */
  onOpenChange?: (open: boolean) => void;
  /** Optional element to render as the open trigger (forwarded into `Dialog.Trigger`). */
  trigger?: ReactNode;
  /** Required heading for the prompt. Wired up via `aria-labelledby`. */
  title: string;
  /** Sub-text describing what's about to happen. Wired up via `aria-describedby`. */
  description?: ReactNode;
  /** Body content — only used when the description alone isn't enough. */
  children?: ReactNode;
  /**
   * `'danger'` switches the panel to `role="alertdialog"`, applies the
   * danger accent rail, and (unless overridden) makes the confirm button
   * destructive. Pair with destructive flows: delete, unmake, revoke.
   * @default 'default'
   */
  severity?: DialogSeverity;
  /** Visual size of the panel. @default 'sm' */
  size?: DialogSize;
  /** Confirm button label. @default 'Confirm' */
  confirmLabel?: string;
  /** Cancel button label. @default 'Cancel' */
  cancelLabel?: string;
  /**
   * Confirm button intent. Defaults to `'danger'` when `severity="danger"`
   * and `'primary'` otherwise.
   */
  confirmIntent?: 'primary' | 'danger';
  /**
   * Called when the user clicks confirm. May return a Promise — the dialog
   * stays open and the buttons disable until it settles, then closes. If
   * the promise rejects, the dialog stays open so the caller can render an
   * error and the user can retry.
   */
  onConfirm?: () => void | Promise<void>;
  /**
   * Called when the user cancels — Cancel button click, Escape, or
   * backdrop click. Fires before the dialog closes.
   */
  onCancel?: () => void;
  /**
   * Allow Escape and backdrop click to close. @default true
   * Set to false for forced-choice prompts.
   */
  dismissible?: boolean;
}

/**
 * Confirm/cancel prompt over `Dialog`. The intent is to replace `window.confirm`
 * for destructive actions — same one-prop ergonomics, but rendered inside the
 * design system. For richer custom panels (multi-step, embedded forms), use
 * `Dialog` directly; this wrapper is the ergonomic shortcut for the common
 * "are you sure?" pattern.
 *
 * `onConfirm` may return a Promise; the dialog stays open and disables both
 * buttons until it settles. A rejected promise leaves the dialog open so the
 * caller can render an error and the user can retry.
 */
export function ConfirmDialog({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  severity = 'default',
  size = 'sm',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmIntent,
  onConfirm,
  onCancel,
  dismissible = true,
}: ConfirmDialogProps): React.JSX.Element {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen ?? false);
  const open = isControlled ? controlledOpen : internalOpen;
  const [busy, setBusy] = useState(false);
  const resolvedConfirmIntent =
    confirmIntent ?? (severity === 'danger' ? 'danger' : 'primary');

  function setOpen(next: boolean): void {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }

  // Dialog's internal close paths (Cancel button via Dialog.Close, Escape,
  // backdrop) are treated as "cancel" — they fire onCancel before closing.
  function handleDialogOpenChange(next: boolean): void {
    if (!next) onCancel?.();
    setOpen(next);
  }

  function handleConfirm(): void {
    if (busy) return;
    const result = onConfirm?.();
    if (result && typeof (result as Promise<void>).then === 'function') {
      setBusy(true);
      (result as Promise<void>).then(
        () => {
          setBusy(false);
          setOpen(false);
        },
        () => {
          setBusy(false);
        },
      );
      return;
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      {trigger ? <Dialog.Trigger>{trigger}</Dialog.Trigger> : null}
      <Dialog.Content
        title={title}
        {...(description !== undefined ? { description } : {})}
        severity={severity}
        size={size}
        dismissible={dismissible && !busy}
      >
        {children}
        <Dialog.Footer>
          <Dialog.Close>
            <Button intent="secondary" disabled={busy}>
              {cancelLabel}
            </Button>
          </Dialog.Close>
          <Button intent={resolvedConfirmIntent} disabled={busy} onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
