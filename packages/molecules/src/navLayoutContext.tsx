import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

export interface NavLayoutContextValue {
  /**
   * When true, descendants render in icon-only / compact form: NavItem hides
   * its label and trailing slot, NavSection hides its visible heading. The
   * label text is preserved as the accessible name.
   */
  collapsed: boolean;
}

const defaultValue: NavLayoutContextValue = { collapsed: false };

const NavLayoutContext = createContext<NavLayoutContextValue>(defaultValue);
NavLayoutContext.displayName = 'NavLayoutContext';

/**
 * Read the surrounding nav layout. Returns `{ collapsed: false }` when no
 * provider is mounted — `NavItem` and `NavSection` render at full width by
 * default outside a `Sidebar`.
 */
export function useNavLayout(): NavLayoutContextValue {
  return useContext(NavLayoutContext);
}

export interface NavLayoutProviderProps {
  collapsed: boolean;
  children: ReactNode;
}

/**
 * Tell descendants whether the surrounding nav region is in collapsed
 * (icon-only) layout. `Sidebar` mounts this when its `collapsed` prop is set;
 * other surfaces that want compact NavItems can mount it directly.
 */
export function NavLayoutProvider({
  collapsed,
  children,
}: NavLayoutProviderProps): React.JSX.Element {
  return <NavLayoutContext.Provider value={{ collapsed }}>{children}</NavLayoutContext.Provider>;
}
