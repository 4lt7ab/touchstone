import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useAnchoredPosition, useEscapeKey } from '@touchstone/hooks';
import * as styles from './Dropdown.css.js';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownOptionGroup {
  /** Visible group label rendered above the options. */
  label: string;
  /** Options under this group. */
  options: ReadonlyArray<DropdownOption>;
}

/**
 * Either a flat list of options or a list mixing options and groups. Groups
 * render a non-selectable label and a divider; their `options` participate in
 * keyboard navigation and selection in document order.
 */
export type DropdownOptionList = ReadonlyArray<DropdownOption | DropdownOptionGroup>;

export type DropdownSize = 'sm' | 'md' | 'lg';

/**
 * Trigger silhouette. `'select'` is the default form-field shape (input
 * border, full width, chevron). `'badge'` is a pill-shaped, intrinsically
 * sized trigger that mirrors the `Badge` atom — for compact, inline value
 * pickers (status pills, filter chips). The badge shape ignores `size` for
 * its own metrics; `size` still parameterises the listbox.
 */
export type DropdownShape = 'select' | 'badge';

/**
 * Colour palette for the badge-shaped trigger. Mirrors `Badge`'s `tone`
 * variants. Has no visible effect when `shape` is `'select'`.
 */
export type DropdownTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent';

export function isOptionGroup(entry: DropdownOption | DropdownOptionGroup): entry is DropdownOptionGroup {
  return 'options' in entry;
}

export function flattenOptions(list: DropdownOptionList): DropdownOption[] {
  const out: DropdownOption[] = [];
  for (const entry of list) {
    if (isOptionGroup(entry)) {
      for (const opt of entry.options) out.push(opt);
    } else {
      out.push(entry);
    }
  }
  return out;
}

/**
 * Filter a grouped option list. Drops empty groups after filtering. Used by
 * `Combobox` to keep group labels meaningful when the user types.
 */
export function filterGroupedOptions(
  list: DropdownOptionList,
  predicate: (option: DropdownOption) => boolean,
): DropdownOptionList {
  const out: Array<DropdownOption | DropdownOptionGroup> = [];
  for (const entry of list) {
    if (isOptionGroup(entry)) {
      const filtered = entry.options.filter(predicate);
      if (filtered.length > 0) out.push({ label: entry.label, options: filtered });
    } else if (predicate(entry)) {
      out.push(entry);
    }
  }
  return out;
}

export function getOptionId(listboxId: string, value: string): string {
  return `${listboxId}-option-${cssEscape(value)}`;
}

function cssEscape(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, (c) => `_${c.charCodeAt(0).toString(16)}`);
}

export function findEnabledIndex(
  options: ReadonlyArray<DropdownOption>,
  start: number,
  step: 1 | -1,
): number {
  if (options.length === 0) return -1;
  const n = options.length;
  let i = start;
  for (let tries = 0; tries < n; tries++) {
    i = (i + step + n) % n;
    const candidate = options[i];
    if (candidate && !candidate.disabled) return i;
  }
  return -1;
}

export function firstEnabledIndex(options: ReadonlyArray<DropdownOption>): number {
  for (let i = 0; i < options.length; i++) {
    const candidate = options[i];
    if (candidate && !candidate.disabled) return i;
  }
  return -1;
}

export function lastEnabledIndex(options: ReadonlyArray<DropdownOption>): number {
  for (let i = options.length - 1; i >= 0; i--) {
    const candidate = options[i];
    if (candidate && !candidate.disabled) return i;
  }
  return -1;
}

export interface DropdownListboxProps {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
  listboxId: string;
  ariaLabelledBy?: string;
  /** Grouped or flat option list. */
  options: DropdownOptionList;
  /** Flattened option list, parallel to `activeIndex`. */
  flatOptions: ReadonlyArray<DropdownOption>;
  selectedValues: ReadonlySet<string>;
  activeIndex: number;
  multi: boolean;
  size: DropdownSize;
  onSelect: (value: string) => void;
  onClose: () => void;
  emptyMessage?: ReactNode;
  /** Optional row rendered above options (e.g. MultiSelect's "select all"). */
  header?: ReactNode;
  /**
   * When true (default), the listbox grows to at least the anchor's width.
   * Set to false for narrow triggers (e.g. the badge-shaped Dropdown), where
   * matching the anchor would shrink the listbox below its CSS minimum.
   */
  matchAnchorWidth?: boolean;
}

