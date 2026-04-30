import type { Meta, StoryObj } from '@storybook/react';
import { Box, Button, Input, Text } from '@touchstone/atoms';

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
    <Box
      as="section"
      padding="lg"
      surface="base"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <Box>
        <Text size="2xl" weight="bold">
          Theme gallery
        </Text>
        <Text tone="muted">
          Switch the theme via the toolbar. Watch the glowing card pulse on
          rhythmic themes (synthwave, terminal).
        </Text>
      </Box>

      <Box style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Button intent="primary">Primary</Button>
        <Button intent="secondary">Secondary</Button>
        <Button intent="ghost">Ghost</Button>
        <Button intent="danger">Delete</Button>
      </Box>

      <Box style={{ maxWidth: '24rem' }}>
        <Input placeholder="Type something" />
      </Box>

      <Box
        glow="pulse"
        surface="raised"
        radius="lg"
        padding="lg"
        style={{ maxWidth: '32rem' }}
      >
        <Text size="lg" weight="semibold">
          Border-glow surface
        </Text>
        <Text tone="muted">
          On synthwave the glow breathes pink at 80 BPM with a sine ease. On
          terminal it flickers green at 140 BPM with a square wave. On light /
          dark the glow stays at zero — the same recipe, different theme
          rhythm.
        </Text>
      </Box>
    </Box>
  ),
};
