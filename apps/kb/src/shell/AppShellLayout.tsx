import type { ReactNode } from 'react';
import { Avatar, Badge, Button, Stack, Surface, Text } from '@touchstone/atoms';
import { NavItem, NavSection } from '@touchstone/molecules';
import { AppBar, AppShell, Sidebar, ThemeSwitcher } from '@touchstone/organisms';
import { BookIcon, ClockIcon, SearchIcon, SparkleIcon } from '@touchstone/icons';
import type { Route, ThemeOption } from '../App.js';
import { CategoryIcon } from './icons.js';
import { categories } from '../data/mock.js';

interface AppShellLayoutProps {
  route: Route;
  onNavigate: (route: Route) => void;
  themeOptions: ThemeOption[];
  themeKey: string;
  onThemeChange: (key: string) => void;
  recentCount: number;
  children?: ReactNode;
}

export function AppShellLayout({
  route,
  onNavigate,
  themeOptions,
  themeKey,
  onThemeChange,
  recentCount,
  children,
}: AppShellLayoutProps) {
  return (
    <AppShell
      header={
        <AppBar
          sticky
          brand={
            <Stack direction="row" align="center" gap="sm">
              <Avatar shape="square" size="sm">
                ◈
              </Avatar>
              <Text weight="semibold" size="lg">
                Touchstone Knowledge
              </Text>
            </Stack>
          }
          actions={
            <Stack direction="row" align="center" gap="sm">
              <ThemeSwitcher options={themeOptions} value={themeKey} onChange={onThemeChange} />
              <Button intent="primary" size="sm" onClick={() => onNavigate({ name: 'search' })}>
                <SearchIcon />
                <span style={{ marginLeft: 8 }}>Search</span>
              </Button>
            </Stack>
          }
        />
      }
      sidebar={
        <Sidebar
          width="md"
          header={
            <Surface padding="sm" radius="md" level="muted">
              <Stack direction="column" gap="xs">
                <Stack direction="row" gap="sm" align="center">
                  <SparkleIcon />
                  <Text size="sm" weight="medium">
                    Semantic search
                  </Text>
                </Stack>
                <Text size="xs" tone="muted">
                  {'Try "billing", "lost 2fa", or "rate limit".'}
                </Text>
              </Stack>
            </Surface>
          }
          footer={
            <Text size="xs" tone="muted">
              Touchstone Knowledge v0.0.1 — demo
            </Text>
          }
        >
          <NavSection label="Workspace">
            <NavItem
              icon={<SearchIcon />}
              selected={route.name === 'search'}
              onClick={() => onNavigate({ name: 'search' })}
            >
              Search
            </NavItem>
            <NavItem
              icon={<BookIcon />}
              selected={route.name === 'browse' || route.name === 'category'}
              trailing={<Badge tone="neutral">{categories.length}</Badge>}
              onClick={() => onNavigate({ name: 'browse' })}
            >
              Browse
            </NavItem>
            <NavItem
              icon={<ClockIcon />}
              selected={route.name === 'recent'}
              trailing={recentCount > 0 ? <Badge tone="accent">{recentCount}</Badge> : undefined}
              onClick={() => onNavigate({ name: 'recent' })}
            >
              Recently viewed
            </NavItem>
          </NavSection>
          <NavSection label="Categories">
            {categories.map((c) => (
              <NavItem
                key={c.id}
                size="sm"
                icon={<CategoryIcon kind={c.icon} />}
                selected={route.name === 'category' && route.categoryId === c.id}
                onClick={() => onNavigate({ name: 'category', categoryId: c.id })}
              >
                {c.name}
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
