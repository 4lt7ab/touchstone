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
}

const DisclosureContent = forwardRef<HTMLDivElement, DisclosureContentProps>(
  function DisclosureContent({ children, 'data-testid': dataTestId }, ref) {
    const ctx = useDisclosureScope('Disclosure.Content');
    return (
      <div
        ref={ref}
        data-testid={dataTestId}
        id={ctx.contentProps.id}
        role={ctx.contentProps.role}
        hidden={ctx.contentProps.hidden}
        className={styles.content}
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
