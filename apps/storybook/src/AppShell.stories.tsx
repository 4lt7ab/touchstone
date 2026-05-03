import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, Badge, Button, Input, Stack, Surface, Text } from '@touchstone/atoms';
import { Disclosure, NavItem, NavSection, PageHeader } from '@touchstone/molecules';
import { AppBar, AppShell, Drawer, Sidebar } from '@touchstone/organisms';

function HammerGlyph(): React.JSX.Element {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="6" width="9" height="3" rx="0.5" />
      <path d="M12 7.5h4M16 4l-2 3.5L16 11" />
      <path d="M7.5 9 4 17" />
    </svg>
  );
}

function HingeGlyph(): React.JSX.Element {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="3" width="11" height="10" rx="1.5" />
      <path d="M2.5 7h11" />
    </svg>
  );
}

function ScrollGlyph(): React.JSX.Element {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5" />
      <path d="M3 3v8a2 2 0 0 0 2 2" />
      <path d="M6 6h5M6 9h5" />
    </svg>
  );
}

const meta = {
  title: 'Organisms/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The outer chrome of an application. Compose `AppBar` into `header`, ' +
          '`Sidebar` into `sidebar`, and your page content as children — the ' +
          'shell pins to the viewport, the main column owns the scroll, the ' +
          'sidebar header and footer stay put.\n\nThis is the zero-config ' +
          "starting point Touchstone's consumers without strong design " +
          'opinions can drop into a project and have a working app.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AppShell>;

export default meta;

type Story = StoryObj<typeof meta>;

interface Mark {
  who: string;
  monogram: string;
  tone: 'accent' | 'warning' | 'success' | 'neutral';
  label: 'open' | 'in-progress' | 'sealed' | 'shelved';
  title: string;
  body: string;
  when: string;
}

const todaysMarks: Mark[] = [
  {
    who: 'mei',
    monogram: 'me',
    tone: 'accent',
    label: 'open',
    title: 'a copper hinge for the lid',
    body: 'cut from sheet, ready for the bench. the apprentice asks after the rivet pattern.',
    when: 'this morning',
  },
  {
    who: 'tav',
    monogram: 'ta',
    tone: 'warning',
    label: 'in-progress',
    title: 'three nails of the smaller mould',
    body: 'two struck clean, the third bent. recasting after lunch.',
    when: 'an hour ago',
  },
  {
    who: 'rey',
    monogram: 're',
    tone: 'success',
    label: 'sealed',
    title: 'the dye-pot, refilled',
    body: 'the indigo measured by weight, not by eye. ledger updated.',
    when: 'two hours ago',
  },
];

const earlierMarks: Mark[] = [
  {
    who: 'kai',
    monogram: 'ka',
    tone: 'neutral',
    label: 'shelved',
    title: 'a new handle for the apprentice',
    body: 'the rosewood is on order. shelved until thursday.',
    when: 'two days past',
  },
  {
    who: 'mei',
    monogram: 'me',
    tone: 'success',
    label: 'sealed',
    title: 'the larger anvil, rebalanced',
    body: 'shimmed and tested with the long bar. holds.',
    when: 'three days past',
  },
];

function MarkRow({ mark }: { mark: Mark }): React.JSX.Element {
  return (
    <Surface level="raised" radius="lg" padding="md">
      <Stack direction="row" align="start" gap="md">
        <Avatar monogram={mark.monogram} aria-label={mark.who} />
        <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" align="center" justify="between" gap="sm">
            <Text weight="semibold">{mark.title}</Text>
            <Badge tone={mark.tone}>{mark.label}</Badge>
          </Stack>
          <Text size="sm" tone="muted">
            {mark.body}
          </Text>
          <Text size="xs" tone="muted">
            {mark.who} · {mark.when}
          </Text>
        </Stack>
      </Stack>
    </Surface>
  );
}

function benchLedgerDrawer(): React.JSX.Element {
  return (
    <Drawer>
      <Drawer.Content
        title="today's marks at the bench"
        description="the running ledger of strikes — ⌘` to summon, escape to dismiss."
        side="right"
        size="md"
      >
        <Stack gap="md">
          {todaysMarks.map((mark) => (
            <MarkRow key={mark.title} mark={mark} />
          ))}
          <Disclosure>
            <Disclosure.Trigger>earlier in the week</Disclosure.Trigger>
            <Disclosure.Content>
              <Stack gap="md" style={{ paddingBlockStart: '0.75rem' }}>
                {earlierMarks.map((mark) => (
                  <MarkRow key={mark.title} mark={mark} />
                ))}
              </Stack>
            </Disclosure.Content>
          </Disclosure>
        </Stack>
        <Drawer.Footer align="between">
          <Drawer.Close>
            <Button intent="ghost">mark all read</Button>
          </Drawer.Close>
          <Drawer.Close>
            <Button intent="primary">open all</Button>
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
}

function FullShell(): React.JSX.Element {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AppShell
      sidebarCollapsed={collapsed}
      onSidebarCollapsedChange={setCollapsed}
      drawerOpen={drawerOpen}
      onDrawerOpenChange={setDrawerOpen}
      drawer={benchLedgerDrawer()}
      header={
        <AppBar
          brand={
            <>
              <HammerGlyph />
              <span>the workshop</span>
            </>
          }
          actions={
            <>
              <Input placeholder="search the ledger" style={{ width: '20rem' }} />
              <Button
                intent="ghost"
                onClick={() => setCollapsed((v) => !v)}
                aria-label={collapsed ? 'expand sidebar' : 'collapse sidebar'}
                aria-pressed={collapsed}
              >
                {collapsed ? 'expand ⌘B' : 'collapse ⌘B'}
              </Button>
              <Button
                intent="ghost"
                onClick={() => setDrawerOpen((v) => !v)}
                aria-label={drawerOpen ? 'close ledger' : 'open ledger'}
                aria-pressed={drawerOpen}
              >
                ledger ⌘`
              </Button>
              <Button intent="primary">strike</Button>
            </>
          }
        />
      }
      sidebar={
        <Sidebar>
          <NavSection label="bench">
            <NavItem icon={<HingeGlyph />} selected>
              orders
            </NavItem>
            <NavItem icon={<HingeGlyph />} trailing={<Badge tone="neutral">7</Badge>}>
              moulds
            </NavItem>
            <NavItem icon={<HingeGlyph />}>recipes</NavItem>
          </NavSection>
          <NavSection label="ledger">
            <NavItem icon={<ScrollGlyph />} trailing={<Badge tone="warning">2</Badge>}>
              scrolls
            </NavItem>
            <NavItem icon={<ScrollGlyph />}>marks</NavItem>
          </NavSection>
        </Sidebar>
      }
    >
      <PageHeader
        title="orders for today"
        description="every strike of the day, in the order it was made. the master reads top to bottom; the apprentice strikes bottom to top. press ⌘B to fold the rail."
        meta={
          <>
            <Badge tone="accent">14 open</Badge>
            <Badge tone="success">7 sealed</Badge>
          </>
        }
        actions={
          <>
            <Button intent="ghost">filter</Button>
            <Button intent="primary">new entry</Button>
          </>
        }
        divider
      />

      <Stack gap="md">
        {[
          {
            title: 'a copper hinge for the lid',
            when: 'this morning',
            tone: 'accent' as const,
            label: 'open',
          },
          {
            title: 'three nails of the smaller mould',
            when: 'yesterday',
            tone: 'warning' as const,
            label: 'in-progress',
          },
          {
            title: 'the dye-pot, refilled',
            when: 'two days past',
            tone: 'success' as const,
            label: 'sealed',
          },
          {
            title: 'a new handle for the apprentice',
            when: 'a week past',
            tone: 'neutral' as const,
            label: 'shelved',
          },
        ].map((row) => (
          <Surface key={row.title} level="raised" radius="lg" padding="md">
            <Stack direction="row" align="center" justify="between" gap="md">
              <Stack gap="xs">
                <Text weight="semibold">{row.title}</Text>
                <Text size="sm" tone="muted">
                  {row.when}
                </Text>
              </Stack>
              <Badge tone={row.tone}>{row.label}</Badge>
            </Stack>
          </Surface>
        ))}
      </Stack>
    </AppShell>
  );
}

export const Full: Story = {
  name: 'full — every slot, every part (⌘B folds the rail)',
  render: () => <FullShell />,
};

export const NoSidebar: Story = {
  name: 'no sidebar — header + content only',
  render: () => (
    <AppShell
      header={
        <AppBar
          brand={
            <>
              <HammerGlyph />
              <span>the workshop</span>
            </>
          }
          actions={<Button intent="primary">strike</Button>}
        />
      }
    >
      <PageHeader
        title="welcome to the workshop"
        description="for pages that don't need a sidebar — single-flow forms, marketing pages, settings wizards."
        divider
      />
      <Surface level="raised" radius="lg" padding="lg">
        <Text>page body fills the column. the main region scrolls; the bar pins to the top.</Text>
      </Surface>
    </AppShell>
  ),
};

export const NoHeader: Story = {
  name: 'no header — sidebar-only chrome',
  render: () => (
    <AppShell
      sidebar={
        <Sidebar
          header={
            <Stack direction="row" align="center" gap="sm">
              <HammerGlyph />
              <Text weight="semibold">workshop</Text>
            </Stack>
          }
        >
          <NavSection label="bench">
            <NavItem icon={<HingeGlyph />} selected>
              orders
            </NavItem>
            <NavItem icon={<HingeGlyph />}>moulds</NavItem>
          </NavSection>
        </Sidebar>
      }
    >
      <PageHeader title="orders" description="for layouts where the sidebar carries the brand." />
      <Surface level="raised" radius="lg" padding="lg">
        <Text>
          some apps prefer the brand in the rail rather than at the top. drop the AppBar; the
          sidebar handles it.
        </Text>
      </Surface>
    </AppShell>
  ),
};
