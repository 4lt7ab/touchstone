import { createContext, useContext } from 'react';
import type { Context, Provider } from 'react';

/**
 * Build a typed context for a compound component family (e.g. `Card.Root` /
 * `Card.Header` / `Card.Body`) and a paired hook that throws when consumed
 * outside the parent. Returns `[Provider, useScope, Ctx]`.
 *
 * The `useScope(consumerName)` hook takes the consumer's display name so the
 * thrown error tells the developer exactly which child is misplaced.
 */
export function createCompoundContext<T>(
  parentName: string,
): readonly [Provider<T | null>, (consumerName: string) => T, Context<T | null>] {
  const Ctx = createContext<T | null>(null);
  Ctx.displayName = `${parentName}Context`;

  function useScope(consumerName: string): T {
    const value = useContext(Ctx);
    if (value === null) {
      throw new Error(`<${consumerName}> must be rendered inside <${parentName}>.`);
    }
    return value;
  }

  return [Ctx.Provider, useScope, Ctx] as const;
}
