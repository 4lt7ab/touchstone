import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { Avatar } from '@touchstone/atoms';
import type { BaseComponentProps } from '@touchstone/atoms';
import { BotIcon, WrenchIcon } from '@touchstone/icons';
import * as styles from './Message.css.js';

export type MessageAuthor = 'user' | 'assistant' | 'system' | 'tool';
export type MessageState = 'complete' | 'streaming' | 'error';
export type MessageAlign = 'start' | 'end' | 'stretch';

/**
 * Single conversational turn. The `author` drives the default visual
 * treatment — user turns are accent-tinted bubbles aligned to the trailing
 * edge, assistant turns are raised surfaces aligned to the leading edge,
 * system / tool turns are full-width subtle bands.
 *
 * `state='streaming'` appends a blinking caret to the body, the standard
 * cue that the message is still being composed. `state='error'` switches
 * the bubble to the danger pair so a failed turn reads from across the room.
 *
 * Compose anything inside `children` — a string, a `Markdown` block, a
 * `ToolCall`, or a stack of these. The kit doesn't constrain the body
 * because chat content varies wildly per consumer.
 */
export interface MessageProps extends BaseComponentProps {
  /** Who produced the turn. Drives default avatar, alignment, and bubble tone. */
  author: MessageAuthor;
  /** Visible author label (e.g. "GPT-4", "You"). */
  authorName?: ReactNode;
  /**
   * Avatar slot. Pass `null` to suppress; omit to let the kit render a
   * default (bot icon for `assistant`, wrench for `tool`, nothing else).
   */
  avatar?: ReactNode;
  /** Timestamp shown beside the author name — `RelativeTime`, `Time`, or any string. */
  timestamp?: ReactNode;
  /** Composition state — `streaming` adds the live caret. @default 'complete' */
  state?: MessageState;
  /**
   * Override the default alignment derived from `author` (user → end,
   * everything else → start). Use `stretch` for full-width content.
   */
  align?: MessageAlign;
  /** Body content. */
  children?: ReactNode;
  /** Action row docked beneath the bubble (typically a `<MessageActions />`). */
  actions?: ReactNode;
  /** ARIA role override — defaults to `article` so screen readers treat each turn as a landmark. */
  role?: string;
  'aria-label'?: string;
}

function defaultAvatar(author: MessageAuthor): ReactNode {
  switch (author) {
    case 'assistant':
      return (
        <Avatar tone="accent" size="md" shape="round" aria-label="Assistant">
          <BotIcon size={14} />
        </Avatar>
      );
    case 'tool':
      return (
        <Avatar tone="muted" size="md" shape="square" aria-label="Tool">
          <WrenchIcon size={14} />
        </Avatar>
      );
    default:
      return null;
  }
}

function defaultAlign(author: MessageAuthor): MessageAlign {
  if (author === 'user') return 'end';
  if (author === 'system' || author === 'tool') return 'stretch';
  return 'start';
}

export const Message = forwardRef<HTMLElement, MessageProps>(function Message(
  {
    author,
    authorName,
    avatar,
    timestamp,
    state = 'complete',
    align,
    children,
    actions,
    role = 'article',
    id,
    'data-testid': dataTestId,
    'aria-label': ariaLabel,
  },
  ref,
) {
  const resolvedAlign = align ?? defaultAlign(author);
  const resolvedAvatar = avatar === undefined ? defaultAvatar(author) : avatar;
  const showHeader = Boolean(authorName || timestamp);

  return (
    <article
      ref={ref as React.Ref<HTMLElement>}
      id={id}
      data-testid={dataTestId}
      role={role}
      aria-label={ariaLabel}
      aria-busy={state === 'streaming' || undefined}
      data-author={author}
      data-state={state}
      className={styles.row({ align: resolvedAlign })}
    >
      {resolvedAvatar}
      <div className={styles.column({ align: resolvedAlign })}>
        {showHeader ? (
          <div className={styles.header}>
            {authorName ? <span className={styles.authorName}>{authorName}</span> : null}
            {timestamp ? <span>{timestamp}</span> : null}
          </div>
        ) : null}
        <div className={styles.bubble({ author, state })}>
          <span className={styles.body}>{children}</span>
          {state === 'streaming' ? (
            <span aria-hidden="true" className={styles.caret} />
          ) : null}
        </div>
        {actions ? <div className={styles.actionRow}>{actions}</div> : null}
      </div>
    </article>
  );
});
