import { forwardRef, useCallback, useId, useImperativeHandle, useRef, useState } from 'react';
import type { FocusEvent, ReactNode } from 'react';
import { DateInput, type DateSegmentOrder } from '../DateInput/DateInput.js';
import { DateTimeInput } from '../DateTimeInput/DateTimeInput.js';
import type { BaseComponentProps } from '../types.js';
import * as styles from './DateRangeInput.css.js';

export interface DateRangeValue {
  start: string | null;
  end: string | null;
}

/**
 * A range of dates (or datetimes) under a single chrome. Two `DateInput`s
 * — or two `DateTimeInput`s when `includeTime` is on — sit inline with an
 * arrow between them. An optional `endAdornment` slot at the end inside
 * the chrome takes things like a calendar trigger button, so the picker
 * reads as one unified input rather than several pieces glued together.
 *
 * Each side speaks its own format: dates as `"YYYY-MM-DD"`, datetimes as
 * `"YYYY-MM-DDTHH:MM"` (or `"...:SS"`). The component is timezone-agnostic
 * — anchoring to a timezone is the embedder's job (typically `DatePicker`).
 */
export interface DateRangeInputProps extends BaseComponentProps {
  /** Controlled value. */
  value?: DateRangeValue;
  /** Initial value for uncontrolled usage. */
  defaultValue?: DateRangeValue;
  /** Fired when either side changes. */
  onChange?: (value: DateRangeValue) => void;

  /** Render time inputs alongside the dates on each side. @default false */
  includeTime?: boolean;
  /** Time precision when `includeTime` is on. @default 'minute' */
  precision?: 'minute' | 'second';
  /** Date segment order. @default 'MDY' */
  segmentOrder?: DateSegmentOrder;

  /** Mark invalid. */
  invalid?: boolean;
  /** Disable interaction. */
  disabled?: boolean;
  /** Make the input read-only. */
  readOnly?: boolean;
  /** Mark required. */
  required?: boolean;
  /** Auto-focus the first segment on mount. */
  autoFocus?: boolean;

  /**
   * Element rendered at the end of the range, inside the chrome and after
   * the end input. Useful for things like a calendar trigger button so the
   * range reads as one input field rather than two plus a floating button.
   */
  endAdornment?: ReactNode;

  onFocus?: (event: FocusEvent<HTMLDivElement>) => void;
  onBlur?: (event: FocusEvent<HTMLDivElement>) => void;

  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

export const DateRangeInput = forwardRef<HTMLDivElement, DateRangeInputProps>(function DateRangeInput(
  {
    value,
    defaultValue,
    onChange,
    includeTime = false,
    precision = 'minute',
    segmentOrder = 'MDY',
    invalid = false,
    disabled = false,
    readOnly = false,
    required = false,
    autoFocus = false,
    endAdornment,
    id: providedId,
    'data-testid': dataTestId,
    onFocus,
    onBlur,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
  },
  ref,
) {
  const reactId = useId();
  const id = providedId ?? reactId;

  const containerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => containerRef.current as HTMLDivElement, []);

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<DateRangeValue>(
    () => defaultValue ?? { start: null, end: null },
  );
  const current = isControlled ? value : internal;

  const setValue = useCallback(
    (next: DateRangeValue): void => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const handleStartChange = useCallback(
    (next: string | null): void => {
      setValue({ start: next, end: current.end });
    },
    [setValue, current.end],
  );

  const handleEndChange = useCallback(
    (next: string | null): void => {
      setValue({ start: current.start, end: next });
    },
    [setValue, current.start],
  );

  const renderInputs = (): React.JSX.Element => {
    if (includeTime) {
      return (
        <>
          <DateTimeInput
            bare
            id={`${id}-start`}
            value={current.start}
            onChange={handleStartChange}
            precision={precision}
            segmentOrder={segmentOrder}
            invalid={invalid}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            autoFocus={autoFocus}
            aria-label="start"
          />
          <span aria-hidden="true" className={styles.arrow}>→</span>
          <DateTimeInput
            bare
            id={`${id}-end`}
            value={current.end}
            onChange={handleEndChange}
            precision={precision}
            segmentOrder={segmentOrder}
            invalid={invalid}
            disabled={disabled}
            readOnly={readOnly}
            aria-label="end"
          />
        </>
      );
    }
    return (
      <>
        <DateInput
          bare
          id={`${id}-start`}
          value={current.start}
          onChange={handleStartChange}
          invalid={invalid}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoFocus={autoFocus}
          segmentOrder={segmentOrder}
          aria-label="start"
        />
        <span aria-hidden="true" className={styles.arrow}>→</span>
        <DateInput
          bare
          id={`${id}-end`}
          value={current.end}
          onChange={handleEndChange}
          invalid={invalid}
          disabled={disabled}
          readOnly={readOnly}
          segmentOrder={segmentOrder}
          aria-label="end"
        />
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      id={`${id}-root`}
      data-testid={dataTestId}
      role="group"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-invalid={invalid || undefined}
      aria-disabled={disabled || undefined}
      className={styles.root({ invalid, disabled, hasAdornment: !!endAdornment })}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {renderInputs()}
      {endAdornment ? <span className={styles.adornment}>{endAdornment}</span> : null}
    </div>
  );
});
