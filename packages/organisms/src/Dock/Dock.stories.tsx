import type { Meta, StoryObj } from '@storybook/react';
import { useCallback, useState } from 'react';
import { Avatar, Badge, Button, Stack, Surface, SuggestionChip, Text } from '@touchstone/atoms';
import { Composer } from '@touchstone/molecules';
import { Dock } from './Dock.js';

const meta = {
  title: 'Organisms/Dock',
  component: Dock,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Non-modal panel that floats at the bottom of the viewport. Sibling of `Drawer` ' +
          '(modal, edge-anchored) and `Dialog` (modal, centered). The Dock does not trap ' +
          'focus, lock scroll, or render a backdrop — the user keeps working in the page ' +
          'above while it stays summoned. Best for transport bars, mini-players, logs, ' +
          'status footers, and AI chatboxes.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dock>;

export default meta;

type Story = StoryObj<typeof meta>;

interface LogRow {
  id: string;
  at: string;
  who: string;
  what: string;
}

const seedLog: LogRow[] = [
  { id: '1', at: '1m', who: 'forge', what: 'invoice cron green for 36 hours' },
  { id: '2', at: '3m', who: 'forge', what: 'rounding skew on currency conversion — fix opened' },
  { id: '3', at: '7m', who: 'apprentice', what: 'tagged atoms v0; two consumers already on it' },
  { id: '4', at: '12m', who: 'forge', what: 'apple flagged the entitlement — escalated' },
];

export const Logs: Story = {
  name: 'logs — standard chrome, full width',
  parameters: {
    docs: {
      description: {
        story:
          'The default shape — edge-to-edge, with a visible title row and dismiss affordance. ' +
          'Pair with `size="sm"` for a short status panel, `"lg"` for a full devtools-style console.',
      },
    },
  },
  render: () => {
    function Host() {
      const [open, setOpen] = useState(true);
      return (
        <div style={{ minHeight: '100vh', padding: '2rem' }}>
          <Stack gap="md">
            <Text size="xl" weight="semibold">
              the bench
            </Text>
            <Text tone="muted">
              the floating dock below holds today&apos;s log. it never gets in your way — click
              anywhere in the page, scroll freely, the dock stays put. press ⌘J to summon, or
              the X to dismiss.
            </Text>
            <Stack direction="row" gap="sm">
              <Button onClick={() => setOpen((v) => !v)}>
                {open ? 'hide log' : 'show log'}
              </Button>
            </Stack>
          </Stack>
          <Dock open={open} onOpenChange={setOpen}>
            <Dock.Content title="Activity log" size="sm">
              <Stack gap="xs">
                {seedLog.map((row) => (
                  <Stack key={row.id} direction="row" align="baseline" gap="sm">
                    <Text size="xs" tone="muted">
                      {row.at}
                    </Text>
                    <Text size="xs" weight="semibold">
                      {row.who}
                    </Text>
                    <Text size="xs">{row.what}</Text>
                  </Stack>
                ))}
              </Stack>
            </Dock.Content>
          </Dock>
        </div>
      );
    }
    return <Host />;
  },
};

export const ChatBox: Story = {
  name: 'AI chatbox — bare chrome, reading width',
  parameters: {
    docs: {
      description: {
        story:
          'Floating composer at the bottom of any page. `chrome="bare"` drops the title row, ' +
          '`width="reading"` centers a max-width column with rounded bottom corners and a small ' +
          'gutter from the viewport edge — the natural shape for an AI assistant available ' +
          'everywhere in the app. The title is still required for accessibility (forwarded to ' +
          '`aria-label` on the region).',
      },
    },
  },
  render: () => {
    function Host() {
      const [open, setOpen] = useState(true);
      const [exchanges, setExchanges] = useState<Array<{ q: string; a: string }>>([]);

      const ask = useCallback((value: string) => {
        const draft = value.trim();
        if (!draft) return;
        setExchanges((prev) => [
          ...prev,
          {
            q: draft,
            a: 'the workshop is mocked — the apprentice nods and gets back to the bench.',
          },
        ]);
      }, []);

      return (
        <div style={{ minHeight: '100vh', padding: '2rem' }}>
          <Stack gap="md">
            <Stack direction="row" align="center" gap="sm">
              <Avatar shape="square" size="sm" tone="accent">
                ◆
              </Avatar>
              <Text size="xl" weight="semibold">
                the workshop
              </Text>
              <Badge tone="accent">AI</Badge>
            </Stack>
            <Text tone="muted">
              ask the workshop anything. the chatbox floats at the bottom of every page — type a
              question and hit enter, or pick a starter below. the page above stays interactive.
            </Text>
            <Stack direction="row" gap="sm" wrap>
              <SuggestionChip onClick={() => ask('what is this app for?')}>
                what is this app for?
              </SuggestionChip>
              <SuggestionChip onClick={() => ask('show me my open tasks')}>
                show me my open tasks
              </SuggestionChip>
              <SuggestionChip onClick={() => ask('draft a release note')}>
                draft a release note
              </SuggestionChip>
            </Stack>
            <Stack gap="sm" style={{ marginBlockStart: '2rem', maxWidth: '40rem' }}>
              {exchanges.map((x, i) => (
                <Surface key={i} level="raised" padding="md" radius="md">
                  <Stack gap="xs">
                    <Text size="xs" tone="muted" weight="semibold">
                      you
                    </Text>
                    <Text size="sm">{x.q}</Text>
                    <Text size="xs" tone="muted" weight="semibold">
                      workshop
                    </Text>
                    <Text size="sm">{x.a}</Text>
                  </Stack>
                </Surface>
              ))}
            </Stack>
            <Stack direction="row" gap="sm">
              <Button intent="ghost" onClick={() => setOpen((v) => !v)}>
                {open ? 'tuck away' : 'summon chatbox'}
              </Button>
            </Stack>
          </Stack>
          <Dock open={open} onOpenChange={setOpen}>
            <Dock.Content title="Ask the workshop" chrome="bare" width="reading" size="sm">
              <Composer
                onSubmit={ask}
                placeholder="ask the workshop anything…"
                iconOnlySubmit
              />
            </Dock.Content>
          </Dock>
        </div>
      );
    }
    return <Host />;
  },
};

export const ReadingWithChrome: Story = {
  name: 'width=reading + standard chrome — centered console',
  parameters: {
    docs: {
      description: {
        story:
          'Mix the variants freely. A centered reading-width column with the standard title ' +
          'row is good for a centered notification or status surface that should feel like a ' +
          'self-contained card, not an edge-to-edge bar.',
      },
    },
  },
  render: () => (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <Text tone="muted">centered reading-width dock with the standard chrome.</Text>
      <Dock defaultOpen>
        <Dock.Content title="Today at the bench" width="reading" size="sm">
          <Stack gap="xs">
            <Text size="sm">8 strikes in flight, 1 blocked, 0 cooling.</Text>
            <Text size="xs" tone="muted">
              the apprentice is at the anvil. the ledger updates as the hammer falls.
            </Text>
          </Stack>
        </Dock.Content>
      </Dock>
    </div>
  ),
};
