import type { Meta, StoryObj } from '@storybook/react';
import { Button, Stack, Surface, Text } from '@touchstone/atoms';
import { Toaster, toast } from './Toast.js';

const meta = {
  title: 'Molecules/Toast',
  component: Toaster,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The transient feedback surface. Mount one `<Toaster />` near the ' +
          'app root; call `toast({ tone, title, description })` from anywhere. ' +
          'The viewport is anchored to one of four corners and renders the ' +
          'queue into a portal at `vars.zIndex.toast`. Each toast carries ' +
          '`role="status"` for `info` / `success` and `role="alert"` for ' +
          '`warning` / `danger`. Hover or focus pauses the dismiss timer; ' +
          'Escape dismisses the newest toast.\n\nFor permanent in-page ' +
          'messaging, reach for `AlertBanner`. For modal interruptions, reach ' +
          'for `Dialog`.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Surface level="page" style={{ minHeight: '60vh', padding: '2rem' }}>
        <Story />
      </Surface>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  name: 'four tones — info, success, warning, danger',
  render: () => (
    <Stack gap="md">
      <Text>
        each tone reads from the matching `vars.color.*Bg` / foreground pair — so the Toaster
        follows whichever theme the consumer applies.
      </Text>
      <Stack direction="row" gap="sm" wrap>
        <Button
          intent="ghost"
          onClick={() =>
            toast({
              tone: 'info',
              title: 'a quiet word',
              description: 'the kiln will be ready in ten minutes.',
            })
          }
        >
          info
        </Button>
        <Button
          intent="ghost"
          onClick={() =>
            toast({
              tone: 'success',
              title: 'sealed',
              description: 'the entry is in the ledger.',
            })
          }
        >
          success
        </Button>
        <Button
          intent="ghost"
          onClick={() =>
            toast({
              tone: 'warning',
              title: 'cool the metal first',
              description: 'the strike will warp without a rest.',
            })
          }
        >
          warning
        </Button>
        <Button
          intent="ghost"
          onClick={() =>
            toast({
              tone: 'danger',
              title: 'unmade',
              description: 'the row was rolled back.',
            })
          }
        >
          danger
        </Button>
      </Stack>
      <Toaster />
    </Stack>
  ),
};

export const WithAction: Story = {
  name: 'with action — undo affordance',
  render: () => (
    <Stack gap="md">
      <Text>
        {
          'a toast with a follow-up action — the canonical "undo" pattern. The action button fires its handler and dismisses the toast.'
        }
      </Text>
      <Button
        intent="primary"
        onClick={() =>
          toast({
            tone: 'success',
            title: 'sealed',
            description: 'the order is on the bench.',
            action: {
              label: 'undo',
              onClick: () => toast({ title: 'unsealed', tone: 'info' }),
            },
          })
        }
      >
        seal the order
      </Button>
      <Toaster />
    </Stack>
  ),
};

export const Sticky: Story = {
  name: 'sticky — duration: Infinity',
  render: () => (
    <Stack gap="md">
      <Text>
        {
          "a toast with `duration: Infinity` requires manual dismissal — useful for interruptive errors that need the user's attention."
        }
      </Text>
      <Button
        intent="primary"
        onClick={() =>
          toast({
            tone: 'danger',
            title: 'the seal was rejected',
            description: "the master's mark did not match. find them, or wait for the next pour.",
            duration: Infinity,
          })
        }
      >
        trigger sticky toast
      </Button>
      <Toaster />
    </Stack>
  ),
};

export const Stacked: Story = {
  name: 'stacked — max=4 visible, rest queue',
  render: () => (
    <Stack gap="md">
      <Text>
        firing many toasts in quick succession — only `max` are visible at once; the rest queue
        behind. Dismissing a visible one slides the next in.
      </Text>
      <Button
        intent="primary"
        onClick={() => {
          for (let i = 1; i <= 6; i++) {
            toast({
              tone: i % 2 === 0 ? 'success' : 'info',
              title: `entry ${i}`,
              description: 'sealed by the master.',
              duration: 8000,
            });
          }
        }}
      >
        fire six
      </Button>
      <Toaster max={4} />
    </Stack>
  ),
};

export const TopLeft: Story = {
  name: 'placement — top-left',
  render: () => (
    <Stack gap="md">
      <Text>placement controls which corner the stack anchors to.</Text>
      <Button
        intent="primary"
        onClick={() =>
          toast({ title: 'top-left', description: 'anchored to the top-left corner.' })
        }
      >
        toast at top-left
      </Button>
      <Toaster placement="top-left" />
    </Stack>
  ),
};
