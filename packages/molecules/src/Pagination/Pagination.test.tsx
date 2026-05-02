import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination.js';

describe('Pagination', () => {
  it('renders a nav landmark with page buttons', () => {
    render(<Pagination pageCount={5} aria-label="Ledger pages" />);
    expect(screen.getByRole('navigation', { name: 'Ledger pages' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Page 5' })).toBeInTheDocument();
  });

  it('marks the current page with aria-current and disables prev/first at the start', () => {
    render(<Pagination pageCount={10} defaultPage={1} />);
    expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
  });

  it('disables next/last at the end', () => {
    render(<Pagination pageCount={4} defaultPage={4} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Last page' })).toBeDisabled();
  });

  it('clicking a page button fires onPageChange', async () => {
    const onPageChange = vi.fn();
    render(<Pagination pageCount={6} defaultPage={1} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(2);
  });

  it('renders an ellipsis when the page list has gaps', () => {
    render(<Pagination pageCount={20} defaultPage={10} />);
    // boundary=1, sibling=1: 1 … 9 10 11 … 20
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 9' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 10' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Page 11' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 20' })).toBeInTheDocument();
    // No page 5, no page 15 — collapsed into ellipses.
    expect(screen.queryByRole('button', { name: 'Page 5' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Page 15' })).not.toBeInTheDocument();
  });

  it('controlled mode: parent owns the page', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={3} pageCount={10} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 4' }));
    expect(onPageChange).toHaveBeenLastCalledWith(4);
    // Page 3 still marked current — parent hasn't pushed back.
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
  });

  it('clicking the current page does not fire onPageChange', async () => {
    const onPageChange = vi.fn();
    render(<Pagination pageCount={5} defaultPage={2} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('arrow keys move focus across the page chips', async () => {
    render(<Pagination pageCount={5} defaultPage={3} />);
    const current = screen.getByRole('button', { name: 'Page 3' });
    current.focus();
    expect(current).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'Page 4' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveFocus();
  });

  it('disabled disables every button', () => {
    render(<Pagination pageCount={5} defaultPage={3} disabled />);
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled();
    }
  });
});
