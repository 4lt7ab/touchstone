import type { Meta, StoryObj } from '@storybook/react';
import { useMemo } from 'react';
import { Stack, Surface, Text } from '@touchstone/atoms';
import { useTableSelection, useTableSort } from '@touchstone/hooks';
import { Table } from './Table.js';

const meta = {
  title: 'Molecules/Table',
  component: Table,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

interface LedgerRow {
  item: string;
  forged: number;
  status: 'on shelf' | 'in chamber' | 'on order';
  price: string;
}

const ledger: LedgerRow[] = [
  { item: 'Anvil, four-pound', forged: 12, status: 'on shelf', price: '$42.00' },
  { item: 'Tongs, flat-jaw', forged: 24, status: 'on shelf', price: '$18.50' },
  { item: 'Hammer, peen', forged: 8, status: 'in chamber', price: '$26.00' },
  { item: 'Quench bucket', forged: 4, status: 'on shelf', price: '$12.75' },
  { item: 'Crucible, small', forged: 6, status: 'on order', price: '$58.00' },
];

const totalForged = ledger.reduce((sum, r) => sum + r.forged, 0);
const totalPrice = '$157.25';

const Header = () => (
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>item</Table.HeaderCell>
      <Table.HeaderCell align="numeric">forged</Table.HeaderCell>
      <Table.HeaderCell>status</Table.HeaderCell>
      <Table.HeaderCell align="numeric">price</Table.HeaderCell>
    </Table.Row>
  </Table.Header>
);

const Rows = () =>
  ledger.map((row) => (
    <Table.Row key={row.item}>
      <Table.Cell>{row.item}</Table.Cell>
      <Table.Cell align="numeric">{row.forged}</Table.Cell>
      <Table.Cell>{row.status}</Table.Cell>
      <Table.Cell align="numeric">{row.price}</Table.Cell>
    </Table.Row>
  ));

export const Default: Story = {
  render: () => (
    <Surface level="raised" radius="md" style={{ width: '36rem' }}>
      <Table>
        <Header />
        <Table.Body>
          <Rows />
        </Table.Body>
      </Table>
    </Surface>
  ),
};

export const Compact: Story = {
  render: () => (
    <Surface level="raised" radius="md" style={{ width: '36rem' }}>
      <Table density="compact">
        <Header />
        <Table.Body>
          <Rows />
        </Table.Body>
      </Table>
    </Surface>
  ),
};

export const Striped: Story = {
  render: () => (
    <Surface level="raised" radius="md" style={{ width: '36rem' }}>
      <Table striped>
        <Header />
        <Table.Body>
          <Rows />
        </Table.Body>
      </Table>
    </Surface>
  ),
};

export const SelectedRow: Story = {
  render: () => (
    <Surface level="raised" radius="md" style={{ width: '36rem' }}>
      <Table>
        <Header />
        <Table.Body>
          {ledger.map((row) => (
            <Table.Row key={row.item} selected={row.item === 'Hammer, peen'}>
              <Table.Cell>{row.item}</Table.Cell>
              <Table.Cell align="numeric">{row.forged}</Table.Cell>
              <Table.Cell>{row.status}</Table.Cell>
              <Table.Cell align="numeric">{row.price}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Surface>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Surface level="raised" radius="md" style={{ width: '36rem' }}>
      <Table>
        <Header />
        <Table.Body>
          <Rows />
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell>total on the ledger</Table.Cell>
            <Table.Cell align="numeric">{totalForged}</Table.Cell>
            <Table.Cell />
            <Table.Cell align="numeric">{totalPrice}</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </Surface>
  ),
};

export const Sortable: Story = {
  render: () => {
    const Demo = () => {
      const sort = useTableSort<keyof LedgerRow>({
        defaultSort: { key: 'forged', direction: 'desc' },
      });
      const sorted = useMemo(() => {
        if (!sort.sort) return ledger;
        const { key, direction } = sort.sort;
        const sign = direction === 'asc' ? 1 : -1;
        return [...ledger].sort((a, b) => {
          const av = a[key];
          const bv = b[key];
          if (typeof av === 'number' && typeof bv === 'number') {
            return (av - bv) * sign;
          }
          return String(av).localeCompare(String(bv)) * sign;
        });
      }, [sort.sort]);

      return (
        <Stack gap={3}>
          <Text tone="muted" size="sm">
            sorted by {sort.sort ? `${String(sort.sort.key)} ${sort.sort.direction}` : 'nothing'}
          </Text>
          <Surface level="raised" radius="md" style={{ width: '36rem' }}>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell {...sort.getColumnProps('item')}>item</Table.HeaderCell>
                  <Table.HeaderCell {...sort.getColumnProps('forged')} align="numeric">
                    forged
                  </Table.HeaderCell>
                  <Table.HeaderCell {...sort.getColumnProps('status')}>status</Table.HeaderCell>
                  <Table.HeaderCell {...sort.getColumnProps('price')} align="numeric">
                    price
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sorted.map((row) => (
                  <Table.Row key={row.item}>
                    <Table.Cell>{row.item}</Table.Cell>
                    <Table.Cell align="numeric">{row.forged}</Table.Cell>
                    <Table.Cell>{row.status}</Table.Cell>
                    <Table.Cell align="numeric">{row.price}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Surface>
        </Stack>
      );
    };
    return <Demo />;
  },
};

export const Selectable: Story = {
  render: () => {
    const Demo = () => {
      const rowIds = ledger.map((r) => r.item);
      const sel = useTableSelection<string>({ rowIds });
      return (
        <Stack gap={3}>
          <Text tone="muted" size="sm">
            {sel.selectedIds.length === 0
              ? 'no rows selected'
              : `${sel.selectedIds.length} of ${rowIds.length} selected`}
          </Text>
          <Surface level="raised" radius="md" style={{ width: '36rem' }}>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.SelectAllCell
                    checked={sel.allSelected}
                    indeterminate={sel.someSelected}
                    onCheckedChange={sel.toggleAll}
                  />
                  <Table.HeaderCell>item</Table.HeaderCell>
                  <Table.HeaderCell align="numeric">forged</Table.HeaderCell>
                  <Table.HeaderCell>status</Table.HeaderCell>
                  <Table.HeaderCell align="numeric">price</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {ledger.map((row) => (
                  <Table.Row key={row.item} selected={sel.isSelected(row.item)}>
                    <Table.SelectCell
                      checked={sel.isSelected(row.item)}
                      onCheckedChange={() => sel.toggle(row.item)}
                      aria-label={`select ${row.item}`}
                    />
                    <Table.Cell>{row.item}</Table.Cell>
                    <Table.Cell align="numeric">{row.forged}</Table.Cell>
                    <Table.Cell>{row.status}</Table.Cell>
                    <Table.Cell align="numeric">{row.price}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Surface>
        </Stack>
      );
    };
    return <Demo />;
  },
};

export const StickyHeader: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Surface
      level="page"
      padding="lg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Surface
        level="raised"
        radius="md"
        style={{
          width: '36rem',
          height: '20rem',
          overflow: 'auto',
        }}
      >
        <Table stickyHeader>
          <Header />
          <Table.Body>
            {Array.from({ length: 6 }, (_, cycle) =>
              ledger.map((row) => (
                <Table.Row key={`${cycle}-${row.item}`}>
                  <Table.Cell>{row.item}</Table.Cell>
                  <Table.Cell align="numeric">{row.forged}</Table.Cell>
                  <Table.Cell>{row.status}</Table.Cell>
                  <Table.Cell align="numeric">{row.price}</Table.Cell>
                </Table.Row>
              )),
            )}
          </Table.Body>
        </Table>
      </Surface>
    </Surface>
  ),
};