export function DropdownListbox({
  open,
  anchorRef,
  triggerRef,
  listboxId,
  ariaLabelledBy,
  options,
  flatOptions,
  selectedValues,
  activeIndex,
  multi,
  size,
  onSelect,
  onClose,
  emptyMessage,
  header,
  matchAnchorWidth = true,
}: DropdownListboxProps): React.ReactPortal | null {
  const panelRef = useRef<HTMLUListElement>(null);
  const { style: positionStyle } = useAnchoredPosition(anchorRef, panelRef, {
    side: 'bottom',
    align: 'start',
    offset: 4,
    enabled: open,
  });

  const [minWidth, setMinWidth] = useState<number | undefined>(undefined);
  useLayoutEffect(() => {
    if (!open) return;
    if (!matchAnchorWidth) {
      setMinWidth(undefined);
      return;
    }
    const a = anchorRef.current;
    if (!a) return;
    setMinWidth(a.getBoundingClientRect().width);
  }, [open, anchorRef, matchAnchorWidth]);

  useEscapeKey(() => {
    if (open) onClose();
  }, open);

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent): void {
      const panel = panelRef.current;
      const trigger = triggerRef.current;
      const target = e.target as Node;
      if (panel && panel.contains(target)) return;
      if (trigger && trigger.contains(target)) return;
      onClose();
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [open, onClose, triggerRef]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const active = panel.querySelector<HTMLElement>('[data-active="true"]');
    if (active && typeof active.scrollIntoView === 'function') {
      active.scrollIntoView({ block: 'nearest' });
    }
  }, [open, activeIndex]);

  if (!open || typeof document === 'undefined') return null;

  const listboxStyle: React.CSSProperties = {
    ...positionStyle,
    ...(minWidth !== undefined ? { minWidth } : {}),
  };

  const renderOption = (opt: DropdownOption): React.JSX.Element => {
    const flatIdx = flatOptions.indexOf(opt);
    const isSelected = selectedValues.has(opt.value);
    const isActive = flatIdx === activeIndex;
    return (
      <li
        key={opt.value}
        id={getOptionId(listboxId, opt.value)}
        role="option"
        aria-selected={isSelected}
        aria-disabled={opt.disabled || undefined}
        data-value={opt.value}
        data-active={isActive || undefined}
        className={styles.option({ size })}
        onMouseDown={(e) => {
          e.preventDefault();
          if (opt.disabled) return;
          onSelect(opt.value);
        }}
      >
        {multi ? <CheckboxGlyph checked={isSelected} /> : null}
        <span className={styles.optionLabel}>{opt.label}</span>
        {!multi && isSelected ? (
          <span className={styles.optionGlyph} aria-hidden="true">
            <CheckGlyph />
          </span>
        ) : null}
      </li>
    );
  };

  const items: React.ReactNode[] = [];
  if (header) {
    items.push(<li key="__header" role="presentation">{header}</li>);
    items.push(<li key="__header-divider" role="separator" className={styles.listboxDivider} />);
  }
  if (flatOptions.length === 0) {
    items.push(
      <li key="__empty" role="presentation" className={styles.empty}>
        {emptyMessage ?? 'No options'}
      </li>,
    );
  } else {
    let groupIdx = 0;
    for (const entry of options) {
      if (isOptionGroup(entry)) {
        if (entry.options.length === 0) continue;
        items.push(
          <li
            key={`__group-${groupIdx}`}
            role="presentation"
            className={styles.groupLabel}
          >
            {entry.label}
          </li>,
        );
        for (const opt of entry.options) items.push(renderOption(opt));
        groupIdx++;
      } else {
        items.push(renderOption(entry));
      }
    }
  }

  return createPortal(
    <ul
      ref={panelRef}
      role="listbox"
      id={listboxId}
      aria-labelledby={ariaLabelledBy}
      aria-multiselectable={multi || undefined}
      tabIndex={-1}
      className={styles.listbox({ size })}
      style={listboxStyle}
    >
      {items}
    </ul>,
    document.body,
  );
}

