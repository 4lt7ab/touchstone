import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './Tabs.js';

describe('Tabs', () => {
  it('renders a tablist with one tab per Trigger and one panel visible', () => {
    render(
      <Tabs defaultValue="profile">
        <Tabs.List aria-label="Account">
          <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
          <Tabs.Trigger value="security">Security</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="profile">profile body</Tabs.Panel>
        <Tabs.Panel value="security">security body</Tabs.Panel>
      </Tabs>,
    );
    expect(screen.getByRole('tablist', { name: 'Account' })).toBeInTheDocument();
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(2);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('profile body');
  });

  it('wires aria-controls / aria-labelledby across trigger and panel', () => {
    render(
      <Tabs defaultValue="profile">
        <Tabs.List aria-label="Account">
          <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="profile">body</Tabs.Panel>
      </Tabs>,
    );
    const trigger = screen.getByRole('tab', { name: 'Profile' });
    const panel = screen.getByRole('tabpanel');
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(trigger.id);
  });

  it('clicking a trigger switches the visible panel', async () => {
    render(
      <Tabs defaultValue="profile">
        <Tabs.List aria-label="Account">
          <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
          <Tabs.Trigger value="security">Security</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="profile">profile body</Tabs.Panel>
        <Tabs.Panel value="security">security body</Tabs.Panel>
      </Tabs>,
    );
    await userEvent.click(screen.getByRole('tab', { name: 'Security' }));
    expect(screen.getByRole('tab', { name: 'Security' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('security body');
  });

  it('arrow keys move focus across triggers without changing selection (manual activation)', async () => {
    const onValueChange = vi.fn();
    render(
      <Tabs defaultValue="profile" onValueChange={onValueChange}>
        <Tabs.List aria-label="Account">
          <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
          <Tabs.Trigger value="security">Security</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="profile">profile body</Tabs.Panel>
        <Tabs.Panel value="security">security body</Tabs.Panel>
      </Tabs>,
    );
    const profile = screen.getByRole('tab', { name: 'Profile' });
    profile.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Security' })).toHaveFocus();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('controlled value drives selection', async () => {
    function Host(): React.JSX.Element {
      const [v, setV] = useState('profile');
      return (
        <>
          <Tabs value={v} onValueChange={setV}>
            <Tabs.List aria-label="Account">
              <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
              <Tabs.Trigger value="security">Security</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Panel value="profile">profile body</Tabs.Panel>
            <Tabs.Panel value="security">security body</Tabs.Panel>
          </Tabs>
          <span data-testid="parent">{v}</span>
        </>
      );
    }
    render(<Host />);
    await userEvent.click(screen.getByRole('tab', { name: 'Security' }));
    expect(screen.getByTestId('parent').textContent).toBe('security');
  });

  it('disabled trigger does not change selection', async () => {
    const onValueChange = vi.fn();
    render(
      <Tabs defaultValue="profile" onValueChange={onValueChange}>
        <Tabs.List aria-label="Account">
          <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
          <Tabs.Trigger value="security" disabled>
            Security
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="profile">profile body</Tabs.Panel>
        <Tabs.Panel value="security">security body</Tabs.Panel>
      </Tabs>,
    );
    const sec = screen.getByRole('tab', { name: 'Security' });
    expect(sec).toBeDisabled();
    await userEvent.click(sec);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('throws when subcomponents are used outside Tabs', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(<Tabs.Trigger value="x">x</Tabs.Trigger>),
    ).toThrow(/<Tabs\.Trigger> must be rendered inside <Tabs>/);
    spy.mockRestore();
  });
});
