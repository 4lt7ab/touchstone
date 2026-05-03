import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Text } from '@touchstone/atoms';
import { Kbd } from './Kbd.js';

const meta = {
  title: 'Atoms/Kbd',
  component: Kbd,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Keyboard shortcut hint. Renders `<kbd>` as a tinted monospaced chip — ' +
          'used inside `Menu.Item.trailing`, tooltip content, and command palettes.',
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md'],
    },
  },
  args: {
    size: 'sm',
    children: '⌘K',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Kbd>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const Combination: Story = {
  render: () => (
    <span style={{ display: 'inline-flex', gap: '0.25rem' }}>
      <Kbd>⇧</Kbd>
      <Kbd>⌘</Kbd>
      <Kbd>P</Kbd>
    </span>
  ),
};

export const InlineWithText: Story = {
  render: () => (
    <Stack gap={2}>
      <Text>
        Press <Kbd>⌘K</Kbd> to open the palette.
      </Text>
      <Text>
        Save with <Kbd>⌘</Kbd> <Kbd>S</Kbd>.
      </Text>
    </Stack>
  ),
};

export const Sized: Story = {
  render: () => (
    <Stack gap={3}>
      <span>
        <Kbd size="sm">⌘K</Kbd> small
      </span>
      <span>
        <Kbd size="md">⌘K</Kbd> medium
      </span>
    </Stack>
  ),
};
