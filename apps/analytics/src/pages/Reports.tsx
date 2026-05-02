import { useMemo, useState } from 'react';
import { Badge, Button, Container, Stack, Text } from '@touchstone/atoms';
import { EmptyState, Pagination, SegmentedControl, Table, toast } from '@touchstone/molecules';
import { DataTablePage } from '@touchstone/organisms';
import { Sparkline } from '@touchstone/charts';
import { useTableSelection, useTableSort } from '@touchstone/hooks';
import {
  formatDate,
  formatNumber,
  formatRelative,
  reportKindLabel,
  reportStatusTone,
  reports as allReports,
  statusLabel,
  type Report,
  type ReportKind,
} from '../data/mock.js';

type KindFilter = 'all' | ReportKind;
type SortKey = 'name' | 'kind' | 'owner' | 'views' | 'updatedAt';

const PAGE_SIZE = 8;

function reportTrend(report: Report): { label: string; value: number }[] {
  let h = 0;
  for (let i = 0; i < report.id.length; i++) {
    h = (h * 31 + report.id.charCodeAt(i)) >>> 0;
  }
  const out: { label: string; value: number }[] = [];
  const base = Math.max(8, report.views / 14);
  for (let i = 0; i < 14; i++) {
    const wave = Math.sin((i + (h % 13)) / 2.4) * 0.45;
    const drift = (i / 14) * 0.4;
    const noise = (((h + i * 17) % 31) / 31 - 0.5) * 0.25;
    out.push({
      label: `D${i + 1}`,
      value: Math.max(0, Math.round(base * (1 + wave + drift + noise))),
    });
  }
  return out;
}

function reportTrendTone(report: Report): 'success' | 'danger' | 'neutral' {
  const trend = reportTrend(report);
  const start = trend.slice(0, 5).reduce((a, d) => a + d.value, 0) / 5;
  const end = trend.slice(-5).reduce((a, d) => a + d.value, 0) / 5;
  if (start === 0) return 'neutral';
  const delta = (end - start) / start;
  if (delta > 0.05) return 'success';
  if (delta < -0.05) return 'danger';
  return 'neutral';
}

export function Reports() {
  const [filter, setFilter] = useState<KindFilter>('all');
  const [page, setPage] = useState(1);
  const sort = useTableSort<SortKey>({
    defaultSort: { key: 'updatedAt', direction: 'desc' },
  });

  const filtered = useMemo(() => {
    if (filter === 'all') return allReports;
    return allReports.filter((r) => r.kind === filter);
  }, [filter]);

  const sorted = useMemo(() => {
    if (!sort.sort) return filtered;
    const { key, direction } = sort.sort;
    const factor = direction === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = reportKey(a, key);
      const bv = reportKey(b, key);
      if (av < bv) return -1 * factor;
      if (av > bv) return 1 * factor;
      return 0;
    });
  }, [filtered, sort.sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const selection = useTableSelection<string>({
    rowIds: visible.map((r) => r.id),
  });

  return (
    <Container width="wide" padding="lg">
      <DataTablePage rowCount={sorted.length}>
        <DataTablePage.Header
          title="Reports"
          description="Saved dashboards, funnels, cohorts, and exports."
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
                    title: `Archived ${selection.selectedIds.length} report${selection.selectedIds.length === 1 ? '' : 's'} (mock)`,
                    tone: 'success',
                  });
                  selection.clear();
                }}
              >
                Archive
              </Button>
              <Button intent="primary" onClick={() => toast({ title: 'New report (mock)' })}>
                New report
              </Button>
            </Stack>
          }
          divider
        />
        <DataTablePage.FilterBar aria-label="Filter reports">
          <Stack direction="row" gap="md" align="center" wrap>
            <SegmentedControl
              aria-label="Kind filter"
              value={filter}
              onValueChange={(v) => {
                setFilter(v);
                setPage(1);
                selection.clear();
              }}
              options={[
                { value: 'all', label: 'All' },
                { value: 'dashboard', label: 'Dashboards' },
                { value: 'funnel', label: 'Funnels' },
                { value: 'cohort', label: 'Cohorts' },
                { value: 'export', label: 'Exports' },
              ]}
            />
            <Text size="sm" tone="muted">
              {sorted.length} of {allReports.length}
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
                <Table.HeaderCell {...sort.getColumnProps('name')}>Name</Table.HeaderCell>
                <Table.HeaderCell {...sort.getColumnProps('kind')}>Kind</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell {...sort.getColumnProps('owner')}>Owner</Table.HeaderCell>
                <Table.HeaderCell {...sort.getColumnProps('views')}>Views</Table.HeaderCell>
                <Table.HeaderCell>14d trend</Table.HeaderCell>
                <Table.HeaderCell {...sort.getColumnProps('updatedAt')}>Updated</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {visible.map((r) => {
                const isSelected = selection.isSelected(r.id);
                return (
                  <Table.Row key={r.id} selected={isSelected}>
                    <Table.SelectCell
                      checked={isSelected}
                      onCheckedChange={() => selection.toggle(r.id)}
                      aria-label={`Select ${r.name}`}
                    />
                    <Table.Cell>{r.name}</Table.Cell>
                    <Table.Cell>{reportKindLabel(r.kind)}</Table.Cell>
                    <Table.Cell>
                      <Badge tone={reportStatusTone(r.status)}>{statusLabel(r.status)}</Badge>
                    </Table.Cell>
                    <Table.Cell>{r.owner}</Table.Cell>
                    <Table.Cell>{formatNumber(r.views)}</Table.Cell>
                    <Table.Cell>
                      <div style={{ width: 88 }}>
                        <Sparkline
                          data={reportTrend(r)}
                          tone={reportTrendTone(r)}
                          aria-label={`${r.name} 14-day views trend`}
                          height={24}
                          showEndpoint={false}
                        />
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Stack direction="column" gap="none">
                        <Text size="sm">{formatDate(r.updatedAt)}</Text>
                        <Text size="xs" tone="muted">
                          {formatRelative(r.updatedAt)}
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
            <EmptyState.Title>No reports match</EmptyState.Title>
            <EmptyState.Description>Try a different kind filter.</EmptyState.Description>
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

function reportKey(r: Report, key: SortKey): string | number {
  switch (key) {
    case 'name':
      return r.name;
    case 'kind':
      return r.kind;
    case 'owner':
      return r.owner;
    case 'views':
      return r.views;
    case 'updatedAt':
      return r.updatedAt;
  }
}
