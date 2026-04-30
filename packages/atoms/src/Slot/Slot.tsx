import { cloneElement, forwardRef, isValidElement } from 'react';
import type { CSSProperties, ReactElement, ReactNode, Ref } from 'react';

type AnyProps = Record<string, unknown>;

/**
 * Compose a parent component's props onto its single child element. The
 * cloned child wins on plain props, but `className` is concatenated, `style`
 * is merged, event handlers fire both (parent first, then child), and refs
 * are forwarded to whichever target the child renders. Use through the
 * `asChild` pattern on Button (and any future component that wants to
 * forward its styling onto a router `<Link>`, an `<a>`, or any other
 * element) — never reach for it directly in a consumer call site.
 */
export interface SlotProps {
  /** A single React element. Slot clones it and merges parent props onto it. */
  children?: ReactNode;
}

export const Slot = forwardRef<unknown, SlotProps & AnyProps>(function Slot(
  { children, ...slotProps },
  forwardedRef,
) {
  if (!isValidElement(children)) return null;
  const child = children as ReactElement<AnyProps>;
  const childProps = (child.props ?? {}) as AnyProps;
  const childRef = (child as { ref?: Ref<unknown> }).ref;

  const merged: AnyProps = { ...slotProps };
  for (const key of Object.keys(childProps)) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];
    if (key === 'className') {
      merged[key] = [slotValue, childValue].filter(Boolean).join(' ');
    } else if (key === 'style') {
      merged[key] = {
        ...(slotValue as CSSProperties | undefined),
        ...(childValue as CSSProperties | undefined),
      };
    } else if (
      typeof slotValue === 'function' &&
      typeof childValue === 'function' &&
      /^on[A-Z]/.test(key)
    ) {
      merged[key] = (...args: unknown[]) => {
        (slotValue as (...a: unknown[]) => void)(...args);
        (childValue as (...a: unknown[]) => void)(...args);
      };
    } else {
      merged[key] = childValue;
    }
  }

  merged.ref = mergeRefs(forwardedRef, childRef);
  return cloneElement(child, merged);
});

function mergeRefs<T>(
  a: Ref<T> | undefined,
  b: Ref<T> | undefined,
): Ref<T> | undefined {
  if (!a) return b;
  if (!b) return a;
  return (instance: T | null) => {
    setRef(a, instance);
    setRef(b, instance);
  };
}

function setRef<T>(ref: Ref<T>, value: T | null): void {
  if (typeof ref === 'function') ref(value);
  else if (ref != null) (ref as { current: T | null }).current = value;
}
