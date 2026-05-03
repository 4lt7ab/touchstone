import type { Meta, StoryObj } from '@storybook/react';
import { Button, Stack, Surface, Text } from '@touchstone/atoms';
import { Field } from '@touchstone/molecules';
import { CenteredShell } from './CenteredShell.js';

const meta = {
  title: 'Organisms/CenteredShell',
  component: CenteredShell,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Centered-card outer chrome envelope. Replaces `AppShell` for ' +
          'auth, error, and standalone pages. The `Card` slot is the `<main>` ' +
          'landmark; drop a `Surface` inside it for visual treatment.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CenteredShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SignIn: Story = {
  name: 'sign in — brand + card + footer',
  render: () => (
    <CenteredShell>
      <CenteredShell.Brand>
        <Text size="lg" weight="bold">
          Touchstone
        </Text>
        <Text size="sm" tone="muted">
          a workshop you walk into
        </Text>
      </CenteredShell.Brand>
      <CenteredShell.Card aria-label="sign in">
        <Surface level="raised" radius="lg" padding="lg" glow="soft">
          <Stack gap="md">
            <Text size="xl" weight="semibold">
              welcome back
            </Text>
            <Field label="email" type="email" placeholder="apprentice@workshop.test" />
            <Field label="password" type="password" />
            <Button intent="primary">sign in</Button>
          </Stack>
        </Surface>
      </CenteredShell.Card>
      <CenteredShell.Footer>
        <Text size="sm" tone="muted">
          v1.2.3 · terms · privacy
        </Text>
      </CenteredShell.Footer>
    </CenteredShell>
  ),
};

export const NotFound: Story = {
  name: '404 — card only',
  render: () => (
    <CenteredShell>
      <CenteredShell.Card size="sm" aria-label="not found">
        <Surface level="raised" radius="lg" padding="lg">
          <Stack gap="md" align="center">
            <Text size="2xl" weight="bold">
              404
            </Text>
            <Text tone="muted">the door you tried doesn&apos;t open onto a chamber.</Text>
            <Button intent="ghost">return to the bench</Button>
          </Stack>
        </Surface>
      </CenteredShell.Card>
    </CenteredShell>
  ),
};

export const Wide: Story = {
  name: 'wide card — first-run setup',
  render: () => (
    <CenteredShell>
      <CenteredShell.Card size="lg" aria-label="setup">
        <Surface level="raised" radius="lg" padding="lg">
          <Stack gap="md">
            <Text size="xl" weight="semibold">
              first-run setup
            </Text>
            <Text tone="muted">
              every preset and lever, laid out before the first strike. take a moment to set the
              shop the way you want it before the apprentice picks up the hammer.
            </Text>
            <Button intent="primary">begin</Button>
          </Stack>
        </Surface>
      </CenteredShell.Card>
    </CenteredShell>
  ),
};
