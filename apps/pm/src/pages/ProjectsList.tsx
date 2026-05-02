import { useMemo, useState } from 'react';
import { Badge, Button, Container, ProgressBar, Stack, Text } from '@touchstone/atoms';
import { EmptyState, Pagination, SegmentedControl, Table, toast } from '@touchstone/molecules';
import { DataTablePage } from '@touchstone/organisms';
import { useTableSort } from '@touchstone/hooks';
import type { Route } from '../App.js';
import {
  formatDate,
  personById,
  projects,
  statusLabel,
  statusTone,
  type Project,
  type ProjectStatus,
} from '../data/mock.js';

type StatusFilter = 'all' | ProjectStatus;
type SortKey = 'name' | 'owner' | 'dueDate' | 'progress';

const PAGE_SIZE = 5;

interface ProjectsListProps {
  onNavigate: (route: Route) => void;
}

export function ProjectsList({ onNavigate }: ProjectsListProps) {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const sort = useTableSort<SortKey>({
    defaultSort: { key: 'dueDate', direction: 'asc' },
  });

  const filtered = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter((p) => p.status === filter);
  }, [filter]);

  const sorted = useMemo(() => {
    if (!sort.sort) return filtered;
    const { key, direction } = sort.sort;
    const factor = direction === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = projectKey(a, key);
      const bv = projectKey(b, key);
      if (av < bv) return -1 * factor;
      if (av > bv) return 1 * factor;
      return 0;
    });
  }, [filtered, sort.sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <Container width="wide" padding="lg">
      <DataTablePage rowCount={sorted.length}>
        <DataTablePage.Header
          title="Projects"
          description="Everything in flight, planning, or recently shipped."
          actions={
            <Stack direction="row" gap="sm">
              <Button intent="secondary" onClick={() => toast({ title: 'Exported (mock)' })}>
                Export
              </Button>
              <Button
                intent="primary"
                onClick={() => toast({ title: 'Use the AppBar to create a project' })}
              >
                New project
              </Button>
            </Stack>
          }
          divider
        />
        <DataTablePage.FilterBar aria-label="Filter projects">
          <Stack direction="row" gap="md" align="center" wrap>
            <SegmentedControl
              aria-label="Status filter"
              value={filter}
              onValueChange={(v) => {
                setFilter(v);
                setPage(1);
              }}
              options={[
                { value: 'all', label: 'All' },
                { value: 'planning', label: 'Planning' },
                { value: 'active', label: 'Active' },
                { value: 'blocked', label: 'Blocked' },
                { value: 'done', label: 'Done' },
              ]}
            />
            <Text size="sm" tone="muted">
              {sorted.length} of {projects.length}
            </Text>
          </Stack>
        </DataTablePage.FilterBar>
        <DataTablePage.Table>
          <Table density="comfortable" striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell {...sort.getColumnProps('name')}>Project</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell {...sort.getColumnProps('owner')}>Owner</Table.HeaderCell>
                <Table.HeaderCell {...sort.getColumnProps('dueDate')}>Due</Table.HeaderCell>
                <Table.HeaderCell {...sort.getColumnProps('progress')}>Progress</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {visible.map((p) => {
                const owner = personById(p.ownerId);
                return (
                  <Table.Row key={p.id}>
                    <Table.Cell>
                      <button
                        type="button"
                        onClick={() => onNavigate({ name: 'project', projectId: p.id })}
                        style={{
                          all: 'unset',
                          cursor: 'pointer',
                          fontWeight: 500,
                          textDecoration: 'underline',
                          textUnderlineOffset: 3,
                        }}
                      >
                        {p.name}
                      </button>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge tone={statusTone(p.status)}>{statusLabel(p.status)}</Badge>
                    </Table.Cell>
                    <Table.Cell>{owner?.name ?? '—'}</Table.Cell>
                    <Table.Cell>{formatDate(p.dueDate)}</Table.Cell>
                    <Table.Cell>
                      <Stack direction="row" gap="sm" align="center">
                        <div style={{ flex: 1, minWidth: 120 }}>
                          <ProgressBar
                            size="sm"
                            value={p.progress}
                            tone={p.status === 'blocked' ? 'warning' : 'accent'}
                            aria-label={`${p.name} progress`}
                          />
                        </div>
                        <Text size="sm" tone="muted">
                          {p.progress}%
                        </Text>
                      </Stack>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </DataTablePage.Table>
        <DataTablePage.Pagination>
          <Stack direction="row" justify="between" align="center">
            <Text size="sm" tone="muted">
              Page {safePage} of {pageCount}
            </Text>
            <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />
          </Stack>
        </DataTablePage.Pagination>
        <DataTablePage.Empty>
          <EmptyState level="section">
            <EmptyState.Title>No projects match</EmptyState.Title>
            <EmptyState.Description>Try clearing the status filter.</EmptyState.Description>
            <EmptyState.Actions>
              <Button intent="secondary" onClick={() => setFilter('all')}>
                Show all
              </Button>
            </EmptyState.Actions>
          </EmptyState>
        </DataTablePage.Empty>
      </DataTablePage>
    </Container>
  );
}

function projectKey(p: Project, key: SortKey): string | number {
  switch (key) {
    case 'name':
      return p.name;
    case 'owner':
      return personById(p.ownerId)?.name ?? '';
    case 'dueDate':
      return p.dueDate;
    case 'progress':
      return p.progress;
  }
}
