import { forwardRef } from 'react';
import { useControllableState } from '@touchstone/hooks';
import type { BaseComponentProps } from '../types.js';
import * as styles from './Switch.css.js';

/**
 * Boolean toggle. Renders as a `<button role="switch">` so Space and Enter
 * activate it for free (the browser owns the click semantics) and screen
 * readers announce the on/off state without any extra wiring. Use for
 * single boolean preferences; for set selection see `SegmentedControl`.
 */
export interface SwitchProps extends BaseComponentProps {
  /** Controlled checked state. */
  checked?: boolean;
  /** Uncontrolled initial checked state. @default false */
  defaultChecked?: boolean;
  /** Called when the user toggles the switch. */
  onCheckedChange?: (checked: boolean) => void;
  /** Disable interaction. */
  disabled?: boolean;
  /** Required accessible label naming what the switch controls. */
  'aria-label'?: string;
  /** Or labelledby — id of an external label element. */
  'aria-labelledby'?: string;
  /** Id of a description element (e.g. a Field hint or error). */
  'aria-describedby'?: string;
  /** Form name for native form participation (rendered as a hidden input). */
  name?: string;
  /** Form value submitted when the switch is checked. @default 'on' */
  value?: string;
  /** Form id this switch belongs to. */
  form?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked: controlledChecked,
    defaultChecked = false,
    onCheckedChange,
    disabled,
    name,
    value = 'on',
    form,
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

  return (
    <>
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        disabled={disabled}
        id={id}
        data-testid={dataTestId}
        className={styles.root({})}
        onClick={() => {
          if (!disabled) setChecked(!checked);
        }}
      >
        <span className={styles.thumb({})} />
      </button>
      {name ? <input type="hidden" name={name} value={checked ? value : ''} form={form} /> : null}
    </>
  );
});
