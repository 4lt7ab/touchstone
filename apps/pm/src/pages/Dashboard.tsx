import {
  Badge,
  Button,
  Container,
  Divider,
  Grid,
  ProgressBar,
  Stack,
  Surface,
  Text,
} from '@touchstone/atoms';
import { PageHeader } from '@touchstone/molecules';
import type { Route } from '../App.js';
import {
  activity,
  formatDate,
  formatRelative,
  personById,
  projectById,
  projects,
  statusLabel,
  statusTone,
  tasks,
} from '../data/mock.js';

interface DashboardProps {
  onNavigate: (route: Route) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const active = projects.filter((p) => p.status === 'active');
  const blocked = projects.filter((p) => p.status === 'blocked');
  const openTasks = tasks.filter((t) => t.status !== 'done');
  const dueSoon = tasks.filter((t) => {
    if (t.status === 'done') return false;
    const days =
      (new Date(t.dueDate).getTime() - new Date('2026-05-01T00:00:00Z').getTime()) / 86400000;
    return days >= 0 && days <= 14;
  });

  return (
    <Container width="wide" padding="lg">
      <Stack direction="column" gap="lg">
        <PageHeader
          title="Welcome back, Ada"
          description="A live view of what's moving and what's stuck."
          actions={
            <Button intent="primary" onClick={() => onNavigate({ name: 'projects' })}>
              View all projects
            </Button>
          }
          divider
        />

        <Grid columns={4} gap="md">
          <KpiCard label="Active projects" value={active.length} hint="in flight" />
          <KpiCard label="Blocked" value={blocked.length} hint="need attention" tone="danger" />
          <KpiCard label="Open tasks" value={openTasks.length} hint="across teams" />
          <KpiCard
            label="Due in 14 days"
            value={dueSoon.length}
            hint="watch this week"
            tone="warning"
          />
        </Grid>

        <Grid columns={{ min: 'lg' }} gap="lg">
          <Surface level="panel" padding="lg" radius="md">
            <Stack direction="column" gap="md">
              <Stack direction="row" justify="between" align="center">
                <Text size="lg" weight="semibold">
                  Active projects
                </Text>
                <Button intent="ghost" size="sm" onClick={() => onNavigate({ name: 'projects' })}>
                  See all
                </Button>
              </Stack>
              <Stack direction="column" gap="md">
                {[...active, ...blocked].map((p) => {
                  const owner = personById(p.ownerId);
                  return (
                    <Stack key={p.id} direction="column" gap="sm">
                      <Stack direction="row" justify="between" align="center">
                        <Stack direction="row" gap="sm" align="center">
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
                          <Badge tone={statusTone(p.status)}>{statusLabel(p.status)}</Badge>
                        </Stack>
                        <Text size="sm" tone="muted">
                          {owner?.name} · {formatDate(p.dueDate)}
                        </Text>
                      </Stack>
                      <Stack direction="row" gap="md" align="center">
                        <div style={{ flex: 1 }}>
                          <ProgressBar
                            value={p.progress}
                            tone={p.status === 'blocked' ? 'warning' : 'accent'}
                            aria-label={`${p.name} progress`}
                          />
                        </div>
                        <Text size="sm" tone="muted">
                          {p.doneCount}/{p.taskCount} tasks · {p.progress}%
                        </Text>
                      </Stack>
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </Surface>

          <Surface level="panel" padding="lg" radius="md">
            <Stack direction="column" gap="md">
              <Text size="lg" weight="semibold">
                Recent activity
              </Text>
              <Divider />
              <Stack direction="column" gap="md">
                {activity.slice(0, 6).map((a) => {
                  const author = personById(a.authorId);
                  const project = projectById(a.projectId);
                  return (
                    <Stack key={a.id} direction="column" gap="xs">
                      <Stack direction="row" gap="sm" align="center">
                        <Surface
                          level="muted"
                          radius="full"
                          style={{
                            width: 28,
                            height: 28,
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {author?.initials}
                        </Surface>
                        <Stack direction="column" gap="none">
                          <Text size="sm" weight="medium">
                            {author?.name}
                          </Text>
                          <Text size="xs" tone="muted">
                            {project?.name} · {formatRelative(a.timestamp)}
                          </Text>
                        </Stack>
                      </Stack>
                      <Text size="sm">{a.message}</Text>
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </Surface>
        </Grid>
      </Stack>
    </Container>
  );
}

interface KpiCardProps {
  label: string;
  value: number;
  hint?: string;
  tone?: 'default' | 'warning' | 'danger';
}

function KpiCard({ label, value, hint, tone = 'default' }: KpiCardProps) {
  const valueTone = tone === 'danger' ? 'danger' : tone === 'warning' ? 'accent' : 'default';
  return (
    <Surface level="panel" padding="md" radius="md">
      <Stack direction="column" gap="xs">
        <Text size="sm" tone="muted">
          {label}
        </Text>
        <Text size="2xl" weight="bold" tone={valueTone}>
          {value}
        </Text>
        {hint && (
          <Text size="xs" tone="muted">
            {hint}
          </Text>
        )}
      </Stack>
    </Surface>
  );
}
