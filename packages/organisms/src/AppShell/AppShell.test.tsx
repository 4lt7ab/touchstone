import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavItem, NavSection } from '@touchstone/molecules';
import { AppShell } from './AppShell.js';
import { Sidebar } from '../Sidebar/Sidebar.js';
import { Drawer } from '../Drawer/Drawer.js';

const isMac = (): boolean =>
  typeof navigator !== 'undefined' && /mac|iphone|ipad|ipod/i.test(navigator.platform);
const modKey = (): { metaKey: boolean; ctrlKey: boolean } =>
  isMac() ? { metaKey: true, ctrlKey: false } : { metaKey: false, ctrlKey: true };

describe('AppShell', () => {
  it('renders the main landmark with children', () => {
    render(
      <AppShell>
        <p>page content</p>
      </AppShell>,
    );
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveTextContent('page content');
  });

  it('renders the header and sidebar slots when provided', () => {
    render(
      <AppShell
        header={<header data-testid="bar">bar</header>}
        sidebar={<aside data-testid="rail">rail</aside>}
      >
        <p>page</p>
      </AppShell>,
    );
    expect(screen.getByTestId('bar')).toBeInTheDocument();
    expect(screen.getByTestId('rail')).toBeInTheDocument();
  });

  it('omits header and sidebar slot wrappers when not provided', () => {
    const { container } = render(
      <AppShell>
        <p>page</p>
      </AppShell>,
    );
    // Only the body row + main should render; no header/sidebar wrappers
    expect(container.querySelector('main')).toBeInTheDocument();
    expect(container.querySelectorAll('header')).toHaveLength(0);
  });

  describe('sidebar collapse', () => {
    it('starts uncollapsed by default and toggles on ⌘B', () => {
      render(
        <AppShell sidebar={<Sidebar aria-label="primary">rail</Sidebar>}>
          <p>page</p>
        </AppShell>,
      );
      const nav = screen.getByRole('navigation', { name: 'primary' });
      expect(nav).not.toHaveAttribute('data-collapsed');

      fireEvent.keyDown(document, { key: 'b', ...modKey() });
      expect(nav).toHaveAttribute('data-collapsed', 'true');

      fireEvent.keyDown(document, { key: 'b', ...modKey() });
      expect(nav).not.toHaveAttribute('data-collapsed');
    });

    it('honors defaultSidebarCollapsed for the initial state', () => {
      render(
        <AppShell
          defaultSidebarCollapsed
          sidebar={<Sidebar aria-label="primary">rail</Sidebar>}
        >
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('navigation', { name: 'primary' })).toHaveAttribute(
        'data-collapsed',
        'true',
      );
    });

    it('mirrors the controlled sidebarCollapsed value and calls onSidebarCollapsedChange', () => {
      const onChange = vi.fn();
      const { rerender } = render(
        <AppShell
          sidebarCollapsed={false}
          onSidebarCollapsedChange={onChange}
          sidebar={<Sidebar aria-label="primary">rail</Sidebar>}
        >
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('navigation', { name: 'primary' })).not.toHaveAttribute(
        'data-collapsed',
      );

      fireEvent.keyDown(document, { key: 'b', ...modKey() });
      expect(onChange).toHaveBeenCalledWith(true);
      // Controlled — value does not change until parent rerenders with new value
      expect(screen.getByRole('navigation', { name: 'primary' })).not.toHaveAttribute(
        'data-collapsed',
      );

      rerender(
        <AppShell
          sidebarCollapsed
          onSidebarCollapsedChange={onChange}
          sidebar={<Sidebar aria-label="primary">rail</Sidebar>}
        >
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('navigation', { name: 'primary' })).toHaveAttribute(
        'data-collapsed',
        'true',
      );
    });

    it('propagates collapsed into descendant NavItem / NavSection', () => {
      render(
        <AppShell
          defaultSidebarCollapsed
          sidebar={
            <Sidebar aria-label="primary">
              <NavSection label="bench">
                <NavItem icon={<svg />} trailing={<span data-testid="count">7</span>}>
                  orders
                </NavItem>
              </NavSection>
            </Sidebar>
          }
        >
          <p>page</p>
        </AppShell>,
      );
      expect(screen.queryByText('bench')).not.toBeInTheDocument();
      expect(screen.queryByTestId('count')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'orders' })).toHaveAttribute(
        'aria-label',
        'orders',
      );
    });

    it('does not toggle when no sidebar is mounted', () => {
      const onChange = vi.fn();
      render(
        <AppShell defaultSidebarCollapsed={false} onSidebarCollapsedChange={onChange}>
          <p>page</p>
        </AppShell>,
      );
      fireEvent.keyDown(document, { key: 'b', ...modKey() });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('honors a custom sidebarHotkey', () => {
      const onChange = vi.fn();
      render(
        <AppShell
          sidebarHotkey="mod+m"
          onSidebarCollapsedChange={onChange}
          sidebar={<Sidebar aria-label="primary">rail</Sidebar>}
        >
          <p>page</p>
        </AppShell>,
      );
      fireEvent.keyDown(document, { key: 'b', ...modKey() });
      expect(onChange).not.toHaveBeenCalled();

      fireEvent.keyDown(document, { key: 'm', ...modKey() });
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('disables the sidebar hotkey when sidebarHotkey={false}', () => {
      const onChange = vi.fn();
      render(
        <AppShell
          sidebarHotkey={false}
          onSidebarCollapsedChange={onChange}
          sidebar={<Sidebar aria-label="primary">rail</Sidebar>}
        >
          <p>page</p>
        </AppShell>,
      );
      fireEvent.keyDown(document, { key: 'b', ...modKey() });
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('mobile menu (responsive)', () => {
    let originalMatchMedia: typeof window.matchMedia | undefined;
    let mockListener: ((e: MediaQueryListEvent) => void) | null = null;
    let currentMatches = false;

    function installMatchMedia(initialMobile: boolean): void {
      currentMatches = initialMobile;
      window.matchMedia = ((_query: string) => ({
        get matches() {
          return currentMatches;
        },
        media: '',
        addEventListener: (_event: string, cb: (e: MediaQueryListEvent) => void) => {
          mockListener = cb;
        },
        removeEventListener: () => {
          mockListener = null;
        },
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => true,
        onchange: null,
      })) as unknown as typeof window.matchMedia;
    }

    function setMobile(matches: boolean): void {
      currentMatches = matches;
      mockListener?.({ matches } as MediaQueryListEvent);
    }

    beforeEach(() => {
      originalMatchMedia = window.matchMedia;
    });

    afterEach(() => {
      mockListener = null;
      if (originalMatchMedia !== undefined) {
        window.matchMedia = originalMatchMedia;
      }
    });

    it('renders the hamburger trigger only when a sidebar is mounted', () => {
      installMatchMedia(true);
      const { rerender } = render(
        <AppShell>
          <p>page</p>
        </AppShell>,
      );
      expect(screen.queryByRole('button', { name: 'Open menu' })).not.toBeInTheDocument();

      rerender(
        <AppShell sidebar={<Sidebar aria-label="primary">rail</Sidebar>}>
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
    });

    it('toggling the hamburger opens the overlay; toggling again closes it', async () => {
      installMatchMedia(true);
      render(
        <AppShell sidebar={<Sidebar aria-label="primary">rail</Sidebar>}>
          <p>page</p>
        </AppShell>,
      );
      const trigger = screen.getByRole('button', { name: 'Open menu' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(trigger);

      // Trigger label flips and the sidebar gets the data-mobile-open attribute
      expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      const nav = screen.getByRole('navigation', { name: 'primary' });
      expect(nav.parentElement).toHaveAttribute('data-mobile-open', 'true');

      await userEvent.click(screen.getByRole('button', { name: 'Close menu' }));
      expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      expect(nav.parentElement).not.toHaveAttribute('data-mobile-open');
    });

    it('clicking the backdrop closes the overlay', async () => {
      installMatchMedia(true);
      render(
        <AppShell sidebar={<Sidebar aria-label="primary">rail</Sidebar>}>
          <p>page</p>
        </AppShell>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
      const backdrop = screen.getByRole('button', { name: 'Dismiss menu' });
      await userEvent.click(backdrop);
      expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });

    it('Escape closes the mobile overlay when open', async () => {
      installMatchMedia(true);
      render(
        <AppShell sidebar={<Sidebar aria-label="primary">rail</Sidebar>}>
          <p>page</p>
        </AppShell>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });

    it('forces collapsed=false on the sidebar while mobile (overlay shows full labels)', async () => {
      installMatchMedia(true);
      render(
        <AppShell
          defaultSidebarCollapsed
          sidebar={
            <Sidebar aria-label="primary">
              <NavSection label="bench">
                <NavItem icon={<svg />}>orders</NavItem>
              </NavSection>
            </Sidebar>
          }
        >
          <p>page</p>
        </AppShell>,
      );
      // At mobile, "collapsed" doesn't apply — the section label is visible.
      expect(screen.getByText('bench')).toBeInTheDocument();
      expect(screen.getByRole('navigation', { name: 'primary' })).not.toHaveAttribute(
        'data-collapsed',
      );
    });

    it('auto-closes the overlay when the viewport resizes back to desktop', async () => {
      installMatchMedia(true);
      render(
        <AppShell sidebar={<Sidebar aria-label="primary">rail</Sidebar>}>
          <p>page</p>
        </AppShell>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
      expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );

      // Resize back to desktop — the matchMedia listener fires false.
      act(() => {
        setMobile(false);
      });
      // The trigger is hidden via CSS, but we can verify the state went back.
      // The button still renders (CSS hides it); aria-expanded reverts to false.
      expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });

    it('honors a controlled mobileMenuOpen / onMobileMenuOpenChange pair', async () => {
      installMatchMedia(true);
      const onChange = vi.fn();
      const { rerender } = render(
        <AppShell
          mobileMenuOpen={false}
          onMobileMenuOpenChange={onChange}
          sidebar={<Sidebar aria-label="primary">rail</Sidebar>}
        >
          <p>page</p>
        </AppShell>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
      expect(onChange).toHaveBeenCalledWith(true);
      // Controlled — value doesn't change until parent rerenders
      expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );

      rerender(
        <AppShell
          mobileMenuOpen
          onMobileMenuOpenChange={onChange}
          sidebar={<Sidebar aria-label="primary">rail</Sidebar>}
        >
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });

    it('places the trigger inside the header row when a header is present', () => {
      installMatchMedia(true);
      render(
        <AppShell
          header={<header data-testid="bar">bar</header>}
          sidebar={<Sidebar aria-label="primary">rail</Sidebar>}
        >
          <p>page</p>
        </AppShell>,
      );
      const trigger = screen.getByRole('button', { name: 'Open menu' });
      const header = screen.getByTestId('bar');
      // Both inside the same .headerRow wrapper
      expect(trigger.parentElement).toBe(header.parentElement?.parentElement);
    });

    it('respects custom openMenuLabel / closeMenuLabel', async () => {
      installMatchMedia(true);
      render(
        <AppShell
          openMenuLabel="Show ledger"
          closeMenuLabel="Hide ledger"
          sidebar={<Sidebar aria-label="primary">rail</Sidebar>}
        >
          <p>page</p>
        </AppShell>,
      );
      const trigger = screen.getByRole('button', { name: 'Show ledger' });
      await userEvent.click(trigger);
      expect(screen.getByRole('button', { name: 'Hide ledger' })).toBeInTheDocument();
    });
  });

  describe('drawer', () => {
    function drawerSlot(): React.JSX.Element {
      return (
        <Drawer>
          <Drawer.Content title="bench notes">
            <p>panel body</p>
          </Drawer.Content>
        </Drawer>
      );
    }

    it('starts closed by default and opens on ⌘`', () => {
      render(
        <AppShell drawer={drawerSlot()}>
          <p>page</p>
        </AppShell>,
      );
      expect(screen.queryByRole('dialog', { name: 'bench notes' })).not.toBeInTheDocument();

      fireEvent.keyDown(document, { key: '`', ...modKey() });
      expect(screen.getByRole('dialog', { name: 'bench notes' })).toBeInTheDocument();

      fireEvent.keyDown(document, { key: '`', ...modKey() });
      expect(screen.queryByRole('dialog', { name: 'bench notes' })).not.toBeInTheDocument();
    });

    it('honors defaultDrawerOpen for the initial state', () => {
      render(
        <AppShell defaultDrawerOpen drawer={drawerSlot()}>
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('dialog', { name: 'bench notes' })).toBeInTheDocument();
    });

    it('mirrors controlled drawerOpen and forwards onDrawerOpenChange', () => {
      const onChange = vi.fn();
      const { rerender } = render(
        <AppShell drawerOpen={false} onDrawerOpenChange={onChange} drawer={drawerSlot()}>
          <p>page</p>
        </AppShell>,
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      fireEvent.keyDown(document, { key: '`', ...modKey() });
      expect(onChange).toHaveBeenCalledWith(true);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      rerender(
        <AppShell drawerOpen onDrawerOpenChange={onChange} drawer={drawerSlot()}>
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('dialog', { name: 'bench notes' })).toBeInTheDocument();
    });

    it('closes on Escape via the Drawer modal contract', () => {
      const onChange = vi.fn();
      render(
        <AppShell defaultDrawerOpen onDrawerOpenChange={onChange} drawer={drawerSlot()}>
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onChange).toHaveBeenCalledWith(false);
    });

    it('does not toggle when no drawer is mounted', () => {
      const onChange = vi.fn();
      render(
        <AppShell onDrawerOpenChange={onChange}>
          <p>page</p>
        </AppShell>,
      );
      fireEvent.keyDown(document, { key: '`', ...modKey() });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('honors a custom drawerHotkey', () => {
      const onChange = vi.fn();
      render(
        <AppShell
          drawerHotkey="mod+k"
          onDrawerOpenChange={onChange}
          drawer={drawerSlot()}
        >
          <p>page</p>
        </AppShell>,
      );
      fireEvent.keyDown(document, { key: '`', ...modKey() });
      expect(onChange).not.toHaveBeenCalled();

      fireEvent.keyDown(document, { key: 'k', ...modKey() });
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('disables the drawer hotkey when drawerHotkey={false}', () => {
      const onChange = vi.fn();
      render(
        <AppShell drawerHotkey={false} onDrawerOpenChange={onChange} drawer={drawerSlot()}>
          <p>page</p>
        </AppShell>,
      );
      fireEvent.keyDown(document, { key: '`', ...modKey() });
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
