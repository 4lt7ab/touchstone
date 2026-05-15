import { forwardRef, useId } from 'react';
import type { ReactNode, Ref } from 'react';
import { createPortal } from 'react-dom';
import { createCompoundContext, useDisclosure } from '@touchstone/hooks';
import { Button, Slot } from '@touchstone/atoms';
import type { BaseComponentProps } from '@touchstone/atoms';
import { useAppShellSlot } from '../AppShell/appShellSlot.js';
import * as styles from './Dock.css.js';

interface DockContextValue {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  titleId: string;
}

const [DockProvider, useDockScope] = createCompoundContext<DockContextValue>('Dock');

export type DockSize = 'sm' | 'md' | 'lg';
export type DockWidth = 'full' | 'reading';
export type DockChrome = 'standard' | 'bare';

export interface DockProps extends BaseComponentProps {
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  /** Called when the dock wants to open or close. */
  onOpenChange?: (open: boolean) => void;
  /** A `Dock.Trigger`, a `Dock.Content`, and any `Dock.Close` inside. */
  children: ReactNode;
}

/**
 * Non-modal panel that floats at the bottom of the viewport. Sits at
 * `position: fixed` along the bottom edge — does not take layout space,
 * does not lock scroll, does not trap focus. The user can keep working in
 * the page above while the dock stays summoned. Best for transport bars,
 * mini-players, logs / console panels, status footers.
 *
 * Sibling of `Drawer` (modal, edge-anchored) and `Dialog` (modal, centered).
 * Reach for `Dock` when the panel is companion to the page, not a takeover
 * of it.
 *
 * When rendered inside an `AppShell` dock slot the Dock auto-wires to the
 * shell's open/onOpenChange pair via context. Explicit `open` /
 * `onOpenChange` props win over the slot, so standalone use (a Dock
 * triggered from inside `children`) keeps its own state.
 */
function DockRoot({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  children,
}: DockProps): React.JSX.Element {
  const slot = useAppShellSlot();
  const effectiveOpen = controlledOpen ?? slot?.open;
  const effectiveOnChange = onOpenChange ?? slot?.onOpenChange;
  const { open, onOpen, onClose } = useDisclosure({
    ...(effectiveOpen !== undefined ? { open: effectiveOpen } : {}),
    ...(defaultOpen !== undefined ? { defaultOpen } : {}),
    ...(effectiveOnChange ? { onOpenChange: effectiveOnChange } : {}),
  });
  const titleId = useId();

  return <DockProvider value={{ open, onOpen, onClose, titleId }}>{children}</DockProvider>;
}

export interface DockTriggerProps {
  /** A single element to use as the trigger; receives an `onClick` handler. */
  children: ReactNode;
}

function DockTrigger({ children }: DockTriggerProps): React.JSX.Element {
  const ctx = useDockScope('Dock.Trigger');
  return <Slot onClick={ctx.onOpen}>{children}</Slot>;
}

export interface DockCloseProps {
  /** A single element to use as a close affordance; receives an `onClick` handler. */
  children: ReactNode;
}

function DockClose({ children }: DockCloseProps): React.JSX.Element {
  const ctx = useDockScope('Dock.Close');
  return <Slot onClick={ctx.onClose}>{children}</Slot>;
}

export interface DockContentProps extends BaseComponentProps {
  /**
   * Required heading. With `chrome="standard"` it renders as a visible
   * `<h2>` wired up via `aria-labelledby`. With `chrome="bare"` no heading
   * renders — the title is forwarded to `aria-label` on the region so
   * assistive tech still names the surface.
   */
  title: string;
  /** Vertical size of the panel. @default 'md' */
  size?: DockSize;
  /**
   * Horizontal geometry. `'full'` stretches edge-to-edge (default — good
   * for logs / status panels). `'reading'` centers a max-width column and
   * floats slightly above the viewport bottom — the natural shape for an
   * AI chatbox / "ask anything" composer. @default 'full'
   */
  width?: DockWidth;
  /**
   * Visible affordances around the dock body. `'standard'` (default)
   * renders the title row with dismiss + `actions`. `'bare'` drops the
   * header row and zeroes the body padding so the consumer owns the
   * entire panel surface — designed to host an edge-to-edge `<Composer>`
   * for AI chatboxes, search pills, or similar full-surface inputs.
   * @default 'standard'
   */
  chrome?: DockChrome;
  /**
   * Render a built-in dismiss button in the dock header. Ignored when
   * `chrome="bare"`. @default true
   */
  dismissible?: boolean;
  /** Accessible label for the built-in dismiss button. @default 'close' */
  dismissLabel?: string;
  /** Trailing actions rendered in the header (next to the dismiss button). */
  actions?: ReactNode;
  /** Body content. */
  children?: ReactNode;
}

const DockContent = forwardRef<HTMLElement, DockContentProps>(function DockContent(props, ref) {
  const ctx = useDockScope('Dock.Content');
  if (!ctx.open) return null;
  if (typeof document === 'undefined') return null;
  return <DockPanel {...props} forwardedRef={ref} />;
});

interface DockPanelProps extends DockContentProps {
  forwardedRef: Ref<HTMLElement>;
}

function DockPanel({
  title,
  size = 'md',
  width = 'full',
  chrome = 'standard',
  dismissible = true,
  dismissLabel = 'close',
  actions,
  children,
  id,
  'data-testid': dataTestId,
  forwardedRef,
}: DockPanelProps): React.ReactPortal {
  const ctx = useDockScope('Dock.Content');
  const bare = chrome === 'bare';
  return createPortal(
    <section
      ref={forwardedRef}
      role="region"
      aria-labelledby={bare ? undefined : ctx.titleId}
      aria-label={bare ? title : undefined}
      id={id}
      data-testid={dataTestId}
      className={styles.panel({ size, width })}
    >
      {bare ? null : (
        <div className={styles.header}>
          <h2 id={ctx.titleId} className={styles.title}>
            {title}
          </h2>
          {actions || dismissible ? (
            <div className={styles.actions}>
              {actions}
              {dismissible ? (
                <Button
                  intent="ghost"
                  shape="square"
                  size="sm"
                  aria-label={dismissLabel}
                  onClick={ctx.onClose}
                >
                  <DismissGlyph />
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
      <div className={styles.body({ padded: !bare })}>{children}</div>
    </section>,
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

export const Dock = Object.assign(DockRoot, {
  Trigger: DockTrigger,
  Content: DockContent,
  Close: DockClose,
});
