import type { ReactNode } from 'react';
import { useState } from 'react';
import { Avatar, Badge, Button, Input, Stack, Surface, Text, Textarea } from '@touchstone/atoms';
import { Field, NavItem, NavSection, SegmentedControl, toast } from '@touchstone/molecules';
import { AppBar, AppShell, Dialog, Sidebar, ThemeSwitcher } from '@touchstone/organisms';
import {
  FolderIcon,
  HomeIcon,
  InboxIcon,
  ListIcon,
  PeopleIcon,
  PlusIcon,
  SearchIcon,
} from '@touchstone/icons';
import type { Route, ThemeOption } from '../App.js';
import { projects } from '../data/mock.js';

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
  const activeProjects = projects.filter((p) => p.status === 'active' || p.status === 'blocked');

  return (
    <AppShell
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
              <ThemeSwitcher options={themeOptions} value={themeKey} onChange={onThemeChange} />
              <NewProjectDialog />
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
          header={
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
          }
          footer={
            <Text size="xs" tone="muted">
              Touchstone v0.0.1 — demo
            </Text>
          }
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

function NewProjectDialog() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'planning' | 'active'>('planning');
  const [open, setOpen] = useState(false);

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
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
