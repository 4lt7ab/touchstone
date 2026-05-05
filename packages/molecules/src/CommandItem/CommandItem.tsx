import { forwardRef } from 'react';
import type {
  AriaAttributes,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
} from 'react';
import type { BaseComponentProps } from '@touchstone/atoms';
import * as styles from './CommandItem.css.js';

/**
 * A single row in a command-palette-style list. Cousin of `NavItem`, with
 * two differences: `description` (a secondary line under the label) and a
 * `highlighted` visual that signals keyboard-cursor position rather than
 * navigation-active. The semantics is `role="option"` by default, which
 * fits a listbox or combobox surface — `CommandPalette` sets that up;
 * other parents (autocomplete dropdowns, search result lists) compose the
 * same row by passing the role they need.
 *
 * Build the row in isolation, then let envelopes drive selection/roving
 * focus through props (`highlighted`, `selected`, `onSelect`). The row
 * never dispatches keyboard events on its own — its parent is responsible
 * for arrow keys.
 */
export interface CommandItemProps extends BaseComponentProps {
  /** Primary label. Becomes the row's accessible name. */
  children?: ReactNode;
  /** Leading element — typically an icon. */
  icon?: ReactNode;
  /** Optional secondary line shown beneath the label. */
  description?: ReactNode;
  /** Trailing element — typically a `Kbd` shortcut hint. */
  shortcut?: ReactNode;
  /** Keyboard cursor highlight (different from navigation `selected`). */
  highlighted?: boolean;
  /**
   * `aria-selected` value — listbox/combobox semantics. Most palette uses
   * mirror `selected = highlighted`; some surfaces (multi-select) split them.
   */
  selected?: boolean;
  /** Visual emphasis. `danger` for destructive options. @default 'default' */
  tone?: 'default' | 'danger';
  /** Disable the row. */
  disabled?: boolean;
  /** Click activation — wrap your action here. */
  onSelect?: () => void;
  /** Pointer enter — used by parent envelopes to set highlight on hover. */
  onPointerEnter?: () => void;
  /** ARIA role override. @default 'option' */
  role?: string;
  /** Tab order — typically managed by a parent's keyboard handling. @default -1 */
  tabIndex?: number;
  'aria-label'?: AriaAttributes['aria-label'];
}

export const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(function CommandItem(
  {
    children,
    icon,
    description,
    shortcut,
    highlighted = false,
    selected,
    tone = 'default',
    disabled = false,
    onSelect,
    onPointerEnter,
    role = 'option',
    tabIndex = -1,
    id,
    'data-testid': dataTestId,
    'aria-label': ariaLabel,
  },
  ref,
) {
  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    if (disabled) return;
    e.preventDefault();
    onSelect?.();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.();
    }
  };

  return (
    <div
      ref={ref}
      role={role}
      id={id}
      data-testid={dataTestId}
      tabIndex={disabled ? -1 : tabIndex}
      aria-selected={selected ?? highlighted}
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel}
      data-highlighted={highlighted ? 'true' : undefined}
      className={styles.root({ highlighted, tone })}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerEnter={onPointerEnter}
    >
      {icon ? (
        <span className={styles.iconSlot} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className={styles.textBlock}>
        <span className={styles.label}>{children}</span>
        {description ? <span className={styles.description}>{description}</span> : null}
      </span>
      {shortcut ? <span className={styles.trailingSlot}>{shortcut}</span> : null}
    </div>
  );
});
