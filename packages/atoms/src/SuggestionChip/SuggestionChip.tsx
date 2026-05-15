import { forwardRef } from 'react';
import type {
  AriaAttributes,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
} from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { BaseComponentProps } from '../types.js';
import { chip, iconSlot } from './SuggestionChip.css.js';

type SuggestionChipVariants = NonNullable<RecipeVariants<typeof chip>>;

/**
 * Pill-shaped quick-reply button. Distinct from `Button` by intent: denser,
 * always rounded, never the primary action — used in wrapping rows of
 * starter prompts or quick replies under a `Composer` or `Message`. Pair
 * several inside a `Stack direction='row' wrap`.
 *
 * The label is the accessible name; pass `aria-label` only when the visible
 * text is purely decorative (e.g. an emoji-only chip).
 */
export interface SuggestionChipProps extends BaseComponentProps, SuggestionChipVariants {
  /** Visible label. Becomes the accessible name. */
  children?: ReactNode;
  /** Leading element — typically a small icon. Hidden from a11y. */
  icon?: ReactNode;
  /** Click handler. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Keyboard handler (rarely needed — parents typically drive arrow-key behavior). */
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
  /** Disable the chip. */
  disabled?: boolean;
  /** Auto-focus on mount. */
  autoFocus?: boolean;
  /** Tab order. */
  tabIndex?: number;
  'aria-label'?: AriaAttributes['aria-label'];
  'aria-pressed'?: AriaAttributes['aria-pressed'];
}

export const SuggestionChip = forwardRef<HTMLButtonElement, SuggestionChipProps>(
  function SuggestionChip(
    {
      size,
      tone,
      icon,
      children,
      onClick,
      onKeyDown,
      disabled = false,
      autoFocus,
      tabIndex,
      id,
      'data-testid': dataTestId,
      'aria-label': ariaLabel,
      'aria-pressed': ariaPressed,
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        id={id}
        data-testid={dataTestId}
        disabled={disabled}
        autoFocus={autoFocus}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        aria-pressed={ariaPressed}
        onClick={onClick}
        onKeyDown={onKeyDown}
        className={chip({ size, tone })}
      >
        {icon ? (
          <span className={iconSlot} aria-hidden="true">
            {icon}
          </span>
        ) : null}
        {children}
      </button>
    );
  },
);
