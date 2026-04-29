import { useCallback, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

interface Options<T> {
  /** Controlled value, or `undefined` for uncontrolled. */
  value?: T;
  /** Initial value when uncontrolled. */
  defaultValue: T;
  /** Called whenever the value changes — controlled or not. */
  onChange?: (next: T) => void;
}

/**
 * Lets a component support both controlled and uncontrolled usage with a single state hook.
 * Returns a `[value, setValue]` tuple that mirrors `useState` semantics.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: Options<T>): [T, Dispatch<SetStateAction<T>>] {
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState<T>(defaultValue);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const current = isControlled ? value : uncontrolled;

  const setValue = useCallback<Dispatch<SetStateAction<T>>>(
    (next) => {
      const resolved =
        typeof next === 'function' ? (next as (prev: T) => T)(current) : next;
      if (!isControlled) setUncontrolled(resolved);
      onChangeRef.current?.(resolved);
    },
    [current, isControlled],
  );

  return [current, setValue];
}
