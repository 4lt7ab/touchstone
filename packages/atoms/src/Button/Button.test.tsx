import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button.js';

describe('Button', () => {
  it('renders a button by default with type="button"', () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toBeInTheDocument();
    expect(btn.tagName).toBe('BUTTON');
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('fires onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Tap</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Tap' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders the child element when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/somewhere">Linked button</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Linked button' });
    expect(link).toHaveAttribute('href', '/somewhere');
    expect(link).not.toHaveAttribute('type');
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Off
      </Button>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Off' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders an icon-shaped button with shape="square"', () => {
    render(
      <Button shape="square" size="sm" aria-label="dismiss">
        x
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'dismiss' })).toBeInTheDocument();
  });

  it('renders a leading icon slot, decorated and aria-hidden', () => {
    render(
      <Button icon={<span data-testid="leading">+</span>}>New project</Button>,
    );
    const btn = screen.getByRole('button', { name: 'New project' });
    const slot = screen.getByTestId('leading').parentElement;
    expect(btn.contains(slot)).toBe(true);
    expect(slot).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a trailing slot, decorated and aria-hidden', () => {
    render(
      <Button trailing={<span data-testid="kbd">⌘K</span>}>Search</Button>,
    );
    const btn = screen.getByRole('button', { name: 'Search' });
    const slot = screen.getByTestId('kbd').parentElement;
    expect(btn.contains(slot)).toBe(true);
    expect(slot).toHaveAttribute('aria-hidden', 'true');
  });

  it('splices icon and trailing into the cloned child when asChild is true', () => {
    render(
      <Button
        asChild
        icon={<span data-testid="leading">+</span>}
        trailing={<span data-testid="trail">→</span>}
      >
        <a href="/new">create</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: /create/ });
    expect(link.contains(screen.getByTestId('leading'))).toBe(true);
    expect(link.contains(screen.getByTestId('trail'))).toBe(true);
    expect(link).toHaveTextContent('create');
  });
});
