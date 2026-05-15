import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Input,
  Kbd,
  ProgressBar,
  Stack,
  Surface,
  Text,
  Textarea,
} from '@touchstone/atoms';
import {
  Composer,
  Field,
  NavItem,
  NavSection,
  SegmentedControl,
  toast,
  useNavLayout,
} from '@touchstone/molecules';
import {
  AppBar,
  AppShell,
  CommandPalette,
  Dialog,
  Dock,
  Sidebar,
  ThemeSwitcher,
} from '@touchstone/organisms';
import type { CommandPaletteCommand } from '@touchstone/organisms';
import {
  FolderIcon,
  HomeIcon,
  InboxIcon,
  ListIcon,
  PaletteIcon,
  PeopleIcon,
  PlusIcon,
  SearchIcon,
  SparkleIcon,
} from '@touchstone/icons';
import type { Route, ThemeOption } from '../App.js';
import {
  activity,
  activityForProject,
  formatDate,
  formatRelative,
  personById,
  projectById,
  projects,
  statusLabel,
  statusTone,
  tasks,
} from '../data/mock.js';

interface AppShellLayoutProps {
  route: Route;
  onNavigate: (route: Route) => void;
  themeOptions: ThemeOption[];
  themeKey: string;
  onThemeChange: (key: string) => void;
  children?: ReactNode;
}

