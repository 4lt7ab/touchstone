import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataTablePage } from './DataTablePage.js';

describe('DataTablePage', () => {
  it('renders the header from PageHeader', () => {
    render(
      <DataTablePage rowCount={3}>
        <DataTablePage.Header title="Invoices" />
      </DataTablePage>,
    );
    expect(screen.getByRole('heading', { name: 'Invoices' })).toBeInTheDocument();
  });

  it('shows Table and Pagination, hides Empty when rowCount > 0', () => {
    render(
      <DataTablePage rowCount={5} data-testid="page">
        <DataTablePage.Header title="Invoices" />
        <DataTablePage.Table>
          <div data-testid="t">table</div>
        </DataTablePage.Table>
        <DataTablePage.Pagination>
          <div data-testid="p">pagination</div>
        </DataTablePage.Pagination>
        <DataTablePage.Empty>
          <div data-testid="e">empty</div>
        </DataTablePage.Empty>
      </DataTablePage>,
    );
    expect(screen.getByTestId('page')).toHaveAttribute('data-state', 'populated');
    expect(screen.getByTestId('t')).toBeInTheDocument();
    expect(screen.getByTestId('p')).toBeInTheDocument();
    expect(screen.queryByTestId('e')).not.toBeInTheDocument();
  });

  it('shows Empty, hides Table and Pagination when rowCount = 0', () => {
    render(
      <DataTablePage rowCount={0} data-testid="page">
        <DataTablePage.Header title="Invoices" />
        <DataTablePage.Table>
          <div data-testid="t">table</div>
        </DataTablePage.Table>
        <DataTablePage.Pagination>
          <div data-testid="p">pagination</div>
        </DataTablePage.Pagination>
        <DataTablePage.Empty>
          <div data-testid="e">empty</div>
        </DataTablePage.Empty>
      </DataTablePage>,
    );
    expect(screen.getByTestId('page')).toHaveAttribute('data-state', 'empty');
    expect(screen.queryByTestId('t')).not.toBeInTheDocument();
    expect(screen.queryByTestId('p')).not.toBeInTheDocument();
    expect(screen.getByTestId('e')).toBeInTheDocument();
  });

  it('renders the filter bar regardless of rowCount', () => {
    const { rerender } = render(
      <DataTablePage rowCount={0}>
        <DataTablePage.FilterBar aria-label="filters">
          <input aria-label="search" />
        </DataTablePage.FilterBar>
      </DataTablePage>,
    );
    expect(screen.getByRole('region', { name: 'filters' })).toBeInTheDocument();
    rerender(
      <DataTablePage rowCount={5}>
        <DataTablePage.FilterBar aria-label="filters">
          <input aria-label="search" />
        </DataTablePage.FilterBar>
      </DataTablePage>,
    );
    expect(screen.getByRole('region', { name: 'filters' })).toBeInTheDocument();
  });

  it('throws when a part is rendered outside DataTablePage', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<DataTablePage.Header title="orphan" />)).toThrow(
      /must be rendered inside <DataTablePage>/,
    );
    error.mockRestore();
  });
});
