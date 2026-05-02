import type { Meta, StoryObj } from '@storybook/react';
import { Button, Input, Surface, Text } from '@touchstone/atoms';

const meta = {
  title: 'Themes/Gallery',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Showcase: Story = {
  render: () => (
    <Surface
      as="section"
      padding="lg"
      level="base"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <Surface>
        <Text size="2xl" weight="bold" as="h1">
          the dye-cabinet
        </Text>
        <Text tone="muted">
          each drawer holds a different fire. choose the one whose pulse keeps your tools warm.
        </Text>
      </Surface>

      <Surface style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Button intent="primary">strike</Button>
        <Button intent="secondary">set aside</Button>
        <Button intent="ghost">linger</Button>
        <Button intent="danger">unmake</Button>
      </Surface>

      <Surface style={{ maxWidth: '24rem' }}>
        <Input placeholder="what would the apprentice carry to your bench?" />
      </Surface>

      <Surface glow="pulse" level="raised" radius="lg" padding="lg" style={{ maxWidth: '32rem' }}>
        <Text size="lg" weight="semibold" as="h2">
          the breathing rim
        </Text>
        <Text tone="muted">
          on synthwave the rim breathes pink in long sines. on terminal it flickers green in
          squares. on the still themes the rim sleeps. one recipe, four heartbeats.
        </Text>
      </Surface>
    </Surface>
  ),
};
