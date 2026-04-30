import { forwardRef } from 'react';
import { useControllableState, useRovingFocus } from '@touchstone/hooks';
import type { BaseComponentProps } from '@touchstone/atoms';
import * as styles from './SegmentedControl.css.js';

export interface SegmentedControlOption<T extends string = string> {
  /** Unique value identifying this option. */
  value: T;
  /** Visible label. */
  label: string;
  /** Disable just this option. */
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string>
  extends BaseComponentProps {
  /** Option set. The first option is the default selection when uncontrolled and no `defaultValue` is given. */
  options: ReadonlyArray<SegmentedControlOption<T>>;
  /** Controlled selected value. */
  value?: T;
  /** Uncontrolled initial value. */
  defaultValue?: T;
  /** Called when selection changes. */
  onValueChange?: (value: T) => void;
  /** Disable the entire control. */
  disabled?: boolean;
  /** Size preset. @default 'md' */
  size?: 'sm' | 'md';
  /** Required ARIA label for the radio group. */
  'aria-label'?: string;
  /** Or labelledby — id of an external label element. */
  'aria-labelledby'?: string;
  /** Id of a description element (e.g. a Field hint or error). */
  'aria-describedby'?: string;
}

/**
 * One-of-N selector following the WAI-ARIA radiogroup pattern. Arrow keys
 * move focus AND selection between segments (typical radiogroup behavior);
 * `Home`/`End` jump to the ends. Visual styling reads from theme tokens —
 * the active segment uses `actionPrimary` + `accentFg`, matching the primary
 * `Button`.
 */
function SegmentedControlInner<T extends string>(
  {
    options,
    value: controlledValue,
    defaultValue,
    onValueChange,
    disabled,
    size = 'md',
    id,
    'data-testid': dataTestId,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
  }: SegmentedControlProps<T>,
  ref: React.Ref<HTMLDivElement>,
): React.JSX.Element {
  const fallback = (defaultValue ?? options[0]?.value) as T;
  const [value, setValue] = useControllableState<T>({
    value: controlledValue,
    defaultValue: fallback,
    onChange: onValueChange,
  });

  const activeIndex = options.findIndex((o) => o.value === value);
  const { itemRef, onKeyDown, getTabIndex } = useRovingFocus({
    count: options.length,
    activeIndex: activeIndex === -1 ? null : activeIndex,
  });

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled || undefined}
      id={id}
      data-testid={dataTestId}
      className={styles.root}
    >
      {options.map((option, i) => {
        const isChecked = option.value === value;
        const isDisabled = disabled || option.disabled;
        return (
          <button
            key={option.value}
            ref={itemRef(i)}
            type="button"
            role="radio"
            aria-checked={isChecked}
            disabled={isDisabled}
            tabIndex={getTabIndex(i)}
            className={styles.segment({ size })}
            onClick={() => {
              if (!isDisabled) setValue(option.value);
            }}
            onKeyDown={(e) => {
              onKeyDown(i)(e);
              // Radiogroup convention: arrow keys also change selection.
              if (
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === 'Home' ||
                e.key === 'End'
              ) {
                const nextIndex =
                  e.key === 'ArrowRight'
                    ? (i + 1) % options.length
                    : e.key === 'ArrowLeft'
                      ? (i - 1 + options.length) % options.length
                      : e.key === 'Home'
                        ? 0
                        : options.length - 1;
                const nextOption = options[nextIndex];
                if (nextOption && !nextOption.disabled && !disabled) {
                  setValue(nextOption.value);
                }
              }
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export const SegmentedControl = forwardRef(SegmentedControlInner) as <
  T extends string = string,
>(
  props: SegmentedControlProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.JSX.Element;
