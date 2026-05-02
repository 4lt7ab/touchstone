import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table } from './Table.js';

function renderBasicTable(props: Partial<React.ComponentProps<typeof Table>> = {}) {
  return render(
    <Table {...props}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Item</Table.HeaderCell>
          <Table.HeaderCell align="numeric">Price</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Anvil</Table.Cell>
          <Table.Cell align="numeric">$42</Table.Cell>
        </Table.Row>
        <Table.Row selected>
          <Table.Cell>Hammer</Table.Cell>
          <Table.Cell align="numeric">$26</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>,
  );
}

describe('Table', () => {
  it('renders the native table elements', () => {
    const { container } = renderBasicTable();
    expect(container.querySelector('table')).not.toBeNull();
    expect(container.querySelector('thead')).not.toBeNull();
    expect(container.querySelector('tbody')).not.toBeNull();
    expect(container.querySelectorAll('tr')).toHaveLength(3);
    expect(container.querySelectorAll('th')).toHaveLength(2);
    expect(container.querySelectorAll('td')).toHaveLength(4);
  });

  it('puts scope="col" on header cells by default', () => {
    renderBasicTable();
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(2);
    headers.forEach((th) => {
      expect(th).toHaveAttribute('scope', 'col');
    });
  });

  it('respects an explicit scope override', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.HeaderCell scope="row">Anvil</Table.HeaderCell>
            <Table.Cell>$42</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(screen.getByRole('rowheader')).toHaveAttribute('scope', 'row');
  });

  it('marks selected rows with data and aria attributes', () => {
    renderBasicTable();
    const rows = screen.getAllByRole('row');
    const selectedRow = rows.find((r) => r.getAttribute('data-selected') === 'true');
    expect(selectedRow).toBeDefined();
    expect(selectedRow).toHaveAttribute('aria-selected', 'true');
  });

  it('reflects density, striped, and stickyHeader on the root', () => {
    const { container } = renderBasicTable({
      density: 'compact',
      striped: true,
      stickyHeader: true,
    });
    const table = container.querySelector('table')!;
    expect(table).toHaveAttribute('data-density', 'compact');
    expect(table).toHaveAttribute('data-striped', 'true');
    expect(table).toHaveAttribute('data-sticky-header', 'true');
  });

  it('defaults density to comfortable and the toggles to false', () => {
    const { container } = renderBasicTable();
    const table = container.querySelector('table')!;
    expect(table).toHaveAttribute('data-density', 'comfortable');
    expect(table).toHaveAttribute('data-striped', 'false');
    expect(table).toHaveAttribute('data-sticky-header', 'false');
  });

  it('passes colSpan and rowSpan through on cells and header cells', () => {
    render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={2}>Pair</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell rowSpan={2}>Span</Table.Cell>
            <Table.Cell>One</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute('colspan', '2');
    expect(screen.getByText('Span')).toHaveAttribute('rowspan', '2');
  });

  it('renders a Footer section when provided', () => {
    const { container } = render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>row</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell>total</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table>,
    );
    expect(container.querySelector('tfoot')).not.toBeNull();
    expect(screen.getByText('total')).toBeInTheDocument();
  });

  it('exposes the dot-namespaced subcomponents on the root', () => {
    expect(Table.Header).toBeDefined();
    expect(Table.Body).toBeDefined();
    expect(Table.Footer).toBeDefined();
    expect(Table.Row).toBeDefined();
    expect(Table.HeaderCell).toBeDefined();
    expect(Table.Cell).toBeDefined();
    expect(Table.SelectCell).toBeDefined();
    expect(Table.SelectAllCell).toBeDefined();
  });
});

describe('Table.HeaderCell sortable', () => {
  it('non-sortable header has no aria-sort and no button', () => {
    render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>plain</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>x</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    const th = screen.getByRole('columnheader');
    expect(th).not.toHaveAttribute('aria-sort');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('sortable header reflects sortDirection through aria-sort', () => {
    const { rerender } = render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell sortable sortDirection={null}>
              forged
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>x</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'none');

    rerender(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell sortable sortDirection="asc">
              forged
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>x</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'ascending');

    rerender(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell sortable sortDirection="desc">
              forged
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>x</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'descending');
  });

  it('clicking the sort button cycles asc → desc → null', async () => {
    const onSortChange = vi.fn();
    function Harness({ direction }: { direction: 'asc' | 'desc' | null }) {
      return (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell sortable sortDirection={direction} onSortChange={onSortChange}>
                forged
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>x</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );
    }

    const { rerender } = render(<Harness direction={null} />);
    await userEvent.click(screen.getByRole('button', { name: /forged/ }));
    expect(onSortChange).toHaveBeenLastCalledWith('asc');

    rerender(<Harness direction="asc" />);
    await userEvent.click(screen.getByRole('button', { name: /forged/ }));
    expect(onSortChange).toHaveBeenLastCalledWith('desc');

    rerender(<Harness direction="desc" />);
    await userEvent.click(screen.getByRole('button', { name: /forged/ }));
    expect(onSortChange).toHaveBeenLastCalledWith(null);
  });
});

describe('Table.SelectCell / Table.SelectAllCell', () => {
  it('SelectCell renders a checkbox in a <td> and reflects checked state', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row selected>
            <Table.SelectCell checked aria-label="select Anvil" />
            <Table.Cell>Anvil</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'select Anvil' });
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    expect(checkbox.closest('td')).not.toBeNull();
  });

  it('SelectCell click fires onCheckedChange', async () => {
    const onCheckedChange = vi.fn();
    render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.SelectCell
              checked={false}
              onCheckedChange={onCheckedChange}
              aria-label="select Anvil"
            />
            <Table.Cell>Anvil</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    await userEvent.click(screen.getByRole('checkbox', { name: 'select Anvil' }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('SelectAllCell renders in a <th> and exposes indeterminate via aria-checked="mixed"', () => {
    render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.SelectAllCell indeterminate />
            <Table.HeaderCell>Item</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>x</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Select all rows' });
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    expect(checkbox.closest('th')).not.toBeNull();
  });
});
