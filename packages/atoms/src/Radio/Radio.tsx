import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
} from 'react';
import type { AriaAttributes, KeyboardEvent, ReactElement, ReactNode, Ref } from 'react';
import { useControllableState, useRovingFocus } from '@touchstone/hooks';
import type { BaseComponentProps } from '../types.js';
import * as styles from './Radio.css.js';

interface RadioGroupContextValue {
  value: string | undefined;
  setValue: (next: string) => void;
  name: string | undefined;
  disabled: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);
RadioGroupContext.displayName = 'RadioGroupContext';

function useRadioGroup(consumerName: string): RadioGroupContextValue {
  const ctx = useContext(RadioGroupContext);
  if (ctx === null) {
    throw new Error(`<${consumerName}> must be rendered inside <RadioGroup>.`);
  }
  return ctx;
}

interface InjectedRadioProps {
  ref?: Ref<HTMLButtonElement>;
  tabIndex?: number;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
}

export interface RadioGroupProps extends BaseComponentProps {
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Called when the selected value changes. */
  onValueChange?: (value: string) => void;
  /** Disable every radio in the group. */
  disabled?: boolean;
  /** Form name for native form participation (a hidden input is rendered). */
  name?: string;
  /** Required ARIA label for the radio group. */
  'aria-label'?: AriaAttributes['aria-label'];
  /** Or labelledby — id of an external label element. */
  'aria-labelledby'?: AriaAttributes['aria-labelledby'];
  /** Id of a description element (e.g. a Field hint or error). */
  'aria-describedby'?: AriaAttributes['aria-describedby'];
  /** `Radio` children. */
  children?: ReactNode;
}

/**
 * Vertical-list one-of-N selector following the WAI-ARIA radiogroup
 * pattern. Arrow up / arrow down move focus AND selection between radios;
 * Home / End jump to the ends. Use for forms where each option benefits
 * from a longer label or description (settings pages, plan pickers); for
 * the compact button-strip equivalent, use `SegmentedControl`.
 *
 * Wrap with `Field` for a labelled group with hint and error wiring.
 */
const RadioGroupRoot = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    value: controlledValue,
    defaultValue,
    onValueChange,
    disabled = false,
    name,
    children,
    id,
    'data-testid': dataTestId,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
  },
  ref,
) {
  const [value, setValue] = useControllableState<string | undefined>({
    value: controlledValue,
    defaultValue: defaultValue,
    onChange: onValueChange as ((next: string | undefined) => void) | undefined,
  });

  const items = Children.toArray(children).filter(
    (c): c is ReactElement<RadioProps & InjectedRadioProps> => isValidElement(c),
  );
  const values = items.map((c) => c.props.value);
  const activeIndex = value === undefined ? -1 : values.indexOf(value);

  const { itemRef, onKeyDown, getTabIndex } = useRovingFocus({
    count: items.length,
    activeIndex: activeIndex === -1 ? null : activeIndex,
    orientation: 'vertical',
  });

  const cloned = items.map((child, i) => {
    const existingOnKeyDown = child.props.onKeyDown;
    return cloneElement(child, {
      ref: itemRef(i),
      tabIndex: getTabIndex(i),
      onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
        existingOnKeyDown?.(e);
        if (e.defaultPrevented) return;
        onKeyDown(i)(e);
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Home' || e.key === 'End') {
          const nextIndex =
            e.key === 'ArrowDown'
              ? (i + 1) % items.length
              : e.key === 'ArrowUp'
                ? (i - 1 + items.length) % items.length
                : e.key === 'Home'
                  ? 0
                  : items.length - 1;
          const nextChild = items[nextIndex];
          if (
            nextChild &&
            !nextChild.props.disabled &&
            !disabled &&
            nextChild.props.value !== undefined
          ) {
            setValue(nextChild.props.value);
          }
        }
      },
    });
  });

  return (
    <RadioGroupContext.Provider
      value={{
        value,
        setValue: setValue as (next: string) => void,
        name,
        disabled,
      }}
    >
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-disabled={disabled || undefined}
        id={id}
        data-testid={dataTestId}
        className={styles.group}
      >
        {cloned}
        {name ? <input type="hidden" name={name} value={value ?? ''} aria-hidden="true" /> : null}
      </div>
    </RadioGroupContext.Provider>
  );
});

export interface RadioProps extends BaseComponentProps {
  /** Unique value identifying this radio within the group. */
  value: string;
  /** Visible label content — strings or rich content. */
  children?: ReactNode;
  /** Optional supporting copy beneath the label. */
  description?: ReactNode;
  /** Disable just this radio. */
  disabled?: boolean;
  /** Override the ARIA label when there is no visible label. */
  'aria-label'?: AriaAttributes['aria-label'];
}

const Radio = forwardRef<HTMLButtonElement, RadioProps & InjectedRadioProps>(function Radio(
  {
    value,
    children,
    description,
    disabled: ownDisabled = false,
    'aria-label': ariaLabel,
    id,
    'data-testid': dataTestId,
    tabIndex,
    onKeyDown,
  },
  ref,
) {
  const ctx = useRadioGroup('Radio');
  const isChecked = ctx.value === value;
  const isDisabled = ctx.disabled || ownDisabled;

  return (
    <label className={styles.row} data-disabled={isDisabled ? 'true' : undefined}>
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={isChecked}
        aria-label={ariaLabel}
        disabled={isDisabled}
        tabIndex={tabIndex}
        onKeyDown={onKeyDown}
        id={id}
        data-testid={dataTestId}
        className={styles.indicator({})}
        onClick={() => {
          if (!isDisabled) ctx.setValue(value);
        }}
      >
        {isChecked ? <span className={styles.dot} aria-hidden="true" /> : null}
      </button>
      {children || description ? (
        <span className={styles.label}>
          {children ? <span>{children}</span> : null}
          {description ? (
            <span
              style={{
                fontSize: 'inherit',
                opacity: 0.7,
              }}
            >
              {description}
            </span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
});

export const RadioGroup = Object.assign(RadioGroupRoot, { Radio });
export { Radio };
