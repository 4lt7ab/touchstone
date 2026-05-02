import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
