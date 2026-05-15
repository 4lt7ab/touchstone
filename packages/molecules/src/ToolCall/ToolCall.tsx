import { forwardRef, useId } from 'react';
import type { ReactNode } from 'react';
import { Badge, Spinner } from '@touchstone/atoms';
import type { BaseComponentProps } from '@touchstone/atoms';
import { ChevronDownIcon, WrenchIcon } from '@touchstone/icons';
import { useDisclosure } from '@touchstone/hooks';
import * as styles from './ToolCall.css.js';

export type ToolCallStatus = 'pending' | 'success' | 'error';

/**
 * Collapsible record of an agentic tool invocation. Built on `useDisclosure`
 * for the show/hide wiring; the summary line carries the tool name, a
 * status badge, and a chevron, and the body holds whatever the caller
 * passes (typically a `<Code block language='json'>` of the arguments
 * followed by a result block).
 *
 * Defaults are tuned for the common case: collapsed when complete, expanded
 * when pending so users can watch the call resolve, and the danger border
 * when an error landed so the row reads from across the room.
 */
export interface ToolCallProps extends BaseComponentProps {
  /** Tool / function name. */
  name: string;
  /** Lifecycle state of the call. @default 'pending' */
  status?: ToolCallStatus;
  /** Controlled open state. */
  open?: boolean;
  /**
   * Uncontrolled initial open state. Defaults to `true` for `pending`,
   * `false` for `success`, `true` for `error`.
   */
  defaultOpen?: boolean;
  /** Called when the user toggles the disclosure. */
  onOpenChange?: (open: boolean) => void;
  /** Arguments slot — typically a `<Code block language='json'>`. */
  args?: ReactNode;
  /** Result slot — anything the tool produced. */
  result?: ReactNode;
  /** Section labels — override per locale. */
  argsLabel?: string;
  resultLabel?: string;
}

function defaultOpenFor(status: ToolCallStatus): boolean {
  return status !== 'success';
}

function statusBadge(status: ToolCallStatus): React.JSX.Element {
  switch (status) {
    case 'pending':
      return (
        <Badge tone="info">
          <Spinner size="sm" aria-label="Running" /> running
        </Badge>
      );
    case 'success':
      return <Badge tone="success">done</Badge>;
    case 'error':
      return <Badge tone="danger">failed</Badge>;
  }
}

export const ToolCall = forwardRef<HTMLDivElement, ToolCallProps>(function ToolCall(
  {
    name,
    status = 'pending',
    open,
    defaultOpen,
    onOpenChange,
    args,
    result,
    argsLabel = 'Arguments',
    resultLabel = 'Result',
    id,
    'data-testid': dataTestId,
  },
  ref,
) {
  const argsId = useId();
  const resultId = useId();
  const ctx = useDisclosure({
    ...(open !== undefined ? { open } : {}),
    ...(defaultOpen !== undefined ? { defaultOpen } : { defaultOpen: defaultOpenFor(status) }),
    ...(onOpenChange ? { onOpenChange } : {}),
  });

  return (
    <div
      ref={ref}
      id={id}
      data-testid={dataTestId}
      data-status={status}
      className={styles.root({ status })}
    >
      <button
        type="button"
        className={styles.summary}
        aria-expanded={ctx.triggerProps['aria-expanded']}
        aria-controls={ctx.triggerProps['aria-controls']}
        onClick={ctx.triggerProps.onClick}
      >
        <span className={styles.iconSlot} aria-hidden="true">
          <WrenchIcon size={14} />
        </span>
        <span className={styles.name}>{name}</span>
        {statusBadge(status)}
        <span className={styles.chevron} aria-hidden="true" data-open={ctx.open ? 'true' : 'false'}>
          <ChevronDownIcon size={14} />
        </span>
      </button>
      <div
        id={ctx.contentProps.id}
        role={ctx.contentProps.role}
        hidden={ctx.contentProps.hidden}
        className={styles.body}
      >
        {args !== undefined ? (
          <section aria-labelledby={argsId}>
            <div id={argsId} className={styles.sectionLabel}>
              {argsLabel}
            </div>
            <div className={styles.sectionBody}>{args}</div>
          </section>
        ) : null}
        {result !== undefined ? (
          <section aria-labelledby={resultId}>
            <div id={resultId} className={styles.sectionLabel}>
              {resultLabel}
            </div>
            <div className={styles.sectionBody}>{result}</div>
          </section>
        ) : null}
      </div>
    </div>
  );
});
