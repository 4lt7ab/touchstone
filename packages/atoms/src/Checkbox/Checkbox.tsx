import { forwardRef, useEffect, useRef } from 'react';
import { useControllableState, useMergedRefs } from '@touchstone/hooks';
import type { BaseComponentProps } from '../types.js';
import * as styles from './Checkbox.css.js';

/**
 * Multi-select form control. Renders as a `<button role="checkbox">` so the
 * browser owns the click semantics and Space activation, and screen readers
 * announce checked / unchecked / mixed without extra wiring. A hidden native
 * `<input type="checkbox">` is rendered when `name` is set so the value
 * participates in native form submission.
 *
 * Use for selection that's confirmed at form submit ("I agree", "select all
 * that apply"). For an immediate-effect boolean preference, use `Switch`.
 */
export interface CheckboxProps extends BaseComponentProps {
  /** Controlled checked state. */
  checked?: boolean;
  /** Uncontrolled initial checked state. @default false */
  defaultChecked?: boolean;
  /**
   * Mixed / partial state. Drives `aria-checked="mixed"` and renders the
   * indeterminate glyph. Independent of `checked` — when `indeterminate` is
   * true, the visual is mixed regardless of the underlying boolean.
   */
  indeterminate?: boolean;
  /** Called when the user toggles the checkbox. */
  onCheckedChange?: (checked: boolean) => void;
  /** Disable interaction. */
  disabled?: boolean;
  /** Required accessible label, unless an external `aria-labelledby` is set. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  /** Form name for native form participation (rendered as a hidden input). */
  name?: string;
  /** Form value submitted when the checkbox is checked. @default 'on' */
  value?: string;
  /** Form id this checkbox belongs to. */
  form?: string;
  /** Mark as required for native form submission. */
  required?: boolean;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  function Checkbox(
    {
      checked: controlledChecked,
      defaultChecked = false,
      indeterminate = false,
      onCheckedChange,
      disabled,
      name,
      value = 'on',
      form,
      required,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      id,
      'data-testid': dataTestId,
    },
    ref,
  ) {
    const [checked, setChecked] = useControllableState({
      value: controlledChecked,
      defaultValue: defaultChecked,
      onChange: onCheckedChange,
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const mergedRef = useMergedRefs<HTMLButtonElement>(buttonRef, ref);

    useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const ariaChecked: 'true' | 'false' | 'mixed' = indeterminate
      ? 'mixed'
      : checked
        ? 'true'
        : 'false';

    return (
      <>
        <button
          ref={mergedRef}
          type="button"
          role="checkbox"
          aria-checked={ariaChecked}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-required={required || undefined}
          disabled={disabled}
          id={id}
          data-testid={dataTestId}
          className={styles.root({})}
          onClick={() => {
            if (disabled) return;
            setChecked(!checked);
          }}
        >
          {indeterminate ? (
            <IndeterminateGlyph />
          ) : checked ? (
            <CheckGlyph />
          ) : null}
        </button>
        {name ? (
          <input
            ref={inputRef}
            type="checkbox"
            aria-hidden="true"
            tabIndex={-1}
            name={name}
            value={value}
            form={form}
            checked={checked}
            required={required}
            onChange={() => {}}
            style={{
              position: 'absolute',
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: 'hidden',
              clip: 'rect(0,0,0,0)',
              whiteSpace: 'nowrap',
              border: 0,
            }}
          />
        ) : null}
      </>
    );
  },
);

function CheckGlyph(): React.JSX.Element {
  return (
    <svg
      className={styles.glyph({})}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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
      className={styles.glyph({})}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3 8h10" />
    </svg>
  );
}
