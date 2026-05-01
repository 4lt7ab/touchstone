import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@touchstone/atoms';
import { Menu } from './Menu.js';

describe('Menu', () => {
  it('opens on trigger click and renders menu items', async () => {
    function Host(): React.JSX.Element {
      const [open, setOpen] = useState(false);
      return (
        <Menu open={open} onOpenChange={setOpen}>
          <Menu.Trigger>
            <Button>account</Button>
          </Menu.Trigger>
          <Menu.Content aria-label="account menu">
            <Menu.Item onSelect={() => {}}>profile</Menu.Item>
            <Menu.Item onSelect={() => {}}>settings</Menu.Item>
          </Menu.Content>
        </Menu>
      );
    }
    render(<Host />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'account' }));
    const menu = await screen.findByRole('menu');
    expect(menu).toHaveAccessibleName('account menu');
    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('profile');
  });

  it('wires aria-haspopup="menu" and aria-expanded on the trigger', async () => {
    render(
      <Menu defaultOpen>
        <Menu.Trigger>
          <Button>more</Button>
        </Menu.Trigger>
        <Menu.Content aria-label="m">
          <Menu.Item>a</Menu.Item>
        </Menu.Content>
      </Menu>,
    );
    const trigger = screen.getByRole('button', { name: 'more' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('selecting an item fires onSelect and closes the menu', async () => {
    const onSelect = vi.fn();
    function Host(): React.JSX.Element {
      const [open, setOpen] = useState(true);
      return (
        <Menu open={open} onOpenChange={setOpen}>
          <Menu.Trigger>
            <Button>more</Button>
          </Menu.Trigger>
          <Menu.Content aria-label="m">
            <Menu.Item onSelect={onSelect}>profile</Menu.Item>
          </Menu.Content>
        </Menu>
      );
    }
    render(<Host />);
    await userEvent.click(screen.getByRole('menuitem', { name: 'profile' }));
    expect(onSelect).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
  });

  it('disabled items do not fire onSelect or close the menu', async () => {
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Menu defaultOpen onOpenChange={onOpenChange}>
        <Menu.Trigger>
          <Button>more</Button>
        </Menu.Trigger>
        <Menu.Content aria-label="m">
          <Menu.Item onSelect={onSelect} disabled>
            disabled
          </Menu.Item>
          <Menu.Item onSelect={() => {}}>active</Menu.Item>
        </Menu.Content>
      </Menu>,
    );
    const disabled = screen.getByRole('menuitem', { name: 'disabled' });
    await userEvent.click(disabled);
    expect(onSelect).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('arrow keys move focus across items, skipping the separator index', async () => {
    render(
      <Menu defaultOpen>
        <Menu.Trigger>
          <Button>more</Button>
        </Menu.Trigger>
        <Menu.Content aria-label="m">
          <Menu.Item>profile</Menu.Item>
          <Menu.Separator />
          <Menu.Item>settings</Menu.Item>
          <Menu.Item>sign out</Menu.Item>
        </Menu.Content>
      </Menu>,
    );
    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(3);
    await waitFor(() => expect(items[0]).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    expect(items[1]).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(items[2]).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(items[2]).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(items[0]).toHaveFocus();
  });

  it('Escape closes the menu', async () => {
    const onOpenChange = vi.fn();
    render(
      <Menu defaultOpen onOpenChange={onOpenChange}>
        <Menu.Trigger>
          <Button>more</Button>
        </Menu.Trigger>
        <Menu.Content aria-label="m">
          <Menu.Item>x</Menu.Item>
        </Menu.Content>
      </Menu>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('renders a separator between item groups', () => {
    render(
      <Menu defaultOpen>
        <Menu.Trigger>
          <Button>more</Button>
        </Menu.Trigger>
        <Menu.Content aria-label="m">
          <Menu.Item>a</Menu.Item>
          <Menu.Separator />
          <Menu.Item>b</Menu.Item>
        </Menu.Content>
      </Menu>,
    );
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('throws when subcomponents are used outside Menu', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(
        <Menu.Trigger>
          <Button>x</Button>
        </Menu.Trigger>,
      ),
    ).toThrow(/<Menu\.Trigger> must be rendered inside <Menu>/);
    spy.mockRestore();
  });
});
