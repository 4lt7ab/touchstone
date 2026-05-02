import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Button, Input, Surface } from '@touchstone/atoms';
import { EmptyState, Pagination, Table } from '@touchstone/molecules';
import { DataTablePage } from './DataTablePage.js';

function InboxGlyph(): React.JSX.Element {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 22h8l2 4h8l2-4h8" />
      <path d="M6 22V10a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v12" />
      <path d="M6 22v6a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2v-6" />
    </svg>
  );
}

const ALL_ROWS = [
  { id: 'INV-001', client: 'Acme Corp', amount: '$4,200', status: 'paid' as const },
  { id: 'INV-002', client: 'Bench Co', amount: '$1,200', status: 'open' as const },
  { id: 'INV-003', client: 'Forge Co', amount: '$2,800', status: 'open' as const },
  { id: 'INV-004', client: 'Anvil Inc', amount: '$960', status: 'paid' as const },
  { id: 'INV-005', client: 'Mould LLC', amount: '$3,400', status: 'overdue' as const },
];

const meta = {
  title: 'Organisms/DataTablePage',
  component: DataTablePage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'List / CRUD page envelope. `rowCount` drives the empty branch — ' +
          'when zero, `Table` and `Pagination` hide and `Empty` renders.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Surface level="page" style={{ minHeight: '100vh', padding: '2rem' }}>
        <Story />
      </Surface>
    ),
  ],
} satisfies Meta<typeof DataTablePage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Populated: Story = {
  render: () => {
    function Host() {
      const [page, setPage] = useState(1);
      return (
        <DataTablePage rowCount={ALL_ROWS.length}>
          <DataTablePage.Header
            title="Invoices"
            description="every strike of the day, sealed and shelved."
            actions={
              <>
                <Button intent="ghost">export</Button>
                <Button intent="primary">new invoice</Button>
              </>
            }
            divider
          />
          <DataTablePage.FilterBar aria-label="filters">
            <Input placeholder="search the ledger" style={{ width: '20rem' }} />
            <Button intent="ghost">status</Button>
            <Button intent="ghost">date</Button>
          </DataTablePage.FilterBar>
          <DataTablePage.Table>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>id</Table.HeaderCell>
                  <Table.HeaderCell>client</Table.HeaderCell>
                  <Table.HeaderCell>amount</Table.HeaderCell>
                  <Table.HeaderCell>status</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {ALL_ROWS.map((row) => (
                  <Table.Row key={row.id}>
                    <Table.Cell>{row.id}</Table.Cell>
                    <Table.Cell>{row.client}</Table.Cell>
                    <Table.Cell>{row.amount}</Table.Cell>
                    <Table.Cell>
                      <Badge
                        tone={
                          row.status === 'paid'
                            ? 'success'
                            : row.status === 'overdue'
                              ? 'danger'
                              : 'warning'
                        }
                      >
                        {row.status}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </DataTablePage.Table>
          <DataTablePage.Pagination>
            <Pagination page={page} pageCount={5} onPageChange={setPage} />
          </DataTablePage.Pagination>
          <DataTablePage.Empty>
            <EmptyState>
              <EmptyState.Icon>
                <InboxGlyph />
              </EmptyState.Icon>
              <EmptyState.Title>no invoices yet</EmptyState.Title>
              <EmptyState.Description>
                strike the first; the rest will follow it.
              </EmptyState.Description>
              <EmptyState.Actions>
                <Button intent="primary">new invoice</Button>
              </EmptyState.Actions>
            </EmptyState>
          </DataTablePage.Empty>
        </DataTablePage>
      );
    }
    return <Host />;
  },
};

export const Empty: Story = {
  name: 'empty — rowCount = 0',
  render: () => (
    <DataTablePage rowCount={0}>
      <DataTablePage.Header
        title="Invoices"
        description="every strike of the day, sealed and shelved."
        actions={<Button intent="primary">new invoice</Button>}
        divider
      />
      <DataTablePage.FilterBar aria-label="filters">
        <Input placeholder="search the ledger" style={{ width: '20rem' }} />
      </DataTablePage.FilterBar>
      <DataTablePage.Table>
        <Surface>table would render here</Surface>
      </DataTablePage.Table>
      <DataTablePage.Empty>
        <EmptyState>
          <EmptyState.Icon>
            <InboxGlyph />
          </EmptyState.Icon>
          <EmptyState.Title>no invoices yet</EmptyState.Title>
          <EmptyState.Description>
            strike the first; the rest will follow it.
          </EmptyState.Description>
          <EmptyState.Actions>
            <Button intent="primary">new invoice</Button>
          </EmptyState.Actions>
        </EmptyState>
      </DataTablePage.Empty>
    </DataTablePage>
  ),
};
