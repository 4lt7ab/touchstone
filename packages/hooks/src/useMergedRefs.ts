import { useCallback } from 'react';
import type { Ref, RefCallback } from 'react';

type PossibleRef<T> = Ref<T> | undefined;

function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref != null) {
    (ref as { current: T | null }).current = value;
  }
}

/**
 * Merge any number of refs (callback or object) into a single ref callback.
 * Useful when a component needs to forward a ref while also keeping its own.
 */
export function useMergedRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  return useCallback(
    (node: T) => {
      for (const ref of refs) setRef(ref, node);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  );
}
