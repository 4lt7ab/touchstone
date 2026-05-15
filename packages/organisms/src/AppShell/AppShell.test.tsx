import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavItem, NavSection, toast } from '@touchstone/molecules';
import { AppShell } from './AppShell.js';
import { Sidebar } from '../Sidebar/Sidebar.js';
import { Drawer } from '../Drawer/Drawer.js';
import { Dock } from '../Dock/Dock.js';
import { CommandPalette } from '../CommandPalette/CommandPalette.js';

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
      // Reset the closure flag so a leaked mock (jsdom doesn't provide
      // matchMedia by default, so the conditional restore below may be a
      // no-op) reports `matches: false` to any subsequent useMediaQuery call.
      currentMatches = false;
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

  describe('skip link', () => {
    it('renders a focusable skip-to-content link pointing at <main>', () => {
      render(
        <AppShell>
          <p>page</p>
        </AppShell>,
      );
      const link = screen.getByRole('link', { name: 'Skip to content' });
      const main = screen.getByRole('main');
      expect(link).toBeInTheDocument();
      expect(link.getAttribute('href')).toBe(`#${main.id}`);
      expect(main.id).not.toBe('');
    });

    it('honors a custom label', () => {
      render(
        <AppShell skipLink={{ label: 'jump to bench' }}>
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('link', { name: 'jump to bench' })).toBeInTheDocument();
    });

    it('omits the link when skipLink={false}', () => {
      render(
        <AppShell skipLink={false}>
          <p>page</p>
        </AppShell>,
      );
      expect(screen.queryByRole('link', { name: 'Skip to content' })).not.toBeInTheDocument();
    });
  });

  describe('toaster', () => {
    afterEach(() => {
      act(() => {
        toast.dismissAll();
      });
    });

    it('renders an in-shell Toaster by default so toast() calls surface', () => {
      render(
        <AppShell>
          <p>page</p>
        </AppShell>,
      );
      act(() => {
        toast({ title: 'forged', duration: Infinity });
      });
      expect(screen.getByText('forged')).toBeInTheDocument();
    });

    it('suppresses the default Toaster when toaster={false}', () => {
      render(
        <AppShell toaster={false}>
          <p>page</p>
        </AppShell>,
      );
      act(() => {
        toast({ title: 'silenced' });
      });
      expect(screen.queryByText('silenced')).not.toBeInTheDocument();
    });
  });

  describe('inspector', () => {
    it('renders the inspector slot when provided and starts open by default', () => {
      render(
        <AppShell inspector={<aside data-testid="ins">inspector body</aside>}>
          <p>page</p>
        </AppShell>,
      );
      const ins = screen.getByTestId('ins');
      expect(ins).toBeInTheDocument();
      expect(ins.parentElement).toHaveAttribute('data-open', 'true');
    });

    it('toggles open state on ⌘I', () => {
      render(
        <AppShell inspector={<aside data-testid="ins">inspector body</aside>}>
          <p>page</p>
        </AppShell>,
      );
      const wrapper = screen.getByTestId('ins').parentElement;
      expect(wrapper).toHaveAttribute('data-open', 'true');

      fireEvent.keyDown(document, { key: 'i', ...modKey() });
      expect(wrapper).toHaveAttribute('data-open', 'false');

      fireEvent.keyDown(document, { key: 'i', ...modKey() });
      expect(wrapper).toHaveAttribute('data-open', 'true');
    });

    it('honors defaultInspectorOpen={false}', () => {
      render(
        <AppShell
          defaultInspectorOpen={false}
          inspector={<aside data-testid="ins">body</aside>}
        >
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByTestId('ins').parentElement).toHaveAttribute('data-open', 'false');
    });

    it('mirrors controlled inspectorOpen and forwards onInspectorOpenChange', () => {
      const onChange = vi.fn();
      const { rerender } = render(
        <AppShell
          inspectorOpen
          onInspectorOpenChange={onChange}
          inspector={<aside data-testid="ins">body</aside>}
        >
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByTestId('ins').parentElement).toHaveAttribute('data-open', 'true');

      fireEvent.keyDown(document, { key: 'i', ...modKey() });
      expect(onChange).toHaveBeenCalledWith(false);
      // Controlled — value doesn't change until parent rerenders.
      expect(screen.getByTestId('ins').parentElement).toHaveAttribute('data-open', 'true');

      rerender(
        <AppShell
          inspectorOpen={false}
          onInspectorOpenChange={onChange}
          inspector={<aside data-testid="ins">body</aside>}
        >
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByTestId('ins').parentElement).toHaveAttribute('data-open', 'false');
    });

    it('does not toggle when no inspector is mounted', () => {
      const onChange = vi.fn();
      render(
        <AppShell onInspectorOpenChange={onChange}>
          <p>page</p>
        </AppShell>,
      );
      fireEvent.keyDown(document, { key: 'i', ...modKey() });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('honors a custom inspectorHotkey', () => {
      const onChange = vi.fn();
      render(
        <AppShell
          inspectorHotkey="mod+u"
          onInspectorOpenChange={onChange}
          inspector={<aside data-testid="ins">body</aside>}
        >
          <p>page</p>
        </AppShell>,
      );
      fireEvent.keyDown(document, { key: 'i', ...modKey() });
      expect(onChange).not.toHaveBeenCalled();

      fireEvent.keyDown(document, { key: 'u', ...modKey() });
      expect(onChange).toHaveBeenCalledWith(false);
    });

    it('disables the inspector hotkey when inspectorHotkey={false}', () => {
      const onChange = vi.fn();
      render(
        <AppShell
          inspectorHotkey={false}
          onInspectorOpenChange={onChange}
          inspector={<aside data-testid="ins">body</aside>}
        >
          <p>page</p>
        </AppShell>,
      );
      fireEvent.keyDown(document, { key: 'i', ...modKey() });
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('mobile inspector', () => {
    let originalMatchMedia: typeof window.matchMedia | undefined;

    function installMobile(): void {
      originalMatchMedia = window.matchMedia;
      window.matchMedia = ((_q: string) => ({
        matches: true,
        media: '',
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => true,
        onchange: null,
      })) as unknown as typeof window.matchMedia;
    }

    afterEach(() => {
      if (originalMatchMedia !== undefined) {
        window.matchMedia = originalMatchMedia;
      }
    });

    it('hides inspector on mobile by default and skips the auto-Drawer', () => {
      installMobile();
      render(
        <AppShell
          defaultInspectorOpen
          inspector={<aside data-testid="ins">body</aside>}
        >
          <p>page</p>
        </AppShell>,
      );
      // Body-slot wrapper still renders (its CSS hides it on mobile via the
      // existing rule), but no auto-Drawer is mounted.
      expect(screen.queryByRole('dialog', { name: 'Inspector' })).not.toBeInTheDocument();
    });

    it('mounts the inspector inside an auto-Drawer when mobileInspector="drawer"', () => {
      installMobile();
      render(
        <AppShell
          defaultInspectorOpen
          mobileInspector="drawer"
          inspector={<aside data-testid="ins">body</aside>}
        >
          <p>page</p>
        </AppShell>,
      );
      const dialog = screen.getByRole('dialog', { name: 'Inspector' });
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveTextContent('body');
    });

    it('does not render the inspector in the body slot when in drawer mode', () => {
      installMobile();
      render(
        <AppShell
          defaultInspectorOpen
          mobileInspector="drawer"
          inspector={<aside data-testid="ins">body</aside>}
        >
          <p>page</p>
        </AppShell>,
      );
      // The aside renders once — inside the Drawer dialog, not in the body slot.
      const dialog = screen.getByRole('dialog', { name: 'Inspector' });
      const inside = dialog.querySelector('[data-testid="ins"]');
      expect(inside).not.toBeNull();
      expect(screen.getAllByTestId('ins')).toHaveLength(1);
    });

    it('shows the edge tab on mobile when mobileInspector="drawer" and inspector is closed', () => {
      installMobile();
      render(
        <AppShell
          defaultInspectorOpen={false}
          mobileInspector="drawer"
          inspector={<aside>body</aside>}
        >
          <p>page</p>
        </AppShell>,
      );
      const tab = screen.getByRole('button', { name: 'Open inspector' });
      expect(tab).toHaveAttribute('data-mobile-summon', 'true');
    });

    it('clicking the edge tab opens the mobile inspector Drawer', async () => {
      installMobile();
      render(
        <AppShell
          defaultInspectorOpen={false}
          mobileInspector="drawer"
          inspector={<aside data-testid="ins">body</aside>}
        >
          <p>page</p>
        </AppShell>,
      );
      expect(screen.queryByRole('dialog', { name: 'Inspector' })).not.toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: 'Open inspector' }));
      expect(screen.getByRole('dialog', { name: 'Inspector' })).toBeInTheDocument();
    });

    it('honors a custom mobileInspectorTitle', () => {
      installMobile();
      render(
        <AppShell
          defaultInspectorOpen
          mobileInspector="drawer"
          mobileInspectorTitle="Under the loupe"
          inspector={<aside>body</aside>}
        >
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('dialog', { name: 'Under the loupe' })).toBeInTheDocument();
    });
  });

  describe('dock', () => {
    function dockSlot(): React.JSX.Element {
      return (
        <Dock>
          <Dock.Content title="Logs">
            <p>panel body</p>
          </Dock.Content>
        </Dock>
      );
    }

    it('starts closed by default and opens on ⌘J', () => {
      render(
        <AppShell dock={dockSlot()}>
          <p>page</p>
        </AppShell>,
      );
      expect(screen.queryByRole('region', { name: 'Logs' })).not.toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'j', ...modKey() });
      expect(screen.getByRole('region', { name: 'Logs' })).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'j', ...modKey() });
      expect(screen.queryByRole('region', { name: 'Logs' })).not.toBeInTheDocument();
    });

    it('honors defaultDockOpen for the initial state', () => {
      render(
        <AppShell defaultDockOpen dock={dockSlot()}>
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('region', { name: 'Logs' })).toBeInTheDocument();
    });

    it('mirrors controlled dockOpen and forwards onDockOpenChange', () => {
      const onChange = vi.fn();
      const { rerender } = render(
        <AppShell dockOpen={false} onDockOpenChange={onChange} dock={dockSlot()}>
          <p>page</p>
        </AppShell>,
      );
      expect(screen.queryByRole('region', { name: 'Logs' })).not.toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'j', ...modKey() });
      expect(onChange).toHaveBeenCalledWith(true);
      // Controlled — value does not change until parent rerenders.
      expect(screen.queryByRole('region', { name: 'Logs' })).not.toBeInTheDocument();

      rerender(
        <AppShell dockOpen onDockOpenChange={onChange} dock={dockSlot()}>
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('region', { name: 'Logs' })).toBeInTheDocument();
    });

    it('does not toggle when no dock is mounted', () => {
      const onChange = vi.fn();
      render(
        <AppShell onDockOpenChange={onChange}>
          <p>page</p>
        </AppShell>,
      );
      fireEvent.keyDown(document, { key: 'j', ...modKey() });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('honors a custom dockHotkey', () => {
      const onChange = vi.fn();
      render(
        <AppShell dockHotkey="mod+l" onDockOpenChange={onChange} dock={dockSlot()}>
          <p>page</p>
        </AppShell>,
      );
      fireEvent.keyDown(document, { key: 'j', ...modKey() });
      expect(onChange).not.toHaveBeenCalled();

      fireEvent.keyDown(document, { key: 'l', ...modKey() });
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('disables the dock hotkey when dockHotkey={false}', () => {
      const onChange = vi.fn();
      render(
        <AppShell dockHotkey={false} onDockOpenChange={onChange} dock={dockSlot()}>
          <p>page</p>
        </AppShell>,
      );
      fireEvent.keyDown(document, { key: 'j', ...modKey() });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('lists the dock hotkey in the keyboard cheat-sheet when a dock is mounted', () => {
      render(
        <AppShell dock={dockSlot()}>
          <p>page</p>
        </AppShell>,
      );
      fireEvent.keyDown(document, { key: '?', shiftKey: true });
      const dialog = screen.getByRole('dialog', { name: 'Keyboard shortcuts' });
      expect(dialog).toHaveTextContent(/toggle dock/i);
    });
  });

  describe('command palette', () => {
    function paletteSlot(onSelect = vi.fn()): React.JSX.Element {
      return <CommandPalette commands={[{ id: 'a', label: 'apprentice', onSelect }]} />;
    }

    it('starts closed by default and opens on ⌘K', () => {
      render(
        <AppShell commandPalette={paletteSlot()}>
          <p>page</p>
        </AppShell>,
      );
      expect(screen.queryByRole('dialog', { name: 'Command palette' })).not.toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'k', ...modKey() });
      expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'k', ...modKey() });
      expect(screen.queryByRole('dialog', { name: 'Command palette' })).not.toBeInTheDocument();
    });

    it('honors defaultCommandPaletteOpen for the initial state', () => {
      render(
        <AppShell defaultCommandPaletteOpen commandPalette={paletteSlot()}>
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();
    });

    it('mirrors controlled commandPaletteOpen and forwards onCommandPaletteOpenChange', () => {
      const onChange = vi.fn();
      const { rerender } = render(
        <AppShell
          commandPaletteOpen={false}
          onCommandPaletteOpenChange={onChange}
          commandPalette={paletteSlot()}
        >
          <p>page</p>
        </AppShell>,
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'k', ...modKey() });
      expect(onChange).toHaveBeenCalledWith(true);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      rerender(
        <AppShell
          commandPaletteOpen
          onCommandPaletteOpenChange={onChange}
          commandPalette={paletteSlot()}
        >
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();
    });

    it('does not toggle when no commandPalette is mounted', () => {
      const onChange = vi.fn();
      render(
        <AppShell onCommandPaletteOpenChange={onChange}>
          <p>page</p>
        </AppShell>,
      );
      fireEvent.keyDown(document, { key: 'k', ...modKey() });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('honors a custom commandPaletteHotkey', () => {
      const onChange = vi.fn();
      render(
        <AppShell
          commandPaletteHotkey="mod+p"
          onCommandPaletteOpenChange={onChange}
          commandPalette={paletteSlot()}
        >
          <p>page</p>
        </AppShell>,
      );
      fireEvent.keyDown(document, { key: 'k', ...modKey() });
      expect(onChange).not.toHaveBeenCalled();

      fireEvent.keyDown(document, { key: 'p', ...modKey() });
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  describe('storageKey persistence', () => {
    beforeEach(() => {
      window.localStorage.clear();
    });
    afterEach(() => {
      window.localStorage.clear();
    });

    it('hydrates sidebar collapsed state from localStorage on first paint', () => {
      window.localStorage.setItem('demo/sidebar-collapsed', 'true');
      render(
        <AppShell storageKey="demo" sidebar={<Sidebar aria-label="primary">rail</Sidebar>}>
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('navigation', { name: 'primary' })).toHaveAttribute(
        'data-collapsed',
        'true',
      );
    });

    it('writes sidebar collapsed state to localStorage when toggled', () => {
      render(
        <AppShell storageKey="demo" sidebar={<Sidebar aria-label="primary">rail</Sidebar>}>
          <p>page</p>
        </AppShell>,
      );
      expect(window.localStorage.getItem('demo/sidebar-collapsed')).toBeNull();
      fireEvent.keyDown(document, { key: 'b', ...modKey() });
      expect(window.localStorage.getItem('demo/sidebar-collapsed')).toBe('true');
    });

    it('hydrates inspector open state from localStorage', () => {
      window.localStorage.setItem('demo/inspector-open', 'false');
      render(
        <AppShell storageKey="demo" inspector={<aside data-testid="ins">body</aside>}>
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByTestId('ins').parentElement).toHaveAttribute('data-open', 'false');
    });

    it('writes inspector open state to localStorage when toggled', () => {
      render(
        <AppShell storageKey="demo" inspector={<aside data-testid="ins">body</aside>}>
          <p>page</p>
        </AppShell>,
      );
      expect(window.localStorage.getItem('demo/inspector-open')).toBeNull();
      fireEvent.keyDown(document, { key: 'i', ...modKey() });
      expect(window.localStorage.getItem('demo/inspector-open')).toBe('false');
    });

    it('does not write storage when sidebarCollapsed is controlled', () => {
      const onChange = vi.fn();
      render(
        <AppShell
          storageKey="demo"
          sidebarCollapsed={false}
          onSidebarCollapsedChange={onChange}
          sidebar={<Sidebar aria-label="primary">rail</Sidebar>}
        >
          <p>page</p>
        </AppShell>,
      );
      fireEvent.keyDown(document, { key: 'b', ...modKey() });
      expect(onChange).toHaveBeenCalledWith(true);
      expect(window.localStorage.getItem('demo/sidebar-collapsed')).toBeNull();
    });
  });

  describe('resizable rails', () => {
    afterEach(() => {
      window.localStorage.clear();
    });

    it('does not render any resize handle when both resize flags are off', () => {
      render(
        <AppShell
          sidebar={<Sidebar aria-label="primary">rail</Sidebar>}
          inspector={<aside data-testid="ins">i</aside>}
        >
          <p>page</p>
        </AppShell>,
      );
      expect(screen.queryAllByRole('separator')).toHaveLength(0);
    });

    it('renders a sidebar resize handle when sidebarResize is true', () => {
      render(
        <AppShell sidebarResize sidebar={<Sidebar aria-label="primary">rail</Sidebar>}>
          <p>page</p>
        </AppShell>,
      );
      const handle = screen.getByRole('separator', { name: 'Resize sidebar' });
      expect(handle).toBeInTheDocument();
      expect(handle).toHaveAttribute('aria-orientation', 'vertical');
      expect(handle).toHaveAttribute('aria-valuenow', '240'); // md = 15rem ≈ 240px
    });

    it('keyboard ArrowRight steps the sidebar from md to lg', () => {
      const onChange = vi.fn();
      render(
        <AppShell
          sidebarResize
          onSidebarWidthChange={onChange}
          sidebar={<Sidebar aria-label="primary">rail</Sidebar>}
        >
          <p>page</p>
        </AppShell>,
      );
      const handle = screen.getByRole('separator', { name: 'Resize sidebar' });
      fireEvent.keyDown(handle, { key: 'ArrowRight' });
      expect(onChange).toHaveBeenCalledWith('lg');
    });

    it('keyboard ArrowLeft steps the sidebar from md to sm', () => {
      const onChange = vi.fn();
      render(
        <AppShell
          sidebarResize
          onSidebarWidthChange={onChange}
          sidebar={<Sidebar aria-label="primary">rail</Sidebar>}
        >
          <p>page</p>
        </AppShell>,
      );
      const handle = screen.getByRole('separator', { name: 'Resize sidebar' });
      fireEvent.keyDown(handle, { key: 'ArrowLeft' });
      expect(onChange).toHaveBeenCalledWith('sm');
    });

    it('keeps the sidebar handle visible when collapsed so the user can drag back out', () => {
      render(
        <AppShell
          sidebarResize
          defaultSidebarCollapsed
          sidebar={<Sidebar aria-label="primary">rail</Sidebar>}
        >
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('separator', { name: 'Resize sidebar' })).toBeInTheDocument();
    });

    it('renders an inspector handle when inspectorResize is true and the panel is open', () => {
      render(
        <AppShell inspectorResize inspector={<aside data-testid="ins">i</aside>}>
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('separator', { name: 'Resize inspector' })).toBeInTheDocument();
    });

    it('hides the inspector handle when the panel is closed', () => {
      render(
        <AppShell
          inspectorResize
          defaultInspectorOpen={false}
          inspector={<aside data-testid="ins">i</aside>}
        >
          <p>page</p>
        </AppShell>,
      );
      expect(
        screen.queryByRole('separator', { name: 'Resize inspector' }),
      ).not.toBeInTheDocument();
    });

    it('persists sidebar width through storageKey', () => {
      const { unmount } = render(
        <AppShell
          storageKey="demo"
          sidebarResize
          sidebar={<Sidebar aria-label="primary">rail</Sidebar>}
        >
          <p>page</p>
        </AppShell>,
      );
      const handle = screen.getByRole('separator', { name: 'Resize sidebar' });
      fireEvent.keyDown(handle, { key: 'ArrowRight' });
      expect(window.localStorage.getItem('demo/sidebar-width')).toBe('lg');
      unmount();

      // Remount — should hydrate to lg from storage.
      render(
        <AppShell
          storageKey="demo"
          sidebarResize
          sidebar={<Sidebar aria-label="primary">rail</Sidebar>}
        >
          <p>page</p>
        </AppShell>,
      );
      const handle2 = screen.getByRole('separator', { name: 'Resize sidebar' });
      expect(handle2).toHaveAttribute('aria-valuenow', '288'); // lg = 18rem ≈ 288px
    });

    it('treats sm width as collapsed when resize is on', () => {
      render(
        <AppShell
          sidebarResize
          defaultSidebarWidth="sm"
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

    it('mod+B toggles between sm and the last expanded width when resize is on', () => {
      const onChange = vi.fn();
      render(
        <AppShell
          sidebarResize
          defaultSidebarWidth="lg"
          onSidebarWidthChange={onChange}
          sidebar={<Sidebar aria-label="primary">rail</Sidebar>}
        >
          <p>page</p>
        </AppShell>,
      );
      // Starts at lg → ⌘B should collapse to sm.
      fireEvent.keyDown(document, { key: 'b', ...modKey() });
      expect(onChange).toHaveBeenLastCalledWith('sm');
    });

    it('mirrors controlled sidebarWidth without persisting', () => {
      const onChange = vi.fn();
      render(
        <AppShell
          storageKey="demo"
          sidebarResize
          sidebarWidth="lg"
          onSidebarWidthChange={onChange}
          sidebar={<Sidebar aria-label="primary">rail</Sidebar>}
        >
          <p>page</p>
        </AppShell>,
      );
      const handle = screen.getByRole('separator', { name: 'Resize sidebar' });
      expect(handle).toHaveAttribute('aria-valuenow', '288');
      fireEvent.keyDown(handle, { key: 'ArrowLeft' });
      expect(onChange).toHaveBeenCalledWith('md');
      // Controlled — storage is not touched.
      expect(window.localStorage.getItem('demo/sidebar-width')).toBeNull();
    });
  });

  describe('inspector edge tab', () => {
    it('renders an expand affordance on the trailing edge when the inspector is closed', () => {
      render(
        <AppShell defaultInspectorOpen={false} inspector={<aside>i</aside>}>
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('button', { name: 'Open inspector' })).toBeInTheDocument();
    });

    it('opens the inspector on click', () => {
      render(
        <AppShell defaultInspectorOpen={false} inspector={<aside data-testid="ins">i</aside>}>
          <p>page</p>
        </AppShell>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Open inspector' }));
      expect(screen.getByTestId('ins').parentElement).toHaveAttribute('data-open', 'true');
      expect(screen.queryByRole('button', { name: 'Open inspector' })).not.toBeInTheDocument();
    });

    it('is hidden when the inspector is already open', () => {
      render(
        <AppShell inspector={<aside>i</aside>}>
          <p>page</p>
        </AppShell>,
      );
      expect(screen.queryByRole('button', { name: 'Open inspector' })).not.toBeInTheDocument();
    });

    it('honors a custom inspectorEdgeTabLabel', () => {
      render(
        <AppShell
          defaultInspectorOpen={false}
          inspectorEdgeTabLabel="Show details"
          inspector={<aside>i</aside>}
        >
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('button', { name: 'Show details' })).toBeInTheDocument();
    });

    it('omits the edge tab when inspectorEdgeTab={false}', () => {
      render(
        <AppShell
          defaultInspectorOpen={false}
          inspectorEdgeTab={false}
          inspector={<aside>i</aside>}
        >
          <p>page</p>
        </AppShell>,
      );
      expect(screen.queryByRole('button', { name: 'Open inspector' })).not.toBeInTheDocument();
    });
  });

  describe('main column density / padding', () => {
    it('applies the default density variant by default', () => {
      render(
        <AppShell>
          <p>page</p>
        </AppShell>,
      );
      const main = screen.getByRole('main');
      // Recipe class names follow the `<file>_<name>_<variant>_<value>` shape.
      expect(main.className).toMatch(/main_density_default/);
      expect(main.className).toMatch(/main_padded_true/);
    });

    it('applies the compact density variant when requested', () => {
      render(
        <AppShell mainDensity="compact">
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('main').className).toMatch(/main_density_compact/);
    });

    it('applies the comfortable density variant when requested', () => {
      render(
        <AppShell mainDensity="comfortable">
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('main').className).toMatch(/main_density_comfortable/);
    });

    it('zeroes padding when mainPadding={false}', () => {
      render(
        <AppShell mainPadding={false}>
          <p>page</p>
        </AppShell>,
      );
      expect(screen.getByRole('main').className).toMatch(/main_padded_false/);
    });
  });

  describe('keyboard cheat-sheet', () => {
    it('opens the cheat-sheet dialog on shift+?', () => {
      render(
        <AppShell sidebar={<Sidebar aria-label="primary">rail</Sidebar>}>
          <p>page</p>
        </AppShell>,
      );
      expect(
        screen.queryByRole('dialog', { name: 'Keyboard shortcuts' }),
      ).not.toBeInTheDocument();
      fireEvent.keyDown(document, { key: '?', shiftKey: true });
      expect(
        screen.getByRole('dialog', { name: 'Keyboard shortcuts' }),
      ).toBeInTheDocument();
    });

    it('lists the active shell hotkeys', () => {
      render(
        <AppShell
          sidebar={<Sidebar aria-label="primary">rail</Sidebar>}
          inspector={<aside>i</aside>}
        >
          <p>page</p>
        </AppShell>,
      );
      fireEvent.keyDown(document, { key: '?', shiftKey: true });
      const dialog = screen.getByRole('dialog', { name: 'Keyboard shortcuts' });
      expect(dialog).toHaveTextContent(/toggle sidebar/i);
      expect(dialog).toHaveTextContent(/toggle inspector/i);
    });

    it('omits hotkeys for slots that are not mounted', () => {
      render(
        <AppShell>
          <p>page</p>
        </AppShell>,
      );
      fireEvent.keyDown(document, { key: '?', shiftKey: true });
      const dialog = screen.getByRole('dialog', { name: 'Keyboard shortcuts' });
      expect(dialog).not.toHaveTextContent(/toggle sidebar/i);
      expect(dialog).not.toHaveTextContent(/toggle inspector/i);
    });

    it('appends consumer-supplied hints under a "This app" heading', () => {
      render(
        <AppShell keyboardHints={[{ keys: 'mod+s', description: 'Save draft' }]}>
          <p>page</p>
        </AppShell>,
      );
      fireEvent.keyDown(document, { key: '?', shiftKey: true });
      const dialog = screen.getByRole('dialog', { name: 'Keyboard shortcuts' });
      expect(dialog).toHaveTextContent('This app');
      expect(dialog).toHaveTextContent('Save draft');
    });

    it('does not fire when typing in an input', () => {
      render(
        <AppShell>
          <input data-testid="text" />
        </AppShell>,
      );
      const input = screen.getByTestId('text');
      input.focus();
      fireEvent.keyDown(input, { key: '?', shiftKey: true });
      expect(
        screen.queryByRole('dialog', { name: 'Keyboard shortcuts' }),
      ).not.toBeInTheDocument();
    });

    it('opts out when keyboardHintsHotkey is false', () => {
      render(
        <AppShell keyboardHintsHotkey={false}>
          <p>page</p>
        </AppShell>,
      );
      fireEvent.keyDown(document, { key: '?', shiftKey: true });
      expect(
        screen.queryByRole('dialog', { name: 'Keyboard shortcuts' }),
      ).not.toBeInTheDocument();
    });
  });
});
