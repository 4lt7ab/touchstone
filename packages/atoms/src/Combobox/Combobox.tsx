import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { AriaAttributes, FocusEventHandler } from 'react';
import { useControllableState, useMergedRefs } from '@touchstone/hooks';
import type { BaseComponentProps } from '../types.js';
import {
  ChevronGlyph,
  DropdownListbox,
  HiddenSelectInput,
  filterGroupedOptions,
  firstEnabledIndex,
  flattenOptions,
  getOptionId,
  type DropdownOption,
  type DropdownOptionList,
  type DropdownSize,
} from '../Dropdown/internals.js';
import * as styles from '../Dropdown/Dropdown.css.js';

/**
 * Typeable single-select with substring filtering. Pair with `Field` for
 * label / hint / error wiring; pass `invalid` explicitly when wrapped.
 *
 * Filtering: case-insensitive substring match on each option's `label` by
 * default; pass `filter` to override. The selected option's label fills the
 * input; on blur, the input reverts to the selected label (or empty).
 */
export interface ComboboxProps extends BaseComponentProps {
  /** Selectable options. Pass flat `DropdownOption[]` or mix in `DropdownOptionGroup`s. */
  options: DropdownOptionList;
  /** Controlled selected value, or `null` for nothing selected. */
  value?: string | null;
  /** Uncontrolled initial selected value. @default null */
  defaultValue?: string | null;
  /** Called when the selected value changes. */
  onChange?: (value: string) => void;
  /** Controlled input text (the typed query). */
  inputValue?: string;
  /** Uncontrolled initial input text. */
  defaultInputValue?: string;
  /** Called whenever the input text changes (typing or selection). */
  onInputChange?: (text: string) => void;
  /** Custom filter; default is case-insensitive substring on `label`. */
  filter?: (option: DropdownOption, query: string) => boolean;
  /** Placeholder shown when the input is empty. */
  placeholder?: string;
  /** Visual size. @default 'md' */
  size?: DropdownSize;
  /** Marks the field as invalid. */
  invalid?: boolean;
  /** Disable the field. */
  disabled?: boolean;
  /** Mark as required for native form submission. */
  required?: boolean;
  /** Form name — when set, a hidden `<input>` carries the value into form data. */
  name?: string;
  /** Form id this field belongs to. */
  form?: string;
  /** Message shown when no options match. @default 'No matches' */
  emptyMessage?: React.ReactNode;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  'aria-label'?: AriaAttributes['aria-label'];
  'aria-labelledby'?: AriaAttributes['aria-labelledby'];
  'aria-describedby'?: AriaAttributes['aria-describedby'];
  'aria-invalid'?: AriaAttributes['aria-invalid'];
}

