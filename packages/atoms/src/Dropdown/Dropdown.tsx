import { forwardRef, useCallback, useId, useMemo, useRef, useState } from 'react';
import type { AriaAttributes, FocusEventHandler } from 'react';
import { useControllableState, useMergedRefs } from '@touchstone/hooks';
import type { BaseComponentProps } from '../types.js';
import {
  ChevronGlyph,
  DropdownListbox,
  HiddenSelectInput,
  firstEnabledIndex,
  flattenOptions,
  getOptionId,
  useDropdownKeydown,
  type DropdownOptionList,
  type DropdownShape,
  type DropdownSize,
  type DropdownTone,
} from './internals.js';
import * as styles from './Dropdown.css.js';

/**
 * Single-select form field — a styled `<select>` replacement with a
 * keyboard-navigable listbox. Pair with `Field` from `@touchstone/molecules`
 * for label / hint / error wiring (pass `invalid` explicitly when wrapped:
 * `Field` clones id and aria-describedby but does not propagate `invalid`).
 *
 * For a typeable variant, see `Combobox`. For multi-value, see `MultiSelect`.
 */
export interface DropdownProps extends BaseComponentProps {
  /** Selectable options. Pass flat `DropdownOption[]` or mix in `DropdownOptionGroup`s. */
  options: DropdownOptionList;
  /** Controlled selected value, or `null` for nothing selected. */
  value?: string | null;
  /** Uncontrolled initial selected value. @default null */
  defaultValue?: string | null;
  /** Called when the selected value changes. */
  onChange?: (value: string) => void;
  /** Placeholder shown when no value is selected. */
  placeholder?: string;
  /** Visual size. @default 'md' */
  size?: DropdownSize;
  /**
   * Trigger silhouette. `'select'` is the default form-field shape; `'badge'`
   * renders a compact pill mirroring the `Badge` atom — for inline filter
   * chips, status pickers, and other compact value selectors. The badge shape
   * sets its own metrics; `size` continues to drive the listbox.
   * @default 'select'
   */
  shape?: DropdownShape;
  /**
   * Colour palette for the badge-shaped trigger. Mirrors `Badge`'s `tone`.
   * Has no visible effect when `shape` is `'select'`. @default 'neutral'
   */
  tone?: DropdownTone;
  /** Marks the trigger as invalid; pair with `Field`'s `error` prop. */
  invalid?: boolean;
  /** Disable the field. */
  disabled?: boolean;
  /** Mark as required for native form submission. */
  required?: boolean;
  /** Form name — when set, a hidden `<input>` carries the value into form data. */
  name?: string;
  /** Form id this field belongs to (when rendered outside its `<form>`). */
  form?: string;
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  /** Called when the listbox opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Message shown when there are no options. @default 'No options' */
  emptyMessage?: React.ReactNode;
  /** Focus and blur handlers. */
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  'aria-label'?: AriaAttributes['aria-label'];
  'aria-labelledby'?: AriaAttributes['aria-labelledby'];
  'aria-describedby'?: AriaAttributes['aria-describedby'];
  'aria-invalid'?: AriaAttributes['aria-invalid'];
}

export const Dropdown = forwardRef<HTMLButtonElement, DropdownProps>(function Dropdown(
  {
    options,
    value: controlledValue,
    defaultValue = null,
    onChange,
    placeholder,
    size = 'md',
    shape = 'select',
    tone = 'neutral',
    invalid = false,
    disabled = false,
    required,
    name,
    form,
    open: controlledOpen,
    defaultOpen,
    onOpenChange,
    emptyMessage,
    onFocus,
    onBlur,
    id: providedId,
    'data-testid': dataTestId,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
  },
  ref,
) {
  const reactId = useId();
  const id = providedId ?? reactId;
  const listboxId = `${id}-listbox`;

  const [value, setValue] = useControllableState<string | null>({
    value: controlledValue,
    defaultValue,
    onChange: onChange as ((next: string | null) => void) | undefined,
  });

  const [open, setOpen] = useControllableState<boolean>({
    value: controlledOpen,
    defaultValue: defaultOpen ?? false,
    onChange: onOpenChange,
  });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const mergedRef = useMergedRefs<HTMLButtonElement>(buttonRef, ref);

  const flatOptions = useMemo(() => flattenOptions(options), [options]);

  const initialActiveIndex = useMemo(() => {
    if (value !== null) {
      const idx = flatOptions.findIndex((o) => o.value === value);
      if (idx !== -1 && !flatOptions[idx]?.disabled) return idx;
    }
    return firstEnabledIndex(flatOptions);
  }, [flatOptions, value]);
  const [activeIndex, setActiveIndex] = useState<number>(initialActiveIndex);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (next) {
        if (value !== null) {
          const idx = flatOptions.findIndex((o) => o.value === value);
          if (idx !== -1 && !flatOptions[idx]?.disabled) {
            setActiveIndex(idx);
            return;
          }
        }
        const first = firstEnabledIndex(flatOptions);
        if (first !== -1) setActiveIndex(first);
      }
    },
    [setOpen, flatOptions, value],
  );

  const handleSelect = useCallback(
    (next: string) => {
      setValue(next);
    },
    [setValue],
  );

  const onKeyDown = useDropdownKeydown({
    open,
    setOpen: handleOpenChange,
    options: flatOptions,
    activeIndex,
    setActiveIndex,
    onSelect: handleSelect,
    closeOnSelect: true,
  });

  const selectedOption = value !== null ? flatOptions.find((o) => o.value === value) : undefined;
  const selectedValues = useMemo(
    () => new Set<string>(value !== null ? [value] : []),
    [value],
  );

  const activeDescendantId =
    open && flatOptions[activeIndex]
      ? getOptionId(listboxId, flatOptions[activeIndex]!.value)
      : undefined;

  return (
    <>
      <button
        ref={mergedRef}
        type="button"
        role="combobox"
        id={id}
        data-testid={dataTestId}
        className={styles.trigger({ size, shape, tone, invalid, open })}
        disabled={disabled}
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={activeDescendantId}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid ?? (invalid || undefined)}
        aria-required={required || undefined}
        onClick={() => {
          if (disabled) return;
          handleOpenChange(!open);
        }}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <span
          className={
            selectedOption ? styles.triggerLabel : `${styles.triggerLabel} ${styles.placeholder}`
          }
        >
          {selectedOption ? selectedOption.label : (placeholder ?? ' ')}
        </span>
        <ChevronGlyph size={shape === 'badge' ? 'sm' : 'md'} />
      </button>
      <DropdownListbox
        open={open && !disabled}
        anchorRef={buttonRef}
        triggerRef={buttonRef}
        listboxId={listboxId}
        ariaLabelledBy={ariaLabelledBy}
        options={options}
        flatOptions={flatOptions}
        selectedValues={selectedValues}
        activeIndex={activeIndex}
        multi={false}
        size={size}
        matchAnchorWidth={shape !== 'badge'}
        onSelect={(v) => {
          handleSelect(v);
          setOpen(false);
          buttonRef.current?.focus();
        }}
        onClose={() => setOpen(false)}
        emptyMessage={emptyMessage}
      />
      {name ? (
        <HiddenSelectInput
          name={name}
          value={value ?? ''}
          required={required}
          form={form}
          disabled={disabled}
        />
      ) : null}
    </>
  );
});
