import type { ReactNode } from 'react';
import { Avatar, Badge, Button, Input, Stack, Surface, Text } from '@touchstone/atoms';
import { NavItem, NavSection } from '@touchstone/molecules';
import { AppBar, AppShell, Sidebar, ThemeSwitcher } from '@touchstone/organisms';
import {
  AudienceIcon,
  CalendarIcon,
  FunnelIcon,
  ReportIcon,
  SearchIcon,
  ShareIcon,
  TrendIcon,
} from '@touchstone/icons';
import type { Route, ThemeOption } from '../App.js';
import { audiences, funnels, reports } from '../data/mock.js';

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
  const liveReports = reports.filter((r) => r.status === 'live');

  return (
    <AppShell
      header={
        <AppBar
          sticky
          brand={
            <Stack direction="row" align="center" gap="sm">
              <Avatar shape="square" size="sm">
                ▴
              </Avatar>
              <Text weight="semibold" size="lg">
                Touchstone Analytics
              </Text>
            </Stack>
          }
          actions={
            <Stack direction="row" align="center" gap="sm">
              <Button intent="ghost" size="sm">
                <CalendarIcon />
                <span style={{ marginLeft: 8 }}>Last 90 days</span>
              </Button>
              <ThemeSwitcher options={themeOptions} value={themeKey} onChange={onThemeChange} />
              <Button intent="primary" size="sm">
                <ShareIcon />
                <span style={{ marginLeft: 8 }}>Share</span>
              </Button>
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
                placeholder="Search reports, metrics, audiences"
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
                    Acme · production
                  </Text>
                  <Text size="xs" tone="muted">
                    14d retention · UTC
                  </Text>
                </Stack>
              </Stack>
            </Surface>
          }
          footer={
            <Text size="xs" tone="muted">
              Touchstone Analytics v0.0.1 — demo
            </Text>
          }
        >
          <NavSection label="Workspace">
            <NavItem
              icon={<TrendIcon />}
              selected={route.name === 'overview'}
              onClick={() => onNavigate({ name: 'overview' })}
            >
              Overview
            </NavItem>
            <NavItem
              icon={<ReportIcon />}
              selected={route.name === 'reports'}
              trailing={<Badge tone="neutral">{reports.length}</Badge>}
              onClick={() => onNavigate({ name: 'reports' })}
            >
              Reports
            </NavItem>
            <NavItem
              icon={<FunnelIcon />}
              selected={route.name === 'funnels'}
              trailing={<Badge tone="neutral">{funnels.length}</Badge>}
              onClick={() => onNavigate({ name: 'funnels' })}
            >
              Funnels
            </NavItem>
            <NavItem
              icon={<AudienceIcon />}
              selected={route.name === 'audiences'}
              trailing={<Badge tone="neutral">{audiences.length}</Badge>}
              onClick={() => onNavigate({ name: 'audiences' })}
            >
              Audiences
            </NavItem>
          </NavSection>
          <NavSection label="Live reports">
            {liveReports.slice(0, 6).map((r) => (
              <NavItem key={r.id} size="sm" onClick={() => onNavigate({ name: 'reports' })}>
                {r.name}
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
