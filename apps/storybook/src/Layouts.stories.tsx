import type { Meta, StoryObj } from '@storybook/react';
import {
  Badge,
  Button,
  Divider,
  Grid,
  Input,
  Stack,
  Surface,
  Text,
} from '@touchstone/atoms';
import { Field } from '@touchstone/molecules';

const meta = {
  title: 'Compositions/Layouts',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Page-level layout recipes built from primitives. For full app ' +
          'shells (sidebar + header + main), reach for `AppShell` / `AppBar` / ' +
          '`Sidebar` under Organisms — those carry the focus, accessibility, ' +
          'and theming work. The recipes here cover the cases that *aren\'t* ' +
          'app shells: a centered card for auth, a master/detail split, a ' +
          'hero + body for marketing, a toolbar over a list, a card grid ' +
          'dashboard.\n\n' +
          'Copy the JSX into your own app, rename the parts, own the result. ' +
          'Every visual value flows through the theme contract, so the recipes ' +
          'follow whichever theme the consumer applies.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const CenteredCard: Story = {
  name: 'centered card — sign-in / onboarding',
  parameters: {
    docs: {
      description: {
        story:
          'A narrow card centered on a full-bleed page. `Surface` (page) flexes ' +
          'around a `Surface` (raised) sized by `maxWidth`. The standard ' +
          'starting point for auth, single-action confirmations, and welcome ' +
          'screens.',
      },
    },
  },
  render: () => (
    <Surface
      level="page"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <Surface
        level="raised"
        radius="lg"
        padding="lg"
        glow="soft"
        style={{ width: '100%', maxWidth: '24rem' }}
      >
        <Stack gap="lg">
          <Stack gap="xs">
            <Text size="xl" weight="bold" as="h1">
              return to the bench
            </Text>
            <Text tone="muted">
              your tools are warm where you left them.
            </Text>
          </Stack>

          <Stack gap="md" as="form">
            <Field label="name on the ledger" placeholder="apprentice" />
            <Field
              label="the word that opens the door"
              type="password"
              hint="the one only the master and you know."
            />
            <Button intent="primary">unlatch</Button>
          </Stack>

          <Divider decorative />

          <Stack direction="row" justify="between" align="center" gap="sm">
            <Text size="sm" tone="muted">
              first day at the workshop?
            </Text>
            <Button intent="ghost">apprentice</Button>
          </Stack>
        </Stack>
      </Surface>
    </Surface>
  ),
};

export const TwoColumn: Story = {
  name: 'two-column — master / detail',
  parameters: {
    docs: {
      description: {
        story:
          'A list on the left, a detail panel on the right. `Stack` row with ' +
          'two children whose widths come from `flex` on `style` — the recipe ' +
          'doesn\'t need a `width` prop.',
      },
    },
  },
  render: () => (
    <Surface
      level="page"
      style={{ minHeight: '100vh', padding: '1.5rem' }}
    >
      <Stack direction="row" gap="md" style={{ height: 'calc(100vh - 3rem)' }}>
        <Surface
          level="solid"
          radius="lg"
          padding="md"
          style={{ flex: '0 0 18rem', overflow: 'auto' }}
        >
          <Stack gap="sm">
            <Text size="sm" tone="muted" weight="medium">
              today's orders
            </Text>
            {[
              { name: 'a copper hinge for the lid', tone: 'accent' as const },
              { name: 'three nails of the smaller mould', tone: 'neutral' as const },
              { name: 'the dye-pot, refilled', tone: 'success' as const },
              { name: 'a new handle for the apprentice', tone: 'warning' as const },
            ].map((order) => (
              <Surface
                key={order.name}
                level="raised"
                radius="md"
                padding="sm"
                style={{ cursor: 'pointer' }}
              >
                <Stack direction="row" align="center" justify="between" gap="sm">
                  <Text size="sm">{order.name}</Text>
                  <Badge tone={order.tone}>open</Badge>
                </Stack>
              </Surface>
            ))}
          </Stack>
        </Surface>

        <Surface
          level="raised"
          radius="lg"
          padding="lg"
          style={{ flex: 1, overflow: 'auto' }}
        >
          <Stack gap="md">
            <Stack gap="xs">
              <Text size="xl" weight="bold" as="h2">
                a copper hinge for the lid
              </Text>
              <Stack direction="row" gap="sm" align="center">
                <Badge tone="accent">open</Badge>
                <Text size="sm" tone="muted">
                  ordered three days past
                </Text>
              </Stack>
            </Stack>
            <Divider decorative />
            <Text>
              the lid will not sit flush until the hinge is recast — the old one
              kept the door honest for a year and a half before the pin gave.
            </Text>
            <Stack direction="row" gap="sm">
              <Button intent="primary">strike</Button>
              <Button intent="secondary">set aside</Button>
            </Stack>
          </Stack>
        </Surface>
      </Stack>
    </Surface>
  ),
};

