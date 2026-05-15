import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '../Stack/Stack.js';
import { Surface } from '../Surface/Surface.js';
import { Text } from '../Text/Text.js';
import { TypingIndicator } from './TypingIndicator.js';

const meta = {
  title: 'Atoms/TypingIndicator',
  component: TypingIndicator,
  args: { size: 'md' },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
  },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof TypingIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <Stack direction="row" gap="lg" align="center">
      <TypingIndicator size="sm" />
      <TypingIndicator size="md" />
      <TypingIndicator size="lg" />
    </Stack>
  ),
};

export const InAssistantBubble: Story = {
  render: () => (
    <Surface level="raised" radius="md" padding="sm" style={{ width: '20rem' }}>
      <Stack direction="row" gap="sm" align="center">
        <Text size="sm" tone="muted">
          assistant
        </Text>
        <TypingIndicator />
      </Stack>
    </Surface>
  ),
};
