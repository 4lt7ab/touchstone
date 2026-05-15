import { forwardRef } from 'react';
import { Button } from '@touchstone/atoms';
import type { BaseComponentProps } from '@touchstone/atoms';
import {
  CopyIcon,
  RefreshIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from '@touchstone/icons';
import { Tooltip } from '../Tooltip/Tooltip.js';
import * as styles from './MessageActions.css.js';

/**
 * Icon-button row docked to a `Message`. Renders only the affordances whose
 * handlers are present, so consumers can mix copy / regenerate / rate per
 * surface — assistant turns typically get all four, user turns just copy.
 *
 * Each button is wrapped in a `Tooltip` so the (icon-only) action has a
 * visible hover label without forcing every parent to add one. The `liked`
 * and `disliked` flags drive `aria-pressed` so rating state survives a
 * screen-reader pass.
 */
export interface MessageActionsProps extends BaseComponentProps {
  /** Copy the message text to the clipboard. */
  onCopy?: () => void;
  /** Re-run the generation that produced this message. */
  onRegenerate?: () => void;
  /** Record a positive rating. */
  onLike?: () => void;
  /** Record a negative rating. */
  onDislike?: () => void;
  /** Show the like button as pressed. */
  liked?: boolean;
  /** Show the dislike button as pressed. */
  disliked?: boolean;
  /** Disable the entire row (e.g. while the message is still streaming). */
  disabled?: boolean;
  /** Tooltip + a11y labels — override per locale. */
  copyLabel?: string;
  regenerateLabel?: string;
  likeLabel?: string;
  dislikeLabel?: string;
}

export const MessageActions = forwardRef<HTMLDivElement, MessageActionsProps>(
  function MessageActions(
    {
      onCopy,
      onRegenerate,
      onLike,
      onDislike,
      liked = false,
      disliked = false,
      disabled = false,
      copyLabel = 'Copy',
      regenerateLabel = 'Regenerate',
      likeLabel = 'Good response',
      dislikeLabel = 'Bad response',
      id,
      'data-testid': dataTestId,
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        id={id}
        data-testid={dataTestId}
        role="toolbar"
        aria-label="Message actions"
        className={styles.root}
      >
        {onCopy ? (
          <Tooltip content={copyLabel}>
            <Button
              intent="ghost"
              shape="square"
              size="sm"
              aria-label={copyLabel}
              disabled={disabled}
              onClick={onCopy}
            >
              <CopyIcon size={14} />
            </Button>
          </Tooltip>
        ) : null}
        {onRegenerate ? (
          <Tooltip content={regenerateLabel}>
            <Button
              intent="ghost"
              shape="square"
              size="sm"
              aria-label={regenerateLabel}
              disabled={disabled}
              onClick={onRegenerate}
            >
              <RefreshIcon size={14} />
            </Button>
          </Tooltip>
        ) : null}
        {onLike ? (
          <Tooltip content={likeLabel}>
            <Button
              intent="ghost"
              shape="square"
              size="sm"
              aria-label={likeLabel}
              aria-pressed={liked}
              disabled={disabled}
              onClick={onLike}
            >
              <ThumbsUpIcon size={14} />
            </Button>
          </Tooltip>
        ) : null}
        {onDislike ? (
          <Tooltip content={dislikeLabel}>
            <Button
              intent="ghost"
              shape="square"
              size="sm"
              aria-label={dislikeLabel}
              aria-pressed={disliked}
              disabled={disabled}
              onClick={onDislike}
            >
              <ThumbsDownIcon size={14} />
            </Button>
          </Tooltip>
        ) : null}
      </div>
    );
  },
);
