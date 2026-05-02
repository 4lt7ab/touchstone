import { useEffect, useReducer, useRef } from 'react';

const stack: object[] = [];
const subscribers = new Set<() => void>();

function notify(): void {
  for (const s of subscribers) s();
}

export interface UseModalStackEntryReturn {
  /** Zero-based depth in the modal stack (0 = bottom). */
  index: number;
  /** True when this entry is the topmost open modal. */
  isTop: boolean;
  /** Total open modals — useful for z-index layering. */
  size: number;
}

/**
 * Register the calling component as an open modal surface. Returns the live
 * stack position so dismiss handlers can ignore non-topmost entries (Escape
 * should close a Dialog opened on top of a Drawer, not the Drawer beneath)
 * and so panels can offset their z-index by depth.
 *
 * The stack is a module-level singleton — every modal-class organism in the
 * tree shares it, regardless of provider boundary. Pair with `useScrollLock`
 * (also globally ref-counted) and the focus-management hooks for the full
 * surface recipe; or use `useModalSurface` to compose them all at once.
 */
export function useModalStackEntry(active: boolean): UseModalStackEntryReturn {
  const tokenRef = useRef<object | null>(null);
  if (tokenRef.current === null) tokenRef.current = {};
  const [, tick] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    subscribers.add(tick);
    return () => {
      subscribers.delete(tick);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const token = tokenRef.current;
    if (token === null) return;
    stack.push(token);
    notify();
    return () => {
      const i = stack.indexOf(token);
      if (i !== -1) stack.splice(i, 1);
      notify();
    };
  }, [active]);

  const token = tokenRef.current;
  const index = token === null ? -1 : stack.indexOf(token);
  return {
    index: index === -1 ? 0 : index,
    isTop: stack.length > 0 && stack[stack.length - 1] === token,
    size: stack.length,
  };
}
