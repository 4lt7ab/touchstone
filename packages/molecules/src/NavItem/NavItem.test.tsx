import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavItem } from './NavItem.js';

describe('NavItem', () => {
  it('renders a button by default with the label as accessible name', () => {
    render(<NavItem>orders</NavItem>);
    const btn = screen.getByRole('button', { name: 'orders' });
    expect(btn.tagName).toBe('BUTTON');
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('fires onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<NavItem onClick={onClick}>orders</NavItem>);
    await userEvent.click(screen.getByRole('button', { name: 'orders' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('sets aria-current="page" when selected', () => {
    render(<NavItem selected>orders</NavItem>);
    expect(screen.getByRole('button', { name: 'orders' })).toHaveAttribute('aria-current', 'page');
  });

  it('lets an explicit aria-current override the selected default', () => {
    render(
      <NavItem selected aria-current="step">
        step two
      </NavItem>,
    );
    expect(screen.getByRole('button', { name: 'step two' })).toHaveAttribute(
      'aria-current',
      'step',
    );
  });

  it('does not fire onClick when disabled and applies aria-disabled', async () => {
    const onClick = vi.fn();
    render(
      <NavItem disabled onClick={onClick}>
        sealed drawer
      </NavItem>,
    );
    const btn = screen.getByRole('button', { name: 'sealed drawer' });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders the icon slot with aria-hidden so the label remains the accessible name', () => {
    render(<NavItem icon={<svg data-testid="leading-icon" />}>orders</NavItem>);
    expect(screen.getByRole('button', { name: 'orders' })).toBeInTheDocument();
    const icon = screen.getByTestId('leading-icon');
    expect(icon.parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the trailing slot', () => {
    render(<NavItem trailing={<span data-testid="count">3</span>}>orders</NavItem>);
    expect(screen.getByTestId('count')).toHaveTextContent('3');
  });

  it('renders the child element when asChild is true and preserves the label', () => {
    render(
      <NavItem asChild>
        <a href="/orders">orders</a>
      </NavItem>,
    );
    const link = screen.getByRole('link', { name: 'orders' });
    expect(link).toHaveAttribute('href', '/orders');
    expect(link).not.toHaveAttribute('type');
  });

  it('keeps icon + trailing slots when rendered asChild', () => {
    render(
      <NavItem
        asChild
        icon={<svg data-testid="leading-icon" />}
        trailing={<span data-testid="count">7</span>}
      >
        <a href="/sealed">sealed</a>
      </NavItem>,
    );
    const link = screen.getByRole('link', { name: /sealed/ });
    expect(link).toHaveAttribute('href', '/sealed');
    expect(screen.getByTestId('leading-icon')).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('7');
  });

  it('forwards a custom role onto the rendered element', () => {
    render(<NavItem role="menuitem">leave the bench</NavItem>);
    expect(screen.getByRole('menuitem', { name: 'leave the bench' })).toBeInTheDocument();
  });

  it('renders the danger tone variant', () => {
    render(<NavItem tone="danger">leave the bench</NavItem>);
    const btn = screen.getByRole('button', { name: 'leave the bench' });
    expect(btn.className).toMatch(/tone_danger|toneDanger|tone-danger/);
  });
});
