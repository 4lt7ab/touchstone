import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandPalette, type CommandPaletteCommand } from './CommandPalette.js';

function makeCommands(actions: Record<string, () => void> = {}): CommandPaletteCommand[] {
  return [
    {
      id: 'open',
      label: 'Open project',
      group: 'Navigation',
      keywords: ['project', 'switch'],
      onSelect: actions.open ?? (() => {}),
    },
    {
      id: 'new',
      label: 'New project',
      group: 'Navigation',
      onSelect: actions.new ?? (() => {}),
    },
    {
      id: 'theme',
      label: 'Switch theme',
      group: 'Settings',
      onSelect: actions.theme ?? (() => {}),
    },
    {
      id: 'delete',
      label: 'Delete project',
      group: 'Settings',
      tone: 'danger',
      onSelect: actions.del ?? (() => {}),
    },
    {
      id: 'archived',
      label: 'Archive (disabled)',
      group: 'Settings',
      disabled: true,
      onSelect: actions.archive ?? (() => {}),
    },
  ];
}

function Host({
  commands,
  initialOpen = true,
}: {
  commands: CommandPaletteCommand[];
  initialOpen?: boolean;
}): React.JSX.Element {
  const [open, setOpen] = useState(initialOpen);
  return (
    <>
      <button onClick={() => setOpen(true)}>open</button>
      <CommandPalette open={open} onOpenChange={setOpen} commands={commands} />
    </>
  );
}

describe('CommandPalette', () => {
  it('does not render when open is false', () => {
    render(<Host commands={makeCommands()} initialOpen={false} />);
    expect(screen.queryByRole('dialog', { name: 'Command palette' })).toBeNull();
  });

  it('renders a dialog with combobox + listbox when open', () => {
    render(<Host commands={makeCommands()} />);
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: 'Command palette' })).toBeInTheDocument();
  });

  it('shows all commands by default, grouped under headings', () => {
    render(<Host commands={makeCommands()} />);
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Open project' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'New project' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Switch theme' })).toBeInTheDocument();
  });

  it('filters by label substring', async () => {
    render(<Host commands={makeCommands()} />);
    await userEvent.type(screen.getByRole('combobox'), 'theme');
    expect(screen.queryByRole('option', { name: 'Open project' })).toBeNull();
    expect(screen.getByRole('option', { name: 'Switch theme' })).toBeInTheDocument();
  });

  it('filters on keyword aliases', async () => {
    render(<Host commands={makeCommands()} />);
    await userEvent.type(screen.getByRole('combobox'), 'switch');
    // 'switch' matches Open project's keyword AND Switch theme's label
    expect(screen.getByRole('option', { name: 'Open project' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Switch theme' })).toBeInTheDocument();
  });

  it('shows the empty message when nothing matches', async () => {
    render(<Host commands={makeCommands()} />);
    await userEvent.type(screen.getByRole('combobox'), 'xyzzy');
    expect(screen.getByText('No matches')).toBeInTheDocument();
  });

  it('arrow down moves the cursor and ArrowUp wraps to the end', async () => {
    render(<Host commands={makeCommands()} />);
    const combobox = screen.getByRole('combobox');
    await userEvent.click(combobox);
    // first item is highlighted
    expect(screen.getByRole('option', { name: 'Open project' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'New project' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await userEvent.keyboard('{ArrowUp}');
    expect(screen.getByRole('option', { name: 'Open project' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await userEvent.keyboard('{ArrowUp}'); // wraps to last
    expect(screen.getByRole('option', { name: 'Archive (disabled)' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('Enter activates the highlighted command and closes the palette', async () => {
    const open = vi.fn();
    const newAction = vi.fn();
    render(<Host commands={makeCommands({ open, new: newAction })} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');
    expect(newAction).toHaveBeenCalledTimes(1);
    expect(open).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog', { name: 'Command palette' })).toBeNull();
  });

  it('Escape closes the palette without running anything', async () => {
    const open = vi.fn();
    render(<Host commands={makeCommands({ open })} />);
    await userEvent.keyboard('{Escape}');
    expect(open).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog', { name: 'Command palette' })).toBeNull();
  });

  it('clicking a command runs it and closes the palette', async () => {
    const theme = vi.fn();
    render(<Host commands={makeCommands({ theme })} />);
    await userEvent.click(screen.getByRole('option', { name: 'Switch theme' }));
    expect(theme).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog', { name: 'Command palette' })).toBeNull();
  });

  it('disabled commands cannot be activated', async () => {
    const archive = vi.fn();
    render(<Host commands={makeCommands({ archive })} />);
    await userEvent.click(screen.getByRole('option', { name: 'Archive (disabled)' }));
    expect(archive).not.toHaveBeenCalled();
  });

  it('hover moves the keyboard cursor onto the hovered command', async () => {
    render(<Host commands={makeCommands()} />);
    await userEvent.hover(screen.getByRole('option', { name: 'Switch theme' }));
    expect(screen.getByRole('option', { name: 'Switch theme' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('aria-activedescendant points at the highlighted option', async () => {
    render(<Host commands={makeCommands()} />);
    const combobox = screen.getByRole('combobox');
    expect(combobox.getAttribute('aria-activedescendant')).toBeTruthy();
    expect(combobox.getAttribute('aria-activedescendant')).toContain('-cmd-open');
    await userEvent.keyboard('{ArrowDown}');
    expect(combobox.getAttribute('aria-activedescendant')).toContain('-cmd-new');
  });

  it('reset query and cursor when reopened', async () => {
    function Toggle(): React.JSX.Element {
      const [open, setOpen] = useState(true);
      return (
        <>
          <button onClick={() => setOpen((o) => !o)}>toggle</button>
          <CommandPalette open={open} onOpenChange={setOpen} commands={makeCommands()} />
        </>
      );
    }
    render(<Toggle />);
    await userEvent.type(screen.getByRole('combobox'), 'theme');
    expect(screen.queryByRole('option', { name: 'Open project' })).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'toggle' })); // close
    await userEvent.click(screen.getByRole('button', { name: 'toggle' })); // re-open
    expect(screen.getByRole('combobox')).toHaveValue('');
    expect(screen.getByRole('option', { name: 'Open project' })).toBeInTheDocument();
  });

  it('renders the keyboard hint footer', () => {
    render(<Host commands={makeCommands()} />);
    const dialog = screen.getByRole('dialog', { name: 'Command palette' });
    expect(within(dialog).getByText('navigate')).toBeInTheDocument();
    expect(within(dialog).getByText('run')).toBeInTheDocument();
    expect(within(dialog).getByText('close')).toBeInTheDocument();
  });

  it('accepts a custom filter', async () => {
    function customFilter(c: CommandPaletteCommand, q: string): boolean {
      // Match only commands whose label STARTS WITH the query (not substring).
      return c.label.toLowerCase().startsWith(q.toLowerCase());
    }
    function Host2(): React.JSX.Element {
      const [open, setOpen] = useState(true);
      return (
        <CommandPalette
          open={open}
          onOpenChange={setOpen}
          commands={makeCommands()}
          filter={customFilter}
        />
      );
    }
    render(<Host2 />);
    await userEvent.type(screen.getByRole('combobox'), 'open');
    expect(screen.getByRole('option', { name: 'Open project' })).toBeInTheDocument();
    // 'project' is in the label as a SUFFIX of multiple labels — but our
    // custom filter only matches prefixes
    await userEvent.clear(screen.getByRole('combobox'));
    await userEvent.type(screen.getByRole('combobox'), 'project');
    expect(screen.queryByRole('option', { name: 'Open project' })).toBeNull();
  });
});
