import { forwardRef, useCallback, useEffect, useId, useRef } from 'react';
import type { ReactNode, Ref } from 'react';
import { createPortal } from 'react-dom';
import {
  createCompoundContext,
  useClickOutside,
  useDisclosure,
  useEscapeKey,
  useFocusReturn,
  useFocusTrap,
  useMergedRefs,
  useScrollLock,
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
 * Modal dialog. Behavior is composed from in-house hooks: `useDisclosure`
 * for state, `useFocusTrap` for keyboard containment, `useFocusReturn` to
 * restore focus to the trigger on dismiss, `useClickOutside` for backdrop
 * dismiss, `useEscapeKey` for Escape dismiss, and `useScrollLock` so the
 * page beneath doesn't scroll while the dialog is open.
 *
 * Visual treatment is owned here through `vars.color.bgOverlay`,
 * `vars.color.bgRaised`, `vars.shadow.lg`, and `vars.zIndex.modal`.
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

export interface DialogContentProps extends BaseComponentProps {
  /** Required heading. Renders as `<h2>` and is wired up via `aria-labelledby`. */
  title: string;
  /** Optional sub-text. When present, wired up via `aria-describedby`. */
  description?: string;
  /**
   * Allow Escape and backdrop click to close. @default true
   * Set to false for forced-choice dialogs (the consumer must wire a
   * `Dialog.Close` button somewhere visible).
   */
  dismissible?: boolean;
  /** Accessible label for the built-in close button. @default 'close' */
  dismissLabel?: string;
  /** Body content. */
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

function DialogPanel({
  title,
  description,
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

  const dismiss = useCallback(() => {
    if (dismissible) ctx.onClose();
  }, [dismissible, ctx]);

  useScrollLock(true);
  useFocusTrap(panelRef);
  useFocusReturn(true);
  useClickOutside(panelRef, dismiss, true);
  useEscapeKey(dismiss, true);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  return createPortal(
    <div className={styles.backdrop}>
      <div
        ref={mergedRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ctx.titleId}
        aria-describedby={description ? ctx.descriptionId : undefined}
        tabIndex={-1}
        id={id}
        data-testid={dataTestId}
        className={styles.panel}
      >
        <h2 id={ctx.titleId} className={styles.title}>
          {title}
        </h2>
        {description ? (
          <p id={ctx.descriptionId} className={styles.description}>
            {description}
          </p>
        ) : null}
        {children ? <div className={styles.body}>{children}</div> : null}
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
});
