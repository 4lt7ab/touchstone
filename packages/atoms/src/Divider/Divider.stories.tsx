import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider.js';
import { Surface } from '../Surface/Surface.js';
import { Text } from '../Text/Text.js';

const meta = {
  title: 'Atoms/Divider',
  component: Divider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <Surface
      level="raised"
      padding="md"
      radius="md"
      style={{ width: '24rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
    >
      <Text>the entry above the line.</Text>
      <Divider />
      <Text tone="muted">the marginalia, set apart by a hairline.</Text>
    </Surface>
  ),
};

export const Vertical: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <Surface
      level="raised"
      padding="md"
      radius="md"
      style={{
        height: '4rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      <Text>anvil</Text>
      <Divider orientation="vertical" />
      <Text>kiln</Text>
      <Divider orientation="vertical" />
      <Text>shelf</Text>
    </Surface>
  ),
};
