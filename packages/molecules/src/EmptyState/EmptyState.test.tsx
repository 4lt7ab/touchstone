import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState.js';

describe('EmptyState', () => {
  it('wraps children in a section labelled by the title', () => {
    render(
      <EmptyState data-testid="empty">
        <EmptyState.Title>no invoices yet</EmptyState.Title>
        <EmptyState.Description>create one to get started.</EmptyState.Description>
      </EmptyState>,
    );
    const region = screen.getByRole('region', { name: 'no invoices yet' });
    expect(region.tagName).toBe('SECTION');
    expect(screen.getByText('create one to get started.')).toBeInTheDocument();
  });

  it('renders the title as h2 by default', () => {
    render(
      <EmptyState>
        <EmptyState.Title>nothing here</EmptyState.Title>
      </EmptyState>,
    );
    const heading = screen.getByRole('heading', { name: 'nothing here' });
    expect(heading.tagName).toBe('H2');
  });

  it('renders the title at a different level when `as` is set', () => {
    render(
      <EmptyState>
        <EmptyState.Title as="h1">first run</EmptyState.Title>
      </EmptyState>,
    );
    expect(screen.getByRole('heading', { name: 'first run' }).tagName).toBe('H1');
  });

  it('renders the icon as aria-hidden', () => {
    render(
      <EmptyState>
        <EmptyState.Icon>
          <span data-testid="glyph">x</span>
        </EmptyState.Icon>
        <EmptyState.Title>no entries</EmptyState.Title>
      </EmptyState>,
    );
    const glyph = screen.getByTestId('glyph');
    expect(glyph.parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders actions', () => {
    render(
      <EmptyState>
        <EmptyState.Title>no entries</EmptyState.Title>
        <EmptyState.Actions>
          <button type="button">new entry</button>
        </EmptyState.Actions>
      </EmptyState>,
    );
    expect(screen.getByRole('button', { name: 'new entry' })).toBeInTheDocument();
  });

  it('throws when a part is rendered outside EmptyState', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<EmptyState.Title>orphaned</EmptyState.Title>)).toThrow(
      /must be rendered inside <EmptyState>/,
    );
    error.mockRestore();
  });
});