function defaultFilter(option: DropdownOption, query: string): boolean {
  if (query === '') return true;
  return option.label.toLowerCase().includes(query.toLowerCase());
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    options,
    value: controlledValue,
    defaultValue = null,
    onChange,
    inputValue: controlledInputValue,
    defaultInputValue,
    onInputChange,
    filter = defaultFilter,
    placeholder,
    size = 'md',
    invalid = false,
    disabled = false,
    required,
    name,
    form,
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

  const flatAll = useMemo(() => flattenOptions(options), [options]);

  const initialInput = useMemo(() => {
    if (defaultInputValue !== undefined) return defaultInputValue;
    if (defaultValue !== null) {
      return flatAll.find((o) => o.value === defaultValue)?.label ?? '';
    }
    return '';
  }, [defaultInputValue, defaultValue, flatAll]);

  const [inputValue, setInputValue] = useControllableState<string>({
    value: controlledInputValue,
    defaultValue: initialInput,
    onChange: onInputChange,
  });

  const [open, setOpen] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRefs<HTMLInputElement>(inputRef, ref);

  const isFiltering = useMemo(() => {
    if (value === null) return inputValue !== '';
    const sel = flatAll.find((o) => o.value === value);
    return inputValue !== (sel?.label ?? '');
  }, [value, inputValue, flatAll]);

  const filteredOptions = useMemo(() => {
    if (!isFiltering) return options;
    return filterGroupedOptions(options, (o) => filter(o, inputValue));
  }, [options, inputValue, filter, isFiltering]);

  const filteredFlat = useMemo(() => flattenOptions(filteredOptions), [filteredOptions]);

  const [activeIndex, setActiveIndex] = useState<number>(firstEnabledIndex(filteredFlat));

  useEffect(() => {
    if (!open) return;
    const sel = value !== null ? filteredFlat.findIndex((o) => o.value === value) : -1;
    if (sel !== -1 && !filteredFlat[sel]?.disabled) {
      setActiveIndex(sel);
      return;
    }
    setActiveIndex(firstEnabledIndex(filteredFlat));
  }, [open, filteredFlat, value]);

  const handleSelect = useCallback(
    (next: string) => {
      const opt = flatAll.find((o) => o.value === next);
      setValue(next);
      setInputValue(opt?.label ?? next);
      setOpen(false);
      inputRef.current?.focus();
    },
    [flatAll, setValue, setInputValue],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        if (filteredFlat.length === 0) return;
        const n = filteredFlat.length;
        let i = activeIndex;
        for (let tries = 0; tries < n; tries++) {
          i = (i + 1 + n) % n;
          if (filteredFlat[i] && !filteredFlat[i]!.disabled) {
            setActiveIndex(i);
            return;
          }
        }
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        if (filteredFlat.length === 0) return;
        const n = filteredFlat.length;
        let i = activeIndex;
        for (let tries = 0; tries < n; tries++) {
          i = (i - 1 + n) % n;
          if (filteredFlat[i] && !filteredFlat[i]!.disabled) {
            setActiveIndex(i);
            return;
          }
        }
        return;
      }
      if (e.key === 'Home') {
        if (!open) return;
        e.preventDefault();
        const first = firstEnabledIndex(filteredFlat);
        if (first !== -1) setActiveIndex(first);
        return;
      }
      if (e.key === 'End') {
        if (!open) return;
        e.preventDefault();
        for (let i = filteredFlat.length - 1; i >= 0; i--) {
          if (filteredFlat[i] && !filteredFlat[i]!.disabled) {
            setActiveIndex(i);
            return;
          }
        }
        return;
      }
      if (e.key === 'Enter') {
        if (!open) return;
        const opt = filteredFlat[activeIndex];
        if (opt && !opt.disabled) {
          e.preventDefault();
          handleSelect(opt.value);
        }
        return;
      }
      if (e.key === 'Escape') {
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        return;
      }
      if (e.key === 'Tab' && open) {
        setOpen(false);
      }
    },
    [disabled, open, filteredFlat, activeIndex, handleSelect],
  );

  const selectedValues = useMemo(
    () => new Set<string>(value !== null ? [value] : []),
    [value],
  );

  const activeDescendantId =
    open && filteredFlat[activeIndex]
      ? getOptionId(listboxId, filteredFlat[activeIndex]!.value)
      : undefined;

  return (
    <>
      <div ref={wrapRef} className={styles.trigger({ size, invalid, open })}>
        <input
          ref={mergedRef}
          type="text"
          role="combobox"
          id={id}
          data-testid={dataTestId}
          className={styles.comboboxInput({})}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          tabIndex={0}
          autoComplete="off"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeDescendantId}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid ?? (invalid || undefined)}
          aria-required={required || undefined}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={(e) => {
            if (!disabled) setOpen(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            const sel = value !== null ? flatAll.find((o) => o.value === value) : undefined;
            setInputValue(sel?.label ?? '');
            setOpen(false);
            onBlur?.(e);
          }}
          onClick={() => {
            if (!disabled && !open) setOpen(true);
          }}
          onKeyDown={onKeyDown}
        />
        <ChevronGlyph />
      </div>
      <DropdownListbox
        open={open && !disabled}
        anchorRef={wrapRef}
        triggerRef={wrapRef}
        listboxId={listboxId}
        ariaLabelledBy={ariaLabelledBy}
        options={filteredOptions}
        flatOptions={filteredFlat}
        selectedValues={selectedValues}
        activeIndex={activeIndex}
        multi={false}
        size={size}
        onSelect={handleSelect}
        onClose={() => setOpen(false)}
        emptyMessage={emptyMessage ?? 'No matches'}
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
