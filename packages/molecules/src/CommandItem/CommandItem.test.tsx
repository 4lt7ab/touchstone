import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandItem } from './CommandItem.js';

describe('CommandItem', () => {
  it('renders as role=option with the label as accessible name', () => {
    render(<CommandItem>Open project</CommandItem>);
    expect(screen.getByRole('option', { name: 'Open project' })).toBeInTheDocument();
  });

  it('shows icon, description, and shortcut slots', () => {
    render(
      <CommandItem
        icon={<span data-testid="icon" />}
        description="Switch to a project workspace"
        shortcut={<span data-testid="kbd">⌘O</span>}
      >
        Open project
      </CommandItem>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Switch to a project workspace')).toBeInTheDocument();
    expect(screen.getByTestId('kbd')).toBeInTheDocument();
  });

  it('aria-selected reflects highlighted by default', () => {
    const { rerender } = render(<CommandItem highlighted={false}>Pick</CommandItem>);
    expect(screen.getByRole('option', { name: 'Pick' })).toHaveAttribute('aria-selected', 'false');
    rerender(<CommandItem highlighted>Pick</CommandItem>);
    expect(screen.getByRole('option', { name: 'Pick' })).toHaveAttribute('aria-selected', 'true');
  });

  it('aria-selected can be split from highlighted via the `selected` prop', () => {
    render(
      <CommandItem highlighted={false} selected>
        Pick
      </CommandItem>,
    );
    expect(screen.getByRole('option', { name: 'Pick' })).toHaveAttribute('aria-selected', 'true');
  });

  it('fires onSelect on click', async () => {
    const onSelect = vi.fn();
    render(<CommandItem onSelect={onSelect}>Pick</CommandItem>);
    await userEvent.click(screen.getByRole('option', { name: 'Pick' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('does not fire onSelect when disabled', async () => {
    const onSelect = vi.fn();
    render(
      <CommandItem disabled onSelect={onSelect}>
        Pick
      </CommandItem>,
    );
    const row = screen.getByRole('option', { name: 'Pick' });
    expect(row).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(row);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('fires onPointerEnter so a parent can set the keyboard cursor on hover', async () => {
    const onPointerEnter = vi.fn();
    render(<CommandItem onPointerEnter={onPointerEnter}>Pick</CommandItem>);
    await userEvent.hover(screen.getByRole('option', { name: 'Pick' }));
    expect(onPointerEnter).toHaveBeenCalled();
  });

  it('honours an explicit role override (autocomplete/menuitem usage)', () => {
    render(<CommandItem role="menuitem">Pick</CommandItem>);
    expect(screen.getByRole('menuitem', { name: 'Pick' })).toBeInTheDocument();
  });

  it('danger tone reads as a destructive option', () => {
    render(
      <CommandItem tone="danger" highlighted>
        Delete project
      </CommandItem>,
    );
    expect(screen.getByRole('option', { name: 'Delete project' })).toHaveAttribute(
      'data-highlighted',
      'true',
    );
  });
});
