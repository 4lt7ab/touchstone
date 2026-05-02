import { useMemo, useState } from 'react';
import { Badge, Button, Container, Stack, Text } from '@touchstone/atoms';
import { EmptyState, Pagination, SegmentedControl, Table, toast } from '@touchstone/molecules';
import { DataTablePage } from '@touchstone/organisms';
import { useTableSelection, useTableSort } from '@touchstone/hooks';
import {
  formatDate,
  personById,
  priorityTone,
  projectById,
  statusLabel,
  statusTone,
  tasks as allTasks,
  type Task,
  type TaskStatus,
} from '../data/mock.js';

type StatusFilter = 'all' | TaskStatus;
type SortKey = 'title' | 'priority' | 'assignee' | 'dueDate' | 'project';

const PAGE_SIZE = 10;
const PRIORITY_RANK: Record<Task['priority'], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function TasksPage() {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const sort = useTableSort<SortKey>({
    defaultSort: { key: 'dueDate', direction: 'asc' },
  });

  const filtered = useMemo(
    () => (filter === 'all' ? allTasks : allTasks.filter((t) => t.status === filter)),
    [filter],
  );

  const sorted = useMemo(() => {
    if (!sort.sort) return filtered;
    const { key, direction } = sort.sort;
    const factor = direction === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = taskKey(a, key);
      const bv = taskKey(b, key);
      if (av < bv) return -1 * factor;
      if (av > bv) return 1 * factor;
      return 0;
    });
  }, [filtered, sort.sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const selection = useTableSelection<string>({
    rowIds: visible.map((t) => t.id),
  });

  return (
    <Container width="wide" padding="lg">
      <DataTablePage rowCount={sorted.length}>
        <DataTablePage.Header
          title="Tasks"
          description="Everything assigned, regardless of project."
          meta={
            selection.selectedIds.length > 0 ? (
              <Badge tone="accent">{selection.selectedIds.length} selected</Badge>
            ) : null
          }
          actions={
            <Stack direction="row" gap="sm">
              <Button
                intent="secondary"
                disabled={selection.selectedIds.length === 0}
                onClick={() => {
                  toast({
                    title: `Marked ${selection.selectedIds.length} done (mock)`,
                    tone: 'success',
                  });
                  selection.clear();
                }}
              >
                Mark done
              </Button>
              <Button intent="primary" onClick={() => toast({ title: 'New task (mock)' })}>
                New task
              </Button>
            </Stack>
          }
          divider
        />
        <DataTablePage.FilterBar aria-label="Filter tasks">
          <Stack direction="row" gap="md" align="center" wrap>
            <SegmentedControl
              aria-label="Status filter"
              value={filter}
              onValueChange={(v) => {
                setFilter(v);
                setPage(1);
                selection.clear();
              }}
              options={[
                { value: 'all', label: 'All' },
                { value: 'todo', label: 'To do' },
                { value: 'in-progress', label: 'In progress' },
                { value: 'blocked', label: 'Blocked' },
                { value: 'done', label: 'Done' },
              ]}
            />
            <Text size="sm" tone="muted">
              {sorted.length} of {allTasks.length}
            </Text>
          </Stack>
        </DataTablePage.FilterBar>
        <DataTablePage.Table>
          <Table density="comfortable" striped>
            <Table.Header>
              <Table.Row>
                <Table.SelectAllCell
                  checked={selection.allSelected}
                  indeterminate={selection.someSelected}
                  onCheckedChange={() => selection.toggleAll()}
                />
                <Table.HeaderCell {...sort.getColumnProps('title')}>Title</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell {...sort.getColumnProps('priority')}>Priority</Table.HeaderCell>
                <Table.HeaderCell {...sort.getColumnProps('project')}>Project</Table.HeaderCell>
                <Table.HeaderCell {...sort.getColumnProps('assignee')}>Assignee</Table.HeaderCell>
                <Table.HeaderCell {...sort.getColumnProps('dueDate')}>Due</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {visible.map((t) => {
                const assignee = personById(t.assigneeId);
                const project = projectById(t.projectId);
                const isSelected = selection.isSelected(t.id);
                return (
                  <Table.Row key={t.id} selected={isSelected}>
                    <Table.SelectCell
                      checked={isSelected}
                      onCheckedChange={() => selection.toggle(t.id)}
                      aria-label={`Select ${t.title}`}
                    />
                    <Table.Cell>{t.title}</Table.Cell>
                    <Table.Cell>
                      <Badge tone={statusTone(t.status)}>{statusLabel(t.status)}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge tone={priorityTone(t.priority)}>{t.priority}</Badge>
                    </Table.Cell>
                    <Table.Cell>{project?.name ?? '—'}</Table.Cell>
                    <Table.Cell>{assignee?.name ?? '—'}</Table.Cell>
                    <Table.Cell>{formatDate(t.dueDate)}</Table.Cell>
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
            <EmptyState.Title>No tasks match</EmptyState.Title>
            <EmptyState.Description>Try a different status filter.</EmptyState.Description>
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

function taskKey(t: Task, key: SortKey): string | number {
  switch (key) {
    case 'title':
      return t.title;
    case 'priority':
      return PRIORITY_RANK[t.priority];
    case 'assignee':
      return personById(t.assigneeId)?.name ?? '';
    case 'dueDate':
      return t.dueDate;
    case 'project':
      return projectById(t.projectId)?.name ?? '';
  }
}
