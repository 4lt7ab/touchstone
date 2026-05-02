import { forwardRef, useCallback, useId, useMemo, useRef, useState } from 'react';
import type { AriaAttributes, FocusEventHandler, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { useControllableState, useMergedRefs } from '@touchstone/hooks';
import type { BaseComponentProps } from '../types.js';
import {
  ChevronGlyph,
  DropdownListbox,
  firstEnabledIndex,
  flattenOptions,
  getOptionId,
  useDropdownKeydown,
  type DropdownOptionList,
  type DropdownSize,
} from '../Dropdown/internals.js';
import * as styles from '../Dropdown/Dropdown.css.js';

/**
 * Multi-value form field. Selecting an option toggles it; the listbox stays
 * open so consecutive selections are cheap. Selected values render as inline
 * chips inside the trigger; each chip has a small remove button (mouse).
 * Backspace on the trigger removes the most recently added value when the
 * listbox is closed; opening the listbox and unchecking is the keyboard path
 * for removing an arbitrary value.
 *
 * Pass `selectAll` to render a "select all" row at the top of the listbox.
 * The row toggles between "all selected" and "none selected" based on its
 * mixed/checked state.
 *
 * Pair with `Field` for label / hint / error wiring; pass `invalid` only
 * if you set `error` on Field manually — Field propagates `invalid` to
 * wrapped children automatically. For native form participation, set `name`
 * — a hidden input is rendered for each selected value (under the same name).
 */
export interface MultiSelectProps extends BaseComponentProps {
  /** Selectable options. Pass flat or grouped. */
  options: DropdownOptionList;
  /** Controlled selected values. */
  value?: ReadonlyArray<string>;
  /** Uncontrolled initial selected values. @default [] */
  defaultValue?: ReadonlyArray<string>;
  /** Called when the selected values change. */
  onChange?: (values: string[]) => void;
  /** Placeholder shown when no values are selected. */
  placeholder?: string;
  /** Visual size. @default 'md' */
  size?: DropdownSize;
  /** Marks the trigger as invalid. */
  invalid?: boolean;
  /** Disable the field. */
  disabled?: boolean;
  /** Mark as required for native form submission. */
  required?: boolean;
  /** Form name — when set, a hidden `<input>` is rendered per selected value. */
  name?: string;
  /** Form id this field belongs to. */
  form?: string;
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  /** Called when the listbox opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Message shown when there are no options. */
  emptyMessage?: ReactNode;
  /**
   * Render a "select all" row at the top of the listbox. `true` uses the
   * default label ("Select all"); pass a string for a custom label.
   * @default false
   */
  selectAll?: boolean | string;
  onFocus?: FocusEventHandler<HTMLDivElement>;
  onBlur?: FocusEventHandler<HTMLDivElement>;
  'aria-label'?: AriaAttributes['aria-label'];
  'aria-labelledby'?: AriaAttributes['aria-labelledby'];
  'aria-describedby'?: AriaAttributes['aria-describedby'];
  'aria-invalid'?: AriaAttributes['aria-invalid'];
}

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(function MultiSelect(
  {
    options,
    value: controlledValue,
    defaultValue,
    onChange,
    placeholder,
    size = 'md',
    invalid = false,
    disabled = false,
    required,
    name,
    form,
    open: controlledOpen,
    defaultOpen,
    onOpenChange,
    emptyMessage,
    selectAll,
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

  const [valueArr, setValueArr] = useControllableState<ReadonlyArray<string>>({
    value: controlledValue,
    defaultValue: defaultValue ?? [],
    onChange: (next) => onChange?.([...next]),
  });

  const [open, setOpen] = useControllableState<boolean>({
    value: controlledOpen,
    defaultValue: defaultOpen ?? false,
    onChange: onOpenChange,
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs<HTMLDivElement>(triggerRef, ref);

  const flatOptions = useMemo(() => flattenOptions(options), [options]);

  const [activeIndex, setActiveIndex] = useState<number>(firstEnabledIndex(flatOptions));

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (next) {
        const lastValue = valueArr[valueArr.length - 1];
        if (lastValue !== undefined) {
          const idx = flatOptions.findIndex((o) => o.value === lastValue);
          if (idx !== -1 && !flatOptions[idx]?.disabled) {
            setActiveIndex(idx);
            return;
          }
        }
        const first = firstEnabledIndex(flatOptions);
        if (first !== -1) setActiveIndex(first);
      }
    },
    [setOpen, flatOptions, valueArr],
  );

  const toggleValue = useCallback(
    (next: string) => {
      const set = new Set(valueArr);
      if (set.has(next)) set.delete(next);
      else set.add(next);
      const ordered = flatOptions.filter((o) => set.has(o.value)).map((o) => o.value);
      setValueArr(ordered);
    },
    [valueArr, flatOptions, setValueArr],
  );

  const removeValue = useCallback(
    (target: string) => {
      setValueArr(valueArr.filter((v) => v !== target));
    },
    [valueArr, setValueArr],
  );

  const onKeyDown = useDropdownKeydown({
    open,
    setOpen: handleOpenChange,
    options: flatOptions,
    activeIndex,
    setActiveIndex,
    onSelect: toggleValue,
    closeOnSelect: false,
  });

  const onTriggerKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (!open && e.key === 'Backspace' && valueArr.length > 0) {
        e.preventDefault();
        setValueArr(valueArr.slice(0, -1));
        return;
      }
      onKeyDown(e);
    },
    [disabled, open, valueArr, setValueArr, onKeyDown],
  );

  const selectedValues = useMemo(() => new Set<string>(valueArr), [valueArr]);

  const enabledValues = useMemo(
    () => flatOptions.filter((o) => !o.disabled).map((o) => o.value),
    [flatOptions],
  );
  const allEnabledSelected =
    enabledValues.length > 0 && enabledValues.every((v) => selectedValues.has(v));
  const someEnabledSelected =
    !allEnabledSelected && enabledValues.some((v) => selectedValues.has(v));

  const handleSelectAll = useCallback(() => {
    if (allEnabledSelected) {
      setValueArr([]);
    } else {
      setValueArr(enabledValues);
    }
  }, [allEnabledSelected, enabledValues, setValueArr]);

  const selectAllLabel = typeof selectAll === 'string' ? selectAll : 'Select all';
  const header: ReactNode = selectAll ? (
    <SelectAllRow
      id={`${listboxId}-select-all`}
      label={selectAllLabel}
      checked={allEnabledSelected}
      indeterminate={someEnabledSelected}
      size={size}
      onToggle={handleSelectAll}
    />
  ) : null;

  const activeDescendantId =
    open && flatOptions[activeIndex]
      ? getOptionId(listboxId, flatOptions[activeIndex]!.value)
      : undefined;

  const chipsLabelById = useMemo(() => {
    const map = new Map<string, string>();
    for (const opt of flatOptions) map.set(opt.value, opt.label);
    return map;
  }, [flatOptions]);

  return (
    <>
      <div
        ref={mergedRef}
        role="combobox"
        id={id}
        data-testid={dataTestId}
        className={styles.trigger({ size, invalid, open })}
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
        aria-disabled={disabled || undefined}
        onClick={() => {
          if (disabled) return;
          handleOpenChange(!open);
        }}
        onKeyDown={onTriggerKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {valueArr.length === 0 ? (
          <span className={`${styles.triggerLabel} ${styles.placeholder}`}>
            {placeholder ?? ' '}
          </span>
        ) : (
          <span className={styles.chipList}>
            {valueArr.map((v) => (
              <Chip
                key={v}
                label={chipsLabelById.get(v) ?? v}
                disabled={disabled}
                onRemove={() => removeValue(v)}
              />
            ))}
          </span>
        )}
        <ChevronGlyph />
      </div>
      <DropdownListbox
        open={open && !disabled}
        anchorRef={triggerRef}
        triggerRef={triggerRef}
        listboxId={listboxId}
        ariaLabelledBy={ariaLabelledBy}
        options={options}
        flatOptions={flatOptions}
        selectedValues={selectedValues}
        activeIndex={activeIndex}
        multi={true}
        size={size}
        onSelect={toggleValue}
        onClose={() => setOpen(false)}
        emptyMessage={emptyMessage}
        header={header}
      />
      {name
        ? valueArr.map((v) => (
            <input
              key={v}
              type="hidden"
              name={name}
              value={v}
              form={form}
              disabled={disabled}
              aria-hidden="true"
              tabIndex={-1}
            />
          ))
        : null}
    </>
  );
});

interface ChipProps {
  label: string;
  disabled?: boolean;
  onRemove: () => void;
}

function Chip({ label, disabled, onRemove }: ChipProps): React.JSX.Element {
  const stop = (e: MouseEvent<HTMLElement>): void => {
    e.stopPropagation();
  };
  return (
    <span className={styles.chip}>
      <span className={styles.chipLabel}>{label}</span>
      <button
        type="button"
        aria-label={`remove ${label}`}
        className={styles.chipRemove}
        tabIndex={-1}
        disabled={disabled}
        onMouseDown={stop}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <ChipRemoveGlyph />
      </button>
    </span>
  );
}

function ChipRemoveGlyph(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 16 16"
      width="0.625rem"
      height="0.625rem"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  );
}

