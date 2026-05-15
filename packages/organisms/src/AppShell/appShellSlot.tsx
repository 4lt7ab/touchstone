import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface AppShellSlotValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AppShellSlotContext = createContext<AppShellSlotValue | null>(null);

/**
 * Wraps a single AppShell overlay slot (drawer, command palette, dock) and
 * exposes the shell's open/onOpenChange pair to whatever component is
 * rendered inside. Lets `<Drawer>` / `<CommandPalette>` / `<Dock>` auto-wire
 * to the shell without the shell injecting props via `cloneElement` — which
 * would silently break when the consumer wraps the slot in their own
 * component.
 */
export function AppShellSlotProvider({
  value,
  children,
}: {
  value: AppShellSlotValue;
  children: ReactNode;
}): React.JSX.Element {
  return <AppShellSlotContext.Provider value={value}>{children}</AppShellSlotContext.Provider>;
}

/**
 * Read the nearest AppShell overlay slot wiring. Returns `null` when the
 * component isn't mounted inside a slot — in that case the component falls
 * back to its own `open` / `defaultOpen` props.
 */
export function useAppShellSlot(): AppShellSlotValue | null {
  return useContext(AppShellSlotContext);
}