function CheckboxGlyph({ checked }: { checked: boolean }): React.JSX.Element {
  return (
    <span
      aria-hidden="true"
      className={
        checked ? `${styles.checkboxBox} ${styles.checkboxBoxChecked}` : styles.checkboxBox
      }
    >
      {checked ? <CheckGlyph /> : null}
    </span>
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

export function ChevronGlyph({ size = 'md' }: { size?: 'sm' | 'md' } = {}): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 16 16"
      className={size === 'sm' ? styles.chevronSm : styles.chevron}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

interface TypeaheadState {
  buffer: string;
  timer: ReturnType<typeof setTimeout> | null;
}

export interface DropdownKeyHandlerArgs {
  open: boolean;
  setOpen: (open: boolean) => void;
  options: ReadonlyArray<DropdownOption>;
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  onSelect: (value: string) => void;
  closeOnSelect: boolean;
  /** Enable typeahead-jump on printable keys. @default true */
  typeahead?: boolean;
}

export function useDropdownKeydown({
  open,
  setOpen,
  options,
  activeIndex,
  setActiveIndex,
  onSelect,
  closeOnSelect,
  typeahead = true,
}: DropdownKeyHandlerArgs): (e: React.KeyboardEvent) => void {
  const typeaheadRef = useRef<TypeaheadState>({ buffer: '', timer: null });

  return useCallback(
    (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!open) {
          setOpen(true);
          const first = firstEnabledIndex(options);
          if (first !== -1) setActiveIndex(first);
          return;
        }
        const next = findEnabledIndex(options, activeIndex, 1);
        if (next !== -1) setActiveIndex(next);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!open) {
          setOpen(true);
          const last = lastEnabledIndex(options);
          if (last !== -1) setActiveIndex(last);
          return;
        }
        const prev = findEnabledIndex(options, activeIndex, -1);
        if (prev !== -1) setActiveIndex(prev);
        return;
      }
      if (e.key === 'Home') {
        if (!open) return;
        e.preventDefault();
        const first = firstEnabledIndex(options);
        if (first !== -1) setActiveIndex(first);
        return;
      }
      if (e.key === 'End') {
        if (!open) return;
        e.preventDefault();
        const last = lastEnabledIndex(options);
        if (last !== -1) setActiveIndex(last);
        return;
      }
      if (e.key === 'Enter') {
        if (!open) {
          e.preventDefault();
          setOpen(true);
          return;
        }
        const opt = options[activeIndex];
        if (opt && !opt.disabled) {
          e.preventDefault();
          onSelect(opt.value);
          if (closeOnSelect) setOpen(false);
        }
        return;
      }
      if (e.key === ' ') {
        if (!open) {
          e.preventDefault();
          setOpen(true);
          return;
        }
        const opt = options[activeIndex];
        if (opt && !opt.disabled) {
          e.preventDefault();
          onSelect(opt.value);
          if (closeOnSelect) setOpen(false);
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
      if (e.key === 'Tab') {
        if (open) setOpen(false);
        return;
      }
      if (
        typeahead &&
        e.key.length === 1 &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        /\S/.test(e.key)
      ) {
        e.preventDefault();
        if (!open) setOpen(true);
        const ts = typeaheadRef.current;
        if (ts.timer) clearTimeout(ts.timer);
        ts.buffer += e.key.toLowerCase();
        ts.timer = setTimeout(() => {
          ts.buffer = '';
          ts.timer = null;
        }, 500);
        const buf = ts.buffer;
        const n = options.length;
        if (n === 0) return;
        const start = activeIndex >= 0 ? activeIndex : 0;
        // If buffer is a single char being repeated, advance to next match;
        // otherwise match starting at the current index (so a multi-char
        // buffer can refine the match without skipping past it).
        const startOffset = buf.length === 1 ? 1 : 0;
        for (let i = startOffset; i < n + startOffset; i++) {
          const idx = (start + i) % n;
          const opt = options[idx];
          if (opt && !opt.disabled && opt.label.toLowerCase().startsWith(buf)) {
            setActiveIndex(idx);
            return;
          }
        }
      }
    },
    [open, setOpen, options, activeIndex, setActiveIndex, onSelect, closeOnSelect, typeahead],
  );
}

export interface HiddenSelectInputProps {
  name: string;
  value: string;
  required?: boolean;
  form?: string;
  disabled?: boolean;
}

export function HiddenSelectInput({
  name,
  value,
  required,
  form,
  disabled,
}: HiddenSelectInputProps): React.JSX.Element {
  return (
    <input
      type="hidden"
      name={name}
      value={value}
      form={form}
      required={required}
      disabled={disabled}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
