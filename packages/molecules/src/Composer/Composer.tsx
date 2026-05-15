import { forwardRef, useCallback, useLayoutEffect, useRef } from 'react';
import type {
  ChangeEvent,
  KeyboardEvent,
  ReactNode,
} from 'react';
import { Button, Spinner } from '@touchstone/atoms';
import type { BaseComponentProps } from '@touchstone/atoms';
import { SendIcon } from '@touchstone/icons';
import { useControllableState, useMergedRefs } from '@touchstone/hooks';
import * as styles from './Composer.css.js';

export type ComposerState = 'idle' | 'sending' | 'streaming' | 'disabled';

/**
 * Chat composer — autosizing textarea + submit affordance + slots for
 * attachments and meta (token counter, model picker, etc). Defaults are
 * tuned for the modern keymap: `Enter` submits, `Shift+Enter` inserts a
 * newline, `Esc` clears the draft.
 *
 * Controlled with `value` + `onChange`, or uncontrolled with `defaultValue`.
 * The submit handler runs on activation regardless; the consumer decides
 * whether to clear the field afterwards by mutating `value`.
 */
export interface ComposerProps extends BaseComponentProps {
  /** Controlled value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Change handler. */
  onChange?: (next: string) => void;
  /** Called when the user submits — Enter (when allowed) or the send button. */
  onSubmit: (value: string) => void;
  /** Placeholder text. @default 'Message…' */
  placeholder?: string;
  /** Lifecycle state. `sending` / `streaming` / `disabled` lock the input. @default 'idle' */
  state?: ComposerState;
  /** Submit when Enter is pressed without Shift. @default true */
  submitOnEnter?: boolean;
  /** Clear the field on Escape. @default true */
  clearOnEscape?: boolean;
  /** Don't submit empty / whitespace-only drafts. @default true */
  blockEmptySubmit?: boolean;
  /** Visible row count when empty. @default 1 */
  minRows?: number;
  /** Auto-grow ceiling — past this, the textarea scrolls. @default 8 */
  maxRows?: number;
  /** Leading slot (attachments, model picker, …). */
  attachmentSlot?: ReactNode;
  /** Trailing meta slot (token counter, length, …). */
  metaSlot?: ReactNode;
  /** Submit button label / accessible name. @default 'Send' */
  submitLabel?: string;
  /** Hide the visible submit label and render an icon-only square button. @default false */
  iconOnlySubmit?: boolean;
  /** Auto-focus on mount. */
  autoFocus?: boolean;
  'aria-label'?: string;
}

function applyAutosize(el: HTMLTextAreaElement, minRows: number, maxRows: number): void {
  el.style.height = 'auto';
  const computed = window.getComputedStyle(el);
  const lineHeight = parseFloat(computed.lineHeight || '20') || 20;
  const paddingTop = parseFloat(computed.paddingTop || '0');
  const paddingBottom = parseFloat(computed.paddingBottom || '0');
  const minHeight = lineHeight * minRows + paddingTop + paddingBottom;
  const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom;
  const next = Math.max(minHeight, Math.min(el.scrollHeight, maxHeight));
  el.style.height = `${next}px`;
  el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
}

export const Composer = forwardRef<HTMLTextAreaElement, ComposerProps>(function Composer(
  {
    value,
    defaultValue,
    onChange,
    onSubmit,
    placeholder = 'Message…',
    state = 'idle',
    submitOnEnter = true,
    clearOnEscape = true,
    blockEmptySubmit = true,
    minRows = 1,
    maxRows = 8,
    attachmentSlot,
    metaSlot,
    submitLabel = 'Send',
    iconOnlySubmit = false,
    autoFocus,
    id,
    'data-testid': dataTestId,
    'aria-label': ariaLabel = 'Message composer',
  },
  ref,
) {
  const [draft, setDraft] = useControllableState<string>({
    ...(value !== undefined ? { value } : {}),
    defaultValue: defaultValue ?? '',
    ...(onChange ? { onChange } : {}),
  });

  const internalRef = useRef<HTMLTextAreaElement>(null);
  const mergedRef = useMergedRefs(internalRef, ref);

  useLayoutEffect(() => {
    const el = internalRef.current;
    if (!el) return;
    applyAutosize(el, minRows, maxRows);
  }, [draft, minRows, maxRows]);

  const locked = state === 'sending' || state === 'streaming' || state === 'disabled';
  const trimmedEmpty = blockEmptySubmit && draft.trim() === '';
  const submitDisabled = locked || trimmedEmpty;

  const handleSubmit = useCallback((): void => {
    if (submitDisabled) return;
    onSubmit(draft);
  }, [submitDisabled, onSubmit, draft]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setDraft(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (submitOnEnter && e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmit();
      return;
    }
    if (clearOnEscape && e.key === 'Escape' && draft.length > 0) {
      e.preventDefault();
      setDraft('');
    }
  };

  return (
    <div
      id={id}
      data-testid={dataTestId}
      data-state={state}
      aria-label={ariaLabel}
      role="group"
      className={styles.root({ state })}
    >
      <div className={styles.textareaRow}>
        <textarea
          ref={mergedRef}
          rows={minRows}
          value={draft}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={locked}
          autoFocus={autoFocus}
          aria-label={ariaLabel}
          className={styles.textarea}
        />
      </div>
      <div className={styles.footer}>
        <div className={styles.leftCluster}>{attachmentSlot}</div>
        <div className={styles.rightCluster}>
          {metaSlot ? <span className={styles.meta}>{metaSlot}</span> : null}
          {iconOnlySubmit ? (
            <Button
              intent="primary"
              size="sm"
              shape="square"
              aria-label={submitLabel}
              disabled={submitDisabled}
              onClick={handleSubmit}
            >
              {state === 'sending' ? (
                <Spinner size="sm" aria-hidden="true" />
              ) : (
                <SendIcon size={14} />
              )}
            </Button>
          ) : (
            <Button
              intent="primary"
              size="sm"
              disabled={submitDisabled}
              onClick={handleSubmit}
              icon={
                state === 'sending' ? (
                  <Spinner size="sm" aria-hidden="true" />
                ) : (
                  <SendIcon size={14} />
                )
              }
            >
              {submitLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});
