import { Children, forwardRef, isValidElement, useId, useRef } from 'react';
import type { ReactNode, Ref } from 'react';
import { createPortal } from 'react-dom';
import {
  createCompoundContext,
  useDisclosure,
  useMergedRefs,
  useModalSurface,
} from '@touchstone/hooks';
import { Button, Slot } from '@touchstone/atoms';
import type { BaseComponentProps } from '@touchstone/atoms';
import * as styles from './Dialog.css.js';

interface DialogContextValue {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  titleId: string;
  descriptionId: string;
}

const [DialogProvider, useDialogScope] = createCompoundContext<DialogContextValue>('Dialog');

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type DialogSeverity = 'default' | 'danger';
export type DialogMode = 'default' | 'reader';
export type DialogFooterAlign = 'start' | 'end' | 'between';

export interface DialogProps extends BaseComponentProps {
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  /** Called when the dialog wants to open or close. */
  onOpenChange?: (open: boolean) => void;
  /** A `Dialog.Trigger`, a `Dialog.Content`, and any `Dialog.Close` inside. */
  children: ReactNode;
}

/**
 * Modal dialog. Behavior is composed by `useModalSurface` — focus trap,
 * focus return, scroll lock, click-outside dismiss, Escape dismiss, and
 * stack registration so a Dialog opened on top of a Drawer dismisses in
 * the right order.
 *
 * Visual treatment is owned here through `vars.color.bgOverlay`,
 * `vars.color.bgRaised`, `vars.shadow.lg`, and `vars.zIndex.modal`. Pass
 * `severity="danger"` for confirm-destroy patterns — the panel uses
 * `role="alertdialog"` and gains a danger accent rail.
 */
function DialogRoot({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  children,
}: DialogProps): React.JSX.Element {
  const { open, onOpen, onClose } = useDisclosure({
    ...(controlledOpen !== undefined ? { open: controlledOpen } : {}),
    ...(defaultOpen !== undefined ? { defaultOpen } : {}),
    ...(onOpenChange ? { onOpenChange } : {}),
  });
  const titleId = useId();
  const descriptionId = useId();

  return (
    <DialogProvider value={{ open, onOpen, onClose, titleId, descriptionId }}>
      {children}
    </DialogProvider>
  );
}

export interface DialogTriggerProps {
  /** A single element to use as the trigger; receives an `onClick` handler. */
  children: ReactNode;
}

function DialogTrigger({ children }: DialogTriggerProps): React.JSX.Element {
  const ctx = useDialogScope('Dialog.Trigger');
  return <Slot onClick={ctx.onOpen}>{children}</Slot>;
}

export interface DialogCloseProps {
  /** A single element to use as a close affordance; receives an `onClick` handler. */
  children: ReactNode;
}

function DialogClose({ children }: DialogCloseProps): React.JSX.Element {
  const ctx = useDialogScope('Dialog.Close');
  return <Slot onClick={ctx.onClose}>{children}</Slot>;
}

export interface DialogFooterProps {
  /** Footer content, typically `Dialog.Close` wrappers around `Button`. */
  children?: ReactNode;
  /** Alignment of footer items along the main axis. @default 'end' */
  align?: DialogFooterAlign;
}

function DialogFooter({ children, align = 'end' }: DialogFooterProps): React.JSX.Element {
  return <div className={styles.footer({ align })}>{children}</div>;
}

export interface DialogContentProps extends BaseComponentProps {
  /** Required heading. Renders as `<h2>` and is wired up via `aria-labelledby`. */
  title: string;
  /**
   * Optional sub-text. Accepts a string for a single line or a `ReactNode`
   * for richer metadata (subtitle, byline, dateline). Wired up via
   * `aria-describedby` when present.
   */
  description?: ReactNode;
  /**
   * Visual size of the panel. Defaults to `'md'`, or `'lg'` when
   * `mode="reader"`.
   */
  size?: DialogSize;
  /**
   * `'danger'` switches the panel to `role="alertdialog"` and applies a
   * danger accent rail — pair with destructive footer actions. @default 'default'
   */
  severity?: DialogSeverity;
  /**
   * `'reader'` reframes the panel for long-form reading — wider default
   * size, more generous header / body padding, relaxed line-height, and a
   * `~65ch` reading measure capped on body content. @default 'default'
   */
  mode?: DialogMode;
  /**
   * Allow Escape and backdrop click to close. @default true
   * Set to false for forced-choice dialogs (the consumer must wire a
   * `Dialog.Close` button somewhere visible).
   */
  dismissible?: boolean;
  /** Accessible label for the built-in close button. @default 'close' */
  dismissLabel?: string;
  /** Body content. A `Dialog.Footer` child is sliced off and pinned to the panel base. */
  children?: ReactNode;
}

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent(props, ref) {
    const ctx = useDialogScope('Dialog.Content');
    if (!ctx.open) return null;
    if (typeof document === 'undefined') return null;
    return <DialogPanel {...props} forwardedRef={ref} />;
  },
);

interface DialogPanelProps extends DialogContentProps {
  forwardedRef: Ref<HTMLDivElement>;
}

function partitionFooter(children: ReactNode): { body: ReactNode[]; footer: ReactNode | null } {
  const arr = Children.toArray(children);
  let footer: ReactNode | null = null;
  const body: ReactNode[] = [];
  for (const child of arr) {
    if (isValidElement(child) && child.type === DialogFooter) {
      footer = child;
    } else {
      body.push(child);
    }
  }
  return { body, footer };
}

function DialogPanel({
  title,
  description,
  size,
  severity = 'default',
  mode = 'default',
  dismissible = true,
  dismissLabel = 'close',
  children,
  id,
  'data-testid': dataTestId,
  forwardedRef,
}: DialogPanelProps): React.ReactPortal {
  const ctx = useDialogScope('Dialog.Content');
  const panelRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(panelRef, forwardedRef);

  useModalSurface(panelRef, {
    onDismiss: ctx.onClose,
    dismissible,
  });

  const { body, footer } = partitionFooter(children);
  const role = severity === 'danger' ? 'alertdialog' : 'dialog';
  const resolvedSize = size ?? (mode === 'reader' ? 'lg' : 'md');

  return createPortal(
    <div className={styles.backdrop}>
      <div
        ref={mergedRef}
        role={role}
        aria-modal="true"
        aria-labelledby={ctx.titleId}
        aria-describedby={description ? ctx.descriptionId : undefined}
        tabIndex={-1}
        id={id}
        data-testid={dataTestId}
        className={styles.panel({ size: resolvedSize, severity })}
      >
        <div className={styles.header({ mode })}>
          <h2 id={ctx.titleId} className={styles.title}>
            {title}
          </h2>
          {description ? (
            <div id={ctx.descriptionId} className={styles.description}>
              {description}
            </div>
          ) : null}
        </div>
        {body.length > 0 ? (
          <div className={styles.body({ mode })}>
            <div className={styles.bodyInner({ mode })}>{body}</div>
          </div>
        ) : null}
        {footer}
        {dismissible ? (
          <span className={styles.dismissSlot}>
            <Button
              intent="ghost"
              shape="square"
              size="sm"
              aria-label={dismissLabel}
              onClick={ctx.onClose}
            >
              <DismissGlyph />
            </Button>
          </span>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

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

export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Close: DialogClose,
  Footer: DialogFooter,
});