interface SelectAllRowProps {
  id: string;
  label: string;
  checked: boolean;
  indeterminate: boolean;
  size: DropdownSize;
  onToggle: () => void;
}

function SelectAllRow({
  id,
  label,
  checked,
  indeterminate,
  size,
  onToggle,
}: SelectAllRowProps): React.JSX.Element {
  const ariaChecked: 'true' | 'false' | 'mixed' = indeterminate ? 'mixed' : checked ? 'true' : 'false';
  return (
    <div
      id={id}
      role="option"
      tabIndex={-1}
      aria-selected={checked}
      aria-checked={ariaChecked}
      className={styles.option({ size })}
      onMouseDown={(e) => {
        e.preventDefault();
        onToggle();
      }}
    >
      <span
        aria-hidden="true"
        className={
          checked || indeterminate
            ? `${styles.checkboxBox} ${styles.checkboxBoxChecked}`
            : styles.checkboxBox
        }
      >
        {indeterminate ? <IndeterminateGlyph /> : checked ? <CheckGlyph /> : null}
      </span>
      <span className={styles.optionLabel}>{label}</span>
    </div>
  );
}

function CheckGlyph(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 16 16"
      width="0.75rem"
      height="0.75rem"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}

function IndeterminateGlyph(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 16 16"
      width="0.75rem"
      height="0.75rem"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3 8h10" />
    </svg>
  );
}
