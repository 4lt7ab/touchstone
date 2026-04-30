import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Disclosure } from './Disclosure.js';

describe('Disclosure', () => {
  it('starts closed and opens on trigger click', async () => {
    render(
      <Disclosure>
        <Disclosure.Trigger>What is touchstone?</Disclosure.Trigger>
        <Disclosure.Content>A reference component library.</Disclosure.Content>
      </Disclosure>,
    );
    const trigger = screen.getByRole('button', { name: /touchstone/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('wires aria-controls to the content id', () => {
    render(
      <Disclosure defaultOpen>
        <Disclosure.Trigger>label</Disclosure.Trigger>
        <Disclosure.Content>body</Disclosure.Content>
      </Disclosure>,
    );
    const trigger = screen.getByRole('button', { name: 'label' });
    const content = screen.getByText('body');
    expect(trigger.getAttribute('aria-controls')).toBe(content.id);
  });

  it('hides content via the hidden attribute when closed', () => {
    render(
      <Disclosure>
        <Disclosure.Trigger>label</Disclosure.Trigger>
        <Disclosure.Content>body</Disclosure.Content>
      </Disclosure>,
    );
    expect(screen.getByText('body')).toHaveAttribute('hidden');
  });

  it('respects controlled open state', async () => {
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Disclosure open={open} onOpenChange={setOpen}>
            <Disclosure.Trigger>label</Disclosure.Trigger>
            <Disclosure.Content>body</Disclosure.Content>
          </Disclosure>
          <span data-testid="parent-state">{String(open)}</span>
        </>
      );
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole('button', { name: 'label' }));
    expect(screen.getByTestId('parent-state').textContent).toBe('true');
  });

  it('throws when subcomponents are used outside Disclosure', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(<Disclosure.Trigger>orphan</Disclosure.Trigger>),
    ).toThrow(/<Disclosure\.Trigger> must be rendered inside <Disclosure>/);
    spy.mockRestore();
  });
});
