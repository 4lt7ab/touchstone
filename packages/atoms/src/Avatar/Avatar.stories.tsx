import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar.js';
import { Stack } from '../Stack/Stack.js';
import { Surface } from '../Surface/Surface.js';
import { Text } from '../Text/Text.js';

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  args: {
    monogram: 'AL',
    size: 'md',
    shape: 'round',
    tone: 'solid',
  },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    shape: { control: { type: 'inline-radio' }, options: ['round', 'square'] },
    tone: {
      control: { type: 'inline-radio' },
      options: ['solid', 'muted', 'accent'],
    },
  },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <Stack direction="row" gap="md" align="center">
      <Avatar size="sm" monogram="AL" />
      <Avatar size="md" monogram="AL" />
      <Avatar size="lg" monogram="AL" />
    </Stack>
  ),
};

export const Shapes: Story = {
  render: () => (
    <Stack direction="row" gap="md" align="center">
      <Avatar shape="round" monogram="AL" />
      <Avatar shape="square" monogram="◆" />
    </Stack>
  ),
};

export const Tones: Story = {
  render: () => (
    <Stack direction="row" gap="md" align="center">
      <Avatar tone="solid" monogram="AL" />
      <Avatar tone="muted" monogram="AL" />
      <Avatar tone="accent" monogram="AL" />
    </Stack>
  ),
};

export const Labelled: Story = {
  args: {
    monogram: 'AL',
    'aria-label': 'Ada Lovelace',
  },
};

export const InContext: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Surface level="panel" padding="md" radius="md">
      <Stack direction="row" align="center" gap="sm">
        <Avatar size="md" monogram="AL" />
        <Stack direction="column" gap="none">
          <Text size="sm" weight="medium">
            Ada Lovelace
          </Text>
          <Text size="xs" tone="muted">
            Engineering lead
          </Text>
        </Stack>
      </Stack>
    </Surface>
  ),
};