export const HeroBody: Story = {
  name: 'hero + body — marketing / docs',
  parameters: {
    docs: {
      description: {
        story:
          'A wide hero strip above a content column. `Stack` (column) with ' +
          'two children, the second constrained by `maxWidth` and centered ' +
          'with `margin: 0 auto` on `style`.',
      },
    },
  },
  render: () => (
    <Surface
      level="page"
      style={{ minHeight: '100vh' }}
    >
      <Surface level="solid" padding="lg" style={{ padding: '4rem 1.5rem' }}>
        <Stack
          gap="md"
          align="center"
          style={{ maxWidth: '40rem', margin: '0 auto', textAlign: 'center' }}
        >
          <Badge tone="accent">v0.0.1 — first ring on the anvil</Badge>
          <Text size="2xl" weight="bold" as="h1">
            the workshop opens its doors
          </Text>
          <Text tone="muted">
            an atomic-design kit for teams who want the rhythm of a well-kept
            bench without inheriting anyone else's app shell.
          </Text>
          <Stack direction="row" gap="sm">
            <Button intent="primary">install</Button>
            <Button intent="secondary">read the ledger</Button>
          </Stack>
        </Stack>
      </Surface>

      <Stack
        as="article"
        gap="lg"
        style={{
          maxWidth: '42rem',
          margin: '0 auto',
          padding: '3rem 1.5rem',
        }}
      >
        <Stack gap="sm">
          <Text size="xl" weight="semibold" as="h2">
            two primitives, six layouts
          </Text>
          <Text>
            the library ships `Surface` for the page and `Stack` for the
            arrangement. everything else — the shell, the centered card, the
            split, the grid — is a composition you copy and own.
          </Text>
        </Stack>
        <Stack gap="sm">
          <Text size="xl" weight="semibold" as="h2">
            the consumer keeps the chrome
          </Text>
          <Text>
            page envelopes are deliberately not in scope. the library renders
            inside your app, not around it; what your app looks like at its
            edges is your decision, not ours.
          </Text>
        </Stack>
      </Stack>
    </Surface>
  ),
};

export const Toolbar: Story = {
  name: 'toolbar + list — filters above content',
  parameters: {
    docs: {
      description: {
        story:
          'A toolbar of filters and actions above a vertical list of records. ' +
          '`Stack` (column) wraps a `Stack` (row) toolbar and a `Stack` (column) ' +
          'list. Wrap the toolbar so it folds gracefully on narrow viewports.',
      },
    },
  },
  render: () => (
    <Surface
      level="page"
      style={{ minHeight: '100vh', padding: '1.5rem' }}
    >
      <Stack gap="md">
        <Stack direction="row" align="center" justify="between" gap="md" wrap>
          <Stack gap="xs">
            <Text size="xl" weight="bold" as="h1">
              the ledger
            </Text>
            <Text size="sm" tone="muted">
              every strike, in the order it was made.
            </Text>
          </Stack>
          <Stack direction="row" gap="sm" wrap>
            <Input placeholder="find a mark" />
            <Button intent="ghost">filter</Button>
            <Button intent="primary">new entry</Button>
          </Stack>
        </Stack>

        <Surface level="solid" radius="lg" padding="none">
          <Stack gap="none">
            {[
              { mark: 'the copper hinge', when: 'this morning', tone: 'success' as const, label: 'sealed' },
              { mark: 'the third nail', when: 'yesterday', tone: 'warning' as const, label: 'in-progress' },
              { mark: 'the dye-pot refill', when: 'two days past', tone: 'success' as const, label: 'sealed' },
              { mark: 'the smaller mould', when: 'three days past', tone: 'danger' as const, label: 'unmade' },
              { mark: 'the apprentice\'s handle', when: 'a week past', tone: 'neutral' as const, label: 'shelved' },
            ].map((row, i, all) => (
              <div key={row.mark}>
                <Stack
                  direction="row"
                  align="center"
                  justify="between"
                  gap="md"
                  style={{ padding: '0.875rem 1rem' }}
                >
                  <Stack gap="xs">
                    <Text weight="medium">{row.mark}</Text>
                    <Text size="sm" tone="muted">
                      {row.when}
                    </Text>
                  </Stack>
                  <Badge tone={row.tone}>{row.label}</Badge>
                </Stack>
                {i < all.length - 1 ? <Divider decorative /> : null}
              </div>
            ))}
          </Stack>
        </Surface>
      </Stack>
    </Surface>
  ),
};

export const CardGrid: Story = {
  name: 'card grid — dashboard',
  parameters: {
    docs: {
      description: {
        story:
          '`Stack` is flex-only; reach for `Grid` when you need a real CSS-Grid ' +
          'layout. `columns={{ min: \'md\' }}` is auto-fit responsive — the cards ' +
          'reflow as the page narrows without a media query in sight.',
      },
    },
  },
  render: () => (
    <Surface
      level="page"
      style={{ minHeight: '100vh', padding: '1.5rem' }}
    >
      <Stack gap="lg">
        <Stack gap="xs">
          <Text size="2xl" weight="bold" as="h1">
            the dashboard
          </Text>
          <Text tone="muted">
            the master's first glance — every fire, every shelf, every drawer,
            in one held breath.
          </Text>
        </Stack>

        <Grid columns={{ min: 'md' }} gap="md">
          {[
            { title: 'orders open', value: '14', tone: 'accent' as const, note: 'three since dawn' },
            { title: 'sealed today', value: '7', tone: 'success' as const, note: 'on pace' },
            { title: 'in error', value: '1', tone: 'danger' as const, note: 'the smaller mould' },
            { title: 'on the shelf', value: '42', tone: 'neutral' as const, note: 'awaiting hand' },
            { title: 'apprentices at work', value: '3', tone: 'accent' as const, note: 'all benches lit' },
            { title: 'dye remaining', value: '68%', tone: 'warning' as const, note: 'order before the week\'s end' },
          ].map((card) => (
            <Surface
              key={card.title}
              level="raised"
              radius="lg"
              padding="lg"
            >
              <Stack gap="sm">
                <Stack direction="row" align="center" justify="between" gap="sm">
                  <Text size="sm" tone="muted" weight="medium">
                    {card.title}
                  </Text>
                  <Badge tone={card.tone}>now</Badge>
                </Stack>
                <Text size="2xl" weight="bold">
                  {card.value}
                </Text>
                <Text size="sm" tone="muted">
                  {card.note}
                </Text>
              </Stack>
            </Surface>
          ))}
        </Grid>
      </Stack>
    </Surface>
  ),
};
