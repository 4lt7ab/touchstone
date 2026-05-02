import {
  Badge,
  Button,
  Container,
  Divider,
  ProgressBar,
  Stack,
  Surface,
  Text,
} from '@touchstone/atoms';
import { AlertBanner, Breadcrumbs, EmptyState, Table, toast } from '@touchstone/molecules';
import { DetailPage, Menu, Tabs } from '@touchstone/organisms';
import type { Route } from '../App.js';
import {
  activityForProject,
  formatDate,
  formatRelative,
  personById,
  projectById,
  statusLabel,
  statusTone,
  priorityTone,
  tasksForProject,
} from '../data/mock.js';

interface ProjectDetailProps {
  projectId: string;
  onNavigate: (route: Route) => void;
}

export function ProjectDetail({ projectId, onNavigate }: ProjectDetailProps) {
  const project = projectById(projectId);

  if (!project) {
    return (
      <Container width="wide" padding="lg">
        <EmptyState level="page">
          <EmptyState.Title>Project not found</EmptyState.Title>
          <EmptyState.Description>
            {
              "The project you were looking for doesn't exist (it might be mocked out of this fixture)."
            }
          </EmptyState.Description>
          <EmptyState.Actions>
            <Button onClick={() => onNavigate({ name: 'projects' })}>Back to projects</Button>
          </EmptyState.Actions>
        </EmptyState>
      </Container>
    );
  }

  const owner = personById(project.ownerId);
  const projectTasks = tasksForProject(projectId);
  const projectActivity = activityForProject(projectId);
  const open = projectTasks.filter((t) => t.status !== 'done');

  return (
    <Container width="wide" padding="lg">
      <Stack direction="column" gap="md">
        <Breadcrumbs>
          <Breadcrumbs.Item asChild>
            <button
              type="button"
              onClick={() => onNavigate({ name: 'dashboard' })}
              style={{ all: 'unset', cursor: 'pointer' }}
            >
              Dashboard
            </button>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item asChild>
            <button
              type="button"
              onClick={() => onNavigate({ name: 'projects' })}
              style={{ all: 'unset', cursor: 'pointer' }}
            >
              Projects
            </button>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item current>{project.name}</Breadcrumbs.Item>
        </Breadcrumbs>

        {project.status === 'blocked' && (
          <AlertBanner tone="danger" title="This project is blocked">
            One or more tasks need attention to unblock the rollout.
          </AlertBanner>
        )}

        <DetailPage>
          <DetailPage.Header title={project.name} subtitle={project.description} />
          <DetailPage.Actions>
            <Stack direction="row" gap="sm">
              <Menu>
                <Menu.Trigger>
                  <Button intent="ghost">More</Button>
                </Menu.Trigger>
                <Menu.Content side="bottom" align="end">
                  <Menu.Item onSelect={() => toast({ title: 'Duplicated (mock)' })}>
                    Duplicate
                  </Menu.Item>
                  <Menu.Item onSelect={() => toast({ title: 'Archived (mock)' })}>
                    Archive
                  </Menu.Item>
                  <Menu.Separator />
                  <Menu.Item
                    tone="danger"
                    onSelect={() => toast({ tone: 'danger', title: 'Deleted (mock)' })}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Content>
              </Menu>
              <Button intent="primary" onClick={() => toast({ tone: 'success', title: 'Saved' })}>
                Save
              </Button>
            </Stack>
          </DetailPage.Actions>

          <DetailPage.Meta>
            <DetailPage.MetaItem label="Status">
              <Badge tone={statusTone(project.status)}>{statusLabel(project.status)}</Badge>
            </DetailPage.MetaItem>
            <DetailPage.MetaItem label="Owner">{owner?.name ?? '—'}</DetailPage.MetaItem>
            <DetailPage.MetaItem label="Due">{formatDate(project.dueDate)}</DetailPage.MetaItem>
            <DetailPage.MetaItem label="Progress">{project.progress}%</DetailPage.MetaItem>
          </DetailPage.Meta>

          <DetailPage.Body>
            <Tabs defaultValue="overview">
              <Tabs.List aria-label="Project sections">
                <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                <Tabs.Trigger value="tasks">Tasks · {projectTasks.length}</Tabs.Trigger>
                <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
              </Tabs.List>
              <div style={{ paddingTop: 24 }}>
                <Tabs.Panel value="overview">
                  <Stack direction="column" gap="lg">
                    <Surface level="panel" padding="lg" radius="md">
                      <Stack direction="column" gap="md">
                        <Text size="lg" weight="semibold">
                          Progress
                        </Text>
                        <ProgressBar
                          value={project.progress}
                          tone={project.status === 'blocked' ? 'warning' : 'accent'}
                          aria-label="Overall progress"
                        />
                        <Text size="sm" tone="muted">
                          {project.doneCount} of {project.taskCount} tasks complete · {open.length}{' '}
                          open
                        </Text>
                      </Stack>
                    </Surface>
                    <Surface level="panel" padding="lg" radius="md">
                      <Stack direction="column" gap="sm">
                        <Text size="lg" weight="semibold">
                          About
                        </Text>
                        <Divider />
                        <Text>{project.description}</Text>
                      </Stack>
                    </Surface>
                  </Stack>
                </Tabs.Panel>
                <Tabs.Panel value="tasks">
                  {projectTasks.length === 0 ? (
                    <EmptyState level="section">
                      <EmptyState.Title>No tasks yet</EmptyState.Title>
                      <EmptyState.Description>
                        Add a task to break this project down.
                      </EmptyState.Description>
                    </EmptyState>
                  ) : (
                    <Table density="comfortable">
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>Task</Table.HeaderCell>
                          <Table.HeaderCell>Status</Table.HeaderCell>
                          <Table.HeaderCell>Priority</Table.HeaderCell>
                          <Table.HeaderCell>Assignee</Table.HeaderCell>
                          <Table.HeaderCell>Due</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {projectTasks.map((t) => {
                          const assignee = personById(t.assigneeId);
                          return (
                            <Table.Row key={t.id}>
                              <Table.Cell>{t.title}</Table.Cell>
                              <Table.Cell>
                                <Badge tone={statusTone(t.status)}>{statusLabel(t.status)}</Badge>
                              </Table.Cell>
                              <Table.Cell>
                                <Badge tone={priorityTone(t.priority)}>{t.priority}</Badge>
                              </Table.Cell>
                              <Table.Cell>{assignee?.name ?? '—'}</Table.Cell>
                              <Table.Cell>{formatDate(t.dueDate)}</Table.Cell>
                            </Table.Row>
                          );
                        })}
                      </Table.Body>
                    </Table>
                  )}
                </Tabs.Panel>
                <Tabs.Panel value="activity">
                  {projectActivity.length === 0 ? (
                    <EmptyState level="section">
                      <EmptyState.Title>No activity yet</EmptyState.Title>
                    </EmptyState>
                  ) : (
                    <Stack direction="column" gap="md">
                      {projectActivity.map((a) => {
                        const author = personById(a.authorId);
                        return (
                          <Surface key={a.id} level="panel" padding="md" radius="md">
                            <Stack direction="column" gap="sm">
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
                                <Text size="sm" weight="medium">
                                  {author?.name}
                                </Text>
                                <Text size="xs" tone="muted">
                                  {formatRelative(a.timestamp)}
                                </Text>
                              </Stack>
                              <Text>{a.message}</Text>
                            </Stack>
                          </Surface>
                        );
                      })}
                    </Stack>
                  )}
                </Tabs.Panel>
              </div>
            </Tabs>
          </DetailPage.Body>

          <DetailPage.RightPanel aria-label="Project details">
            <Stack direction="column" gap="md">
              <Surface level="panel" padding="md" radius="md">
                <Stack direction="column" gap="sm">
                  <Text size="sm" weight="semibold" tone="muted">
                    Owner
                  </Text>
                  <Stack direction="row" gap="sm" align="center">
                    <Surface
                      level="muted"
                      radius="full"
                      style={{
                        width: 32,
                        height: 32,
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {owner?.initials}
                    </Surface>
                    <Stack direction="column" gap="none">
                      <Text size="sm" weight="medium">
                        {owner?.name}
                      </Text>
                      <Text size="xs" tone="muted">
                        {owner?.role}
                      </Text>
                    </Stack>
                  </Stack>
                </Stack>
              </Surface>
              <Surface level="panel" padding="md" radius="md">
                <Stack direction="column" gap="sm">
                  <Text size="sm" weight="semibold" tone="muted">
                    Timeline
                  </Text>
                  <Stack direction="row" justify="between">
                    <Text size="sm" tone="muted">
                      Due
                    </Text>
                    <Text size="sm">{formatDate(project.dueDate)}</Text>
                  </Stack>
                  <Stack direction="row" justify="between">
                    <Text size="sm" tone="muted">
                      Tasks done
                    </Text>
                    <Text size="sm">
                      {project.doneCount} / {project.taskCount}
                    </Text>
                  </Stack>
                  <Stack direction="row" justify="between">
                    <Text size="sm" tone="muted">
                      Open
                    </Text>
                    <Text size="sm">{open.length}</Text>
                  </Stack>
                </Stack>
              </Surface>
            </Stack>
          </DetailPage.RightPanel>
        </DetailPage>
      </Stack>
    </Container>
  );
}
