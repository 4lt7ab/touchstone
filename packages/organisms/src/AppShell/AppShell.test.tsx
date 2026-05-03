import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
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
