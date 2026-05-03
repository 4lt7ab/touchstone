import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { createCompoundContext, useDisclosure, type UseDisclosureReturn } from '@touchstone/hooks';
import type { BaseComponentProps } from '@touchstone/atoms';
import * as styles from './Disclosure.css.js';

const [DisclosureProvider, useDisclosureScope] =
  createCompoundContext<UseDisclosureReturn>('Disclosure');

export interface DisclosureProps extends BaseComponentProps {
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  /** Called when the user toggles the disclosure. */
  onOpenChange?: (open: boolean) => void;
  /** A `Disclosure.Trigger` and `Disclosure.Content`, in either order. */
  children: ReactNode;
}

/**
 * Single-region show / hide widget. Wires `aria-expanded`, `aria-controls`,
 * and the matching content `id` automatically — the trigger and the content
 * share auto-generated ids through compound context, so the consumer never
 * mints them.
 */
const DisclosureRoot = forwardRef<HTMLDivElement, DisclosureProps>(function Disclosure(
  { open, defaultOpen, onOpenChange, children, id, 'data-testid': dataTestId },
  ref,
) {
  const ctx = useDisclosure({
    ...(open !== undefined ? { open } : {}),
    ...(defaultOpen !== undefined ? { defaultOpen } : {}),
    ...(onOpenChange ? { onOpenChange } : {}),
  });
  return (
    <DisclosureProvider value={ctx}>
      <div ref={ref} id={id} data-testid={dataTestId} className={styles.root}>
        {children}
      </div>
    </DisclosureProvider>
  );
});

export interface DisclosureTriggerProps extends BaseComponentProps {
  /** Trigger label. The chevron and aria wiring are added automatically. */
  children: ReactNode;
  /** Disable the trigger. */
  disabled?: boolean;
}

const DisclosureTrigger = forwardRef<HTMLButtonElement, DisclosureTriggerProps>(
  function DisclosureTrigger({ children, disabled, id, 'data-testid': dataTestId }, ref) {
    const ctx = useDisclosureScope('Disclosure.Trigger');
    return (
      <button
        ref={ref}
        type="button"
        id={id}
        data-testid={dataTestId}
        disabled={disabled}
        className={styles.trigger({})}
        aria-expanded={ctx.triggerProps['aria-expanded']}
        aria-controls={ctx.triggerProps['aria-controls']}
        onClick={ctx.triggerProps.onClick}
      >
        <span className={styles.triggerLabel}>{children}</span>
        <span className={styles.chevron} aria-hidden="true" data-open={ctx.open ? 'true' : 'false'}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </span>
      </button>
    );
  },
);

export interface DisclosureContentProps extends Omit<BaseComponentProps, 'id'> {
  /** Region content. */
  children: ReactNode;
  /**
   * When set, the content is partially visible while collapsed — the first
   * `peek` lines render with a fade mask, and the trigger expands to the
   * full content. Use for long-form previews (release notes, project
   * context, post bodies) where a binary closed / open is too coarse.
   * Omit (the default) for the standard hidden-when-closed behavior.
   *
   * Sized via `max-height: ${peek}lh` (line-height units) so the clamp
   * survives any block formatting context inside the content. Tall block
   * children (headings, etc.) consume more than one `lh`, so with mixed
   * markdown the visible cut is approximate — the fade mask still resolves
   * cleanly at the boundary.
   */
  peek?: number;
}

const DisclosureContent = forwardRef<HTMLDivElement, DisclosureContentProps>(
  function DisclosureContent({ children, peek, 'data-testid': dataTestId }, ref) {
    const ctx = useDisclosureScope('Disclosure.Content');
    const peeking = peek !== undefined && peek > 0 && !ctx.open;
    const className = peeking ? `${styles.content} ${styles.peek}` : styles.content;
    const peekStyle = peeking
      ? ({ maxHeight: `${peek}lh` } as React.CSSProperties)
      : undefined;
    return (
      <div
        ref={ref}
        data-testid={dataTestId}
        id={ctx.contentProps.id}
        role={ctx.contentProps.role}
        hidden={peeking ? undefined : ctx.contentProps.hidden}
        data-peek={peeking ? String(peek) : undefined}
        className={className}
        style={peekStyle}
      >
        {children}
      </div>
    );
  },
);

export const Disclosure = Object.assign(DisclosureRoot, {
  Trigger: DisclosureTrigger,
  Content: DisclosureContent,
});
