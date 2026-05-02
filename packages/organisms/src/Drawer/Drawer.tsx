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
import * as styles from './Drawer.css.js';

interface DrawerContextValue {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  titleId: string;
  descriptionId: string;
}

const [DrawerProvider, useDrawerScope] = createCompoundContext<DrawerContextValue>('Drawer');

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';
export type DrawerFooterAlign = 'start' | 'end' | 'between';

export interface DrawerProps extends BaseComponentProps {
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  /** Called when the drawer wants to open or close. */
  onOpenChange?: (open: boolean) => void;
  /** A `Drawer.Trigger`, a `Drawer.Content`, and any `Drawer.Close` inside. */
  children: ReactNode;
}

/**
 * Edge-anchored modal. Same surface contract as `Dialog` — focus trap,
 * focus return, scroll lock, click-outside dismiss, Escape dismiss, stack
 * registration via `useModalSurface` — but the panel is anchored to a
 * viewport edge and slides in. Use `side` to pick the edge and `size` to
 * pick the cross-axis dimension.
 *
 * Common shapes: `side="left"` for a settings drawer, `side="right"` for
 * a detail panel, `side="bottom"` for a mobile filter sheet.
 */
function DrawerRoot({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  children,
}: DrawerProps): React.JSX.Element {
  const { open, onOpen, onClose } = useDisclosure({
    ...(controlledOpen !== undefined ? { open: controlledOpen } : {}),
    ...(defaultOpen !== undefined ? { defaultOpen } : {}),
    ...(onOpenChange ? { onOpenChange } : {}),
  });
  const titleId = useId();
  const descriptionId = useId();

  return (
    <DrawerProvider value={{ open, onOpen, onClose, titleId, descriptionId }}>
      {children}
    </DrawerProvider>
  );
}

export interface DrawerTriggerProps {
  /** A single element to use as the trigger; receives an `onClick` handler. */
  children: ReactNode;
}

function DrawerTrigger({ children }: DrawerTriggerProps): React.JSX.Element {
  const ctx = useDrawerScope('Drawer.Trigger');
  return <Slot onClick={ctx.onOpen}>{children}</Slot>;
}

export interface DrawerCloseProps {
  /** A single element to use as a close affordance; receives an `onClick` handler. */
  children: ReactNode;
}

function DrawerClose({ children }: DrawerCloseProps): React.JSX.Element {
  const ctx = useDrawerScope('Drawer.Close');
  return <Slot onClick={ctx.onClose}>{children}</Slot>;
}

export interface DrawerFooterProps {
  /** Footer content, typically `Drawer.Close` wrappers around `Button`. */
  children?: ReactNode;
  /** Alignment of footer items along the main axis. @default 'end' */
  align?: DrawerFooterAlign;
}

function DrawerFooter({ children, align = 'end' }: DrawerFooterProps): React.JSX.Element {
  return <div className={styles.footer({ align })}>{children}</div>;
}

export interface DrawerContentProps extends BaseComponentProps {
  /** Required heading. Renders as `<h2>` and is wired up via `aria-labelledby`. */
  title: string;
  /** Optional sub-text. When present, wired up via `aria-describedby`. */
  description?: string;
  /** Edge to anchor against. @default 'right' */
  side?: DrawerSide;
  /** Cross-axis size. @default 'md' */
  size?: DrawerSize;
  /**
   * Allow Escape and backdrop click to close. @default true
   */
  dismissible?: boolean;
  /** Accessible label for the built-in close button. @default 'close' */
  dismissLabel?: string;
  /** Body content. A `Drawer.Footer` child is sliced off and pinned to the panel base. */
  children?: ReactNode;
}

const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  function DrawerContent(props, ref) {
    const ctx = useDrawerScope('Drawer.Content');
    if (!ctx.open) return null;
    if (typeof document === 'undefined') return null;
    return <DrawerPanel {...props} forwardedRef={ref} />;
  },
);

interface DrawerPanelProps extends DrawerContentProps {
  forwardedRef: Ref<HTMLDivElement>;
}

function partitionFooter(children: ReactNode): { body: ReactNode[]; footer: ReactNode | null } {
  const arr = Children.toArray(children);
  let footer: ReactNode | null = null;
  const body: ReactNode[] = [];
  for (const child of arr) {
    if (isValidElement(child) && child.type === DrawerFooter) {
      footer = child;
    } else {
      body.push(child);
    }
  }
  return { body, footer };
}

function DrawerPanel({
  title,
  description,
  side = 'right',
  size = 'md',
  dismissible = true,
  dismissLabel = 'close',
  children,
  id,
  'data-testid': dataTestId,
  forwardedRef,
}: DrawerPanelProps): React.ReactPortal {
  const ctx = useDrawerScope('Drawer.Content');
  const panelRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(panelRef, forwardedRef);

  useModalSurface(panelRef, {
    onDismiss: ctx.onClose,
    dismissible,
  });

  const { body, footer } = partitionFooter(children);

  return createPortal(
    <div className={styles.backdrop({ side })}>
      <div
        ref={mergedRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ctx.titleId}
        aria-describedby={description ? ctx.descriptionId : undefined}
        tabIndex={-1}
        id={id}
        data-testid={dataTestId}
        className={styles.panel({ side, size })}
      >
        <div className={styles.header}>
          <h2 id={ctx.titleId} className={styles.title}>
            {title}
          </h2>
          {description ? (
            <p id={ctx.descriptionId} className={styles.description}>
              {description}
            </p>
          ) : null}
        </div>
        {body.length > 0 ? <div className={styles.body}>{body}</div> : null}
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

export const Drawer = Object.assign(DrawerRoot, {
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Close: DrawerClose,
  Footer: DrawerFooter,
});
