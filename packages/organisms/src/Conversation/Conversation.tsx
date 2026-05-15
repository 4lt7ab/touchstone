import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { Button } from '@touchstone/atoms';
import type { BaseComponentProps } from '@touchstone/atoms';
import { ChevronDownIcon } from '@touchstone/icons';
import * as styles from './Conversation.css.js';

export type ConversationWidth = 'narrow' | 'reading' | 'wide' | 'full';

const STICK_THRESHOLD_PX = 64;

/**
 * Scrollable transcript with anchored auto-scroll. While the user is near
 * the bottom of the scroll viewport, new content (or a streaming token
 * update) pulls the viewport down. Scroll up to detach — a floating "Jump
 * to latest" affordance reattaches on click.
 *
 * Pair with `<Composer>` in the `composer` slot for a sticky footer, and
 * with `<TypingIndicator>` (or any node) in `typing` for the "thinking"
 * row. The messages container carries `role='log'` + `aria-live='polite'`
 * so screen readers announce new entries without interrupting the user.
 */
export interface ConversationProps extends BaseComponentProps {
  /** Message list — typically a stream of `<Message>` elements. */
  children?: ReactNode;
  /** Sticky footer slot — typically a `<Composer>`. */
  composer?: ReactNode;
  /** "Assistant is thinking" row, shown beneath the last message while present. */
  typing?: ReactNode;
  /** Rendered in place of the message list when there are no children. */
  emptyState?: ReactNode;
  /** Reading-width clamp for messages and composer. @default 'reading' */
  width?: ConversationWidth;
  /** Accessible label for the conversation log. @default 'Conversation' */
  'aria-label'?: string;
  /** Override for the "Jump to latest" button label. */
  jumpToLatestLabel?: string;
}

export const Conversation = forwardRef<HTMLDivElement, ConversationProps>(function Conversation(
  {
    children,
    composer,
    typing,
    emptyState,
    width = 'reading',
    id,
    'data-testid': dataTestId,
    'aria-label': ariaLabel = 'Conversation',
    jumpToLatestLabel = 'Jump to latest',
  },
  ref,
) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [pinnedToEnd, setPinnedToEnd] = useState(true);

  const isNearBottom = useCallback((): boolean => {
    const el = scrollRef.current;
    if (!el) return true;
    const distance = el.scrollHeight - (el.scrollTop + el.clientHeight);
    return distance <= STICK_THRESHOLD_PX;
  }, []);

  const scrollToEnd = useCallback((behavior: ScrollBehavior = 'auto'): void => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  useLayoutEffect(() => {
    scrollToEnd('auto');
  }, [scrollToEnd]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const observer = new ResizeObserver(() => {
      if (pinnedToEnd) scrollToEnd('auto');
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [pinnedToEnd, scrollToEnd]);

  const handleScroll = (): void => {
    setPinnedToEnd(isNearBottom());
  };

  const handleJumpToLatest = (): void => {
    setPinnedToEnd(true);
    scrollToEnd('smooth');
  };

  const hasMessages = Array.isArray(children)
    ? children.some((c) => c !== null && c !== undefined && c !== false)
    : Boolean(children);

  return (
    <div
      ref={ref}
      id={id}
      data-testid={dataTestId}
      aria-label={ariaLabel}
      className={styles.root}
    >
      <div
        ref={scrollRef}
        className={styles.scrollArea}
        onScroll={handleScroll}
        tabIndex={0}
      >
        <div ref={contentRef}>
          {hasMessages ? (
            <div
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
              className={styles.messageList({ width })}
            >
              {children}
              {typing ? <div className={styles.typingRow}>{typing}</div> : null}
            </div>
          ) : (
            <div className={styles.empty}>{emptyState}</div>
          )}
        </div>
      </div>
      {!pinnedToEnd ? (
        <div className={styles.jumpToLatest}>
          <Button
            intent="secondary"
            size="sm"
            shape="square"
            aria-label={jumpToLatestLabel}
            onClick={handleJumpToLatest}
          >
            <ChevronDownIcon size={16} />
          </Button>
        </div>
      ) : null}
      {composer ? (
        <div className={styles.footer}>
          <div className={styles.footerInner({ width })}>{composer}</div>
        </div>
      ) : null}
    </div>
  );
});
