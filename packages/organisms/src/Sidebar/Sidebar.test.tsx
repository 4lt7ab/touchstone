import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NavItem, NavSection } from '@touchstone/molecules';
import { Sidebar } from './Sidebar.js';

describe('Sidebar', () => {
  it('renders a primary navigation landmark', () => {
    render(<Sidebar>nav</Sidebar>);
    expect(screen.getByRole('navigation', { name: 'primary' })).toBeInTheDocument();
  });

  it('honors a custom aria-label', () => {
    render(<Sidebar aria-label="bench">nav</Sidebar>);
    expect(screen.getByRole('navigation', { name: 'bench' })).toBeInTheDocument();
  });

  it('renders header, children, and footer slots', () => {
    render(
      <Sidebar header={<span>workshop</span>} footer={<span>apprentice</span>}>
        <span>orders</span>
      </Sidebar>,
    );
    expect(screen.getByText('workshop')).toBeInTheDocument();
    expect(screen.getByText('orders')).toBeInTheDocument();
    expect(screen.getByText('apprentice')).toBeInTheDocument();
  });

  it('omits header and footer when their props are missing but always renders the body', () => {
    const { container } = render(<Sidebar>orders</Sidebar>);
    expect(container.querySelectorAll('nav > div')).toHaveLength(1);
  });

  describe('collapsed', () => {
    it('marks the nav with data-collapsed and propagates the layout to descendants', () => {
      render(
        <Sidebar collapsed aria-label="primary">
          <NavSection label="bench">
            <NavItem icon={<svg />}>orders</NavItem>
            <NavItem icon={<svg />} trailing={<span data-testid="count">3</span>}>
              moulds
            </NavItem>
          </NavSection>
        </Sidebar>,
      );

      const nav = screen.getByRole('navigation', { name: 'primary' });
      expect(nav).toHaveAttribute('data-collapsed', 'true');

      expect(screen.queryByText('bench')).not.toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'bench' })).toBeInTheDocument();

      const orders = screen.getByRole('button', { name: 'orders' });
      expect(orders).toHaveAttribute('aria-label', 'orders');
      expect(orders).not.toHaveTextContent('orders');

      expect(screen.queryByTestId('count')).not.toBeInTheDocument();
    });

    it('renders descendants in expanded form when collapsed is false', () => {
      render(
        <Sidebar aria-label="primary">
          <NavSection label="bench">
            <NavItem icon={<svg />}>orders</NavItem>
          </NavSection>
        </Sidebar>,
      );
      expect(screen.getByRole('navigation', { name: 'primary' })).not.toHaveAttribute(
        'data-collapsed',
      );
      expect(screen.getByText('bench')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'orders' })).toHaveTextContent('orders');
    });
  });
});