export function AppShellLayout({
  route,
  onNavigate,
  themeOptions,
  themeKey,
  onThemeChange,
  children,
}: AppShellLayoutProps) {
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const activeProjects = projects.filter((p) => p.status === 'active' || p.status === 'blocked');

  const commands = useMemo<CommandPaletteCommand[]>(
    () => [
      {
        id: 'go-dashboard',
        label: 'Go to dashboard',
        group: 'Navigate',
        icon: <HomeIcon />,
        keywords: ['home', 'overview'],
        onSelect: () => onNavigate({ name: 'dashboard' }),
      },
      {
        id: 'go-projects',
        label: 'Go to projects',
        group: 'Navigate',
        icon: <FolderIcon />,
        onSelect: () => onNavigate({ name: 'projects' }),
      },
      {
        id: 'go-tasks',
        label: 'Go to tasks',
        group: 'Navigate',
        icon: <ListIcon />,
        onSelect: () => onNavigate({ name: 'tasks' }),
      },
      {
        id: 'go-team',
        label: 'Go to team',
        group: 'Navigate',
        icon: <PeopleIcon />,
        onSelect: () => onNavigate({ name: 'team' }),
      },
      ...projects.map<CommandPaletteCommand>((p) => ({
        id: `proj-${p.id}`,
        label: p.name,
        description: p.description,
        group: 'Jump to project',
        icon: <FolderIcon />,
        keywords: [p.status, statusLabel(p.status)],
        onSelect: () => onNavigate({ name: 'project', projectId: p.id }),
      })),
      {
        id: 'new-project',
        label: 'New project',
        description: 'Spin up a project with mocked defaults',
        group: 'Actions',
        icon: <PlusIcon />,
        shortcut: <Kbd size="sm">N</Kbd>,
        onSelect: () => setNewProjectOpen(true),
      },
      {
        id: 'toast-summary',
        label: 'Post the day’s summary',
        description: 'Demo the default Toaster the shell ships',
        group: 'Actions',
        icon: <SparkleIcon />,
        onSelect: () => {
          const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
          const blocked = tasks.filter((t) => t.status === 'blocked').length;
          toast({
            tone: 'info',
            title: 'Today at a glance',
            description: `${inProgress} in flight · ${blocked} blocked`,
          });
        },
      },
      ...themeOptions.map<CommandPaletteCommand>((t) => ({
        id: `theme-${t.key}`,
        label: `Switch to ${t.label}`,
        group: 'Theme',
        icon: <PaletteIcon />,
        keywords: ['theme', 'appearance', t.key],
        onSelect: () => onThemeChange(t.key),
      })),
    ],
    [onNavigate, onThemeChange, themeOptions],
  );

  return (
    <AppShell
      storageKey="touchstone-pm"
      sidebarResize
      inspectorResize
      mobileInspector="drawer"
      mobileInspectorTitle="Under the loupe"
      commandPaletteOpen={paletteOpen}
      onCommandPaletteOpenChange={setPaletteOpen}
      dock={<ActivityDock />}
      commandPalette={<CommandPalette commands={commands} />}
      inspector={<InspectorPanel route={route} onNavigate={onNavigate} />}
      header={
        <AppBar
          sticky
          brand={
            <Stack direction="row" align="center" gap="sm">
              <Avatar shape="square" size="sm">
                ◆
              </Avatar>
              <Text weight="semibold" size="lg">
                Touchstone PM
              </Text>
            </Stack>
          }
          actions={
            <Stack direction="row" align="center" gap="sm">
              <Button
                intent="ghost"
                size="sm"
                onClick={() => setPaletteOpen(true)}
                aria-label="Open command palette"
              >
                <SearchIcon />
                <span style={{ marginInline: 8 }}>Command</span>
                <Kbd size="sm">⌘K</Kbd>
              </Button>
              <ThemeSwitcher options={themeOptions} value={themeKey} onChange={onThemeChange} />
              <NewProjectDialog open={newProjectOpen} onOpenChange={setNewProjectOpen} />
            </Stack>
          }
        >
          <div
            style={{
              flex: 1,
              maxWidth: 480,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span aria-hidden style={{ display: 'inline-flex', opacity: 0.7 }}>
              <SearchIcon />
            </span>
            <div style={{ flex: 1 }}>
              <Input
                type="search"
                placeholder="Search projects, tasks, people"
                aria-label="Search"
              />
            </div>
          </div>
        </AppBar>
      }
      sidebar={
        <Sidebar
          width="md"
          header={<SidebarUserHeader />}
          footer={<SidebarFooter />}
        >
          <NavSection label="Workspace">
            <NavItem
              icon={<HomeIcon />}
              selected={route.name === 'dashboard'}
              onClick={() => onNavigate({ name: 'dashboard' })}
            >
              Dashboard
            </NavItem>
            <NavItem
              icon={<FolderIcon />}
              selected={route.name === 'projects' || route.name === 'project'}
              trailing={<Badge tone="neutral">{projects.length}</Badge>}
              onClick={() => onNavigate({ name: 'projects' })}
            >
              Projects
            </NavItem>
            <NavItem
              icon={<ListIcon />}
              selected={route.name === 'tasks'}
              onClick={() => onNavigate({ name: 'tasks' })}
            >
              Tasks
            </NavItem>
            <NavItem
              icon={<PeopleIcon />}
              selected={route.name === 'team'}
              onClick={() => onNavigate({ name: 'team' })}
            >
              Team
            </NavItem>
            <NavItem icon={<InboxIcon />} trailing={<Badge tone="accent">3</Badge>}>
              Inbox
            </NavItem>
          </NavSection>
          <NavSection label="Active projects">
            {activeProjects.map((p) => (
              <NavItem
                key={p.id}
                size="sm"
                selected={route.name === 'project' && route.projectId === p.id}
                trailing={p.status === 'blocked' ? <Badge tone="danger">!</Badge> : undefined}
                onClick={() => onNavigate({ name: 'project', projectId: p.id })}
              >
                {p.name}
              </NavItem>
            ))}
          </NavSection>
        </Sidebar>
      }
    >
      {children}
    </AppShell>
  );
}

function ActivityDock() {
  const handleAsk = (value: string) => {
    const draft = value.trim();
    if (!draft) return;
    toast({
      tone: 'info',
      title: 'The workshop nods',
      description: draft,
    });
  };
  return (
    <Dock>
      <Dock.Content
        title="Ask the workshop"
        chrome="bare"
        width="reading"
        size="sm"
      >
        <Composer
          onSubmit={handleAsk}
          placeholder="ask the workshop anything…"
          iconOnlySubmit
        />
      </Dock.Content>
    </Dock>
  );
}

function SidebarUserHeader() {
  const { collapsed } = useNavLayout();
  if (collapsed) {
    return (
      <Stack direction="row" justify="center">
        <Avatar size="md" monogram="AL" aria-label="Ada Lovelace" />
      </Stack>
    );
  }
  return (
    <Surface padding="sm" radius="md" level="muted">
      <Stack direction="row" align="center" gap="sm">
        <Avatar size="md" monogram="AL" />
        <Stack direction="column" gap="none">
          <Text size="sm" weight="medium">
            Ada Lovelace
          </Text>
          <Text size="xs" tone="muted">
            Engineering lead
          </Text>
        </Stack>
      </Stack>
    </Surface>
  );
}

function SidebarFooter() {
  const { collapsed } = useNavLayout();
  if (collapsed) return null;
  return (
    <Text size="xs" tone="muted">
      Touchstone v0.0.1 — demo
    </Text>
  );
}

interface InspectorPanelProps {
  route: Route;
  onNavigate: (route: Route) => void;
}

function InspectorPanel({ route, onNavigate }: InspectorPanelProps) {
  return (
    <Surface
      level="panel"
      padding="lg"
      style={{
        width: '100%',
        blockSize: '100%',
        overflowY: 'auto',
      }}
    >
      {route.name === 'project' ? (
        <ProjectInspector projectId={route.projectId} />
      ) : route.name === 'dashboard' ? (
        <DashboardInspector onNavigate={onNavigate} />
      ) : (
        <GlobalActivityInspector />
      )}
    </Surface>
  );
}

function InspectorEyebrow({ children }: { children: ReactNode }) {
  return (
    <span style={{ textTransform: 'uppercase' }}>
      <Text size="xs" tone="muted" weight="medium">
        {children}
      </Text>
    </span>
  );
}

function ProjectInspector({ projectId }: { projectId: string }) {
  const project = projectById(projectId);
  if (!project) {
    return (
      <Stack gap="sm">
        <InspectorEyebrow>Inspector</InspectorEyebrow>
        <Text size="sm" tone="muted">
          No project selected.
        </Text>
      </Stack>
    );
  }
  const owner = personById(project.ownerId);
  const recent = activityForProject(project.id).slice(0, 4);

  return (
    <Stack gap="lg">
      <Stack gap="sm">
        <InspectorEyebrow>Under the loupe</InspectorEyebrow>
        <Text weight="semibold" size="lg">
          {project.name}
        </Text>
        <Stack direction="row" align="center" gap="sm">
          <Badge tone={statusTone(project.status)}>{statusLabel(project.status)}</Badge>
          <Text size="xs" tone="muted">
            due {formatDate(project.dueDate)}
          </Text>
        </Stack>
      </Stack>

      <Stack gap="sm">
        <ProgressBar value={project.progress} aria-label={`${project.progress}% complete`} />
        <Text size="xs" tone="muted">
          {project.progress}% — {project.doneCount} of {project.taskCount} tasks done
        </Text>
      </Stack>

      <Stack gap="sm">
        <InspectorEyebrow>Lead</InspectorEyebrow>
        {owner ? (
          <Stack direction="row" align="center" gap="sm">
            <Avatar size="sm" monogram={owner.initials} />
            <Stack gap="none">
              <Text size="sm" weight="medium">
                {owner.name}
              </Text>
              <Text size="xs" tone="muted">
                {owner.role}
              </Text>
            </Stack>
          </Stack>
        ) : (
          <Text size="sm" tone="muted">
            Unassigned
          </Text>
        )}
      </Stack>

      <Stack gap="sm">
        <InspectorEyebrow>Brief</InspectorEyebrow>
        <Text size="sm">{project.description}</Text>
      </Stack>

      <Stack gap="sm">
        <InspectorEyebrow>Recent activity</InspectorEyebrow>
        {recent.length === 0 ? (
          <Text size="sm" tone="muted">
            Nothing posted yet.
          </Text>
        ) : (
          recent.map((entry) => {
            const author = personById(entry.authorId);
            return (
              <Surface key={entry.id} level="raised" padding="md" radius="md">
                <Stack gap="xs">
                  <Stack direction="row" align="center" gap="sm">
                    <Text size="xs" weight="semibold">
                      {author?.name ?? 'someone'}
                    </Text>
                    <Text size="xs" tone="muted">
                      {formatRelative(entry.timestamp)}
                    </Text>
                  </Stack>
                  <Text size="sm">{entry.message}</Text>
                </Stack>
              </Surface>
            );
          })
        )}
      </Stack>
    </Stack>
  );
}

function DashboardInspector({ onNavigate }: { onNavigate: (route: Route) => void }) {
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const blocked = tasks.filter((t) => t.status === 'blocked').length;
  const today = tasks
    .filter((t) => t.status !== 'done')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  return (
    <Stack gap="lg">
      <Stack gap="sm">
        <InspectorEyebrow>Today</InspectorEyebrow>
        <Stack direction="row" gap="sm">
          <Surface level="raised" padding="md" radius="md" style={{ flex: 1 }}>
            <Stack gap="none">
              <Text size="xl" weight="semibold">
                {inProgress}
              </Text>
              <Text size="xs" tone="muted">
                in flight
              </Text>
            </Stack>
          </Surface>
          <Surface level="raised" padding="md" radius="md" style={{ flex: 1 }}>
            <Stack gap="none">
              <Text size="xl" weight="semibold" tone={blocked > 0 ? 'danger' : 'default'}>
                {blocked}
              </Text>
              <Text size="xs" tone="muted">
                blocked
              </Text>
            </Stack>
          </Surface>
        </Stack>
      </Stack>

      <Stack gap="sm">
        <InspectorEyebrow>Next up</InspectorEyebrow>
        {today.map((task) => {
          const project = projectById(task.projectId);
          return (
            <Surface
              key={task.id}
              level="raised"
              padding="md"
              radius="md"
              style={{ cursor: project ? 'pointer' : 'default' }}
              onClick={() =>
                project ? onNavigate({ name: 'project', projectId: project.id }) : undefined
              }
            >
              <Stack gap="xs">
                <Text size="sm" weight="medium">
                  {task.title}
                </Text>
                <Stack direction="row" align="center" gap="sm">
                  <Badge tone={statusTone(task.status)}>{statusLabel(task.status)}</Badge>
                  <Text size="xs" tone="muted">
                    {project?.name ?? 'unassigned'} · due {formatDate(task.dueDate)}
                  </Text>
                </Stack>
              </Stack>
            </Surface>
          );
        })}
      </Stack>
    </Stack>
  );
}

function GlobalActivityInspector() {
  const recent = activity.slice(0, 6);
  return (
    <Stack gap="lg">
      <Stack gap="sm">
        <InspectorEyebrow>Recent activity</InspectorEyebrow>
        <Text size="xs" tone="muted">
          Across all projects. ⌘I folds this panel.
        </Text>
      </Stack>
      <Stack gap="sm">
        {recent.map((entry) => {
          const author = personById(entry.authorId);
          const project = projectById(entry.projectId);
          return (
            <Surface key={entry.id} level="raised" padding="md" radius="md">
              <Stack gap="xs">
                <Stack direction="row" align="center" gap="sm">
                  <Text size="xs" weight="semibold">
                    {author?.name ?? 'someone'}
                  </Text>
                  <Text size="xs" tone="muted">
                    {project?.name ?? ''} · {formatRelative(entry.timestamp)}
                  </Text>
                </Stack>
                <Text size="sm">{entry.message}</Text>
              </Stack>
            </Surface>
          );
        })}
      </Stack>
    </Stack>
  );
}

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function NewProjectDialog({ open, onOpenChange }: NewProjectDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'planning' | 'active'>('planning');

  const submit = () => {
    if (!name.trim()) {
      toast({ tone: 'warning', title: 'Name required' });
      return;
    }
    toast({
      tone: 'success',
      title: 'Project created',
      description: `${name} — ${status}`,
    });
    setName('');
    setDescription('');
    setStatus('planning');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger>
        <Button intent="primary" size="sm">
          <PlusIcon />
          <span style={{ marginLeft: 8 }}>New project</span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content title="New project" description="Spin up a project with mocked defaults.">
        <Stack direction="column" gap="md">
          <Field label="Name" hint="A short, memorable handle">
            <Input
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              placeholder="e.g. Mint billing rewrite"
            />
          </Field>
          <Field label="Description" hint="One or two sentences">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              rows={3}
              placeholder="What's this project about?"
            />
          </Field>
          <Field label="Initial status">
            <SegmentedControl
              aria-label="Initial status"
              value={status}
              onValueChange={(v) => setStatus(v)}
              options={[
                { value: 'planning', label: 'Planning' },
                { value: 'active', label: 'Active' },
              ]}
            />
          </Field>
          <Stack direction="row" justify="end" gap="sm">
            <Dialog.Close>
              <Button intent="ghost">Cancel</Button>
            </Dialog.Close>
            <Button intent="primary" onClick={submit}>
              Create project
            </Button>
          </Stack>
        </Stack>
      </Dialog.Content>
    </Dialog>
  );
}
