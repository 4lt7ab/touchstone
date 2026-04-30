import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from './Stack.js';
import { Surface } from '../Surface/Surface.js';
import { Text } from '../Text/Text.js';

const meta = {
  title: 'Atoms/Stack',
  component: Stack,
  args: {
    direction: 'column',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: false,
  },
  argTypes: {
    direction: {
      control: { type: 'inline-radio' },
      options: ['row', 'column'],
    },
    gap: {
      control: { type: 'inline-radio' },
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    align: {
      control: { type: 'inline-radio' },
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
    },
    justify: {
      control: { type: 'inline-radio' },
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
    },
    wrap: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

const items = [
  'the anvil, set on the great oak block',
  'the kiln, banked since dawn',
  'the cabinet of dyes, alphabetised by hand',
];

export const Column: Story = {
  render: (args) => (
    <Stack {...args}>
      {items.map((line) => (
        <Surface key={line} level="raised" padding="md" radius="md">
          <Text>{line}</Text>
        </Surface>
      ))}
    </Stack>
  ),
};

export const Row: Story = {
  args: { direction: 'row', gap: 'sm' },
  render: (args) => (
    <Stack {...args}>
      <Surface level="raised" padding="sm" radius="md">
        <Text>anvil</Text>
      </Surface>
      <Surface level="raised" padding="sm" radius="md">
        <Text>kiln</Text>
      </Surface>
      <Surface level="raised" padding="sm" radius="md">
        <Text>shelf</Text>
      </Surface>
    </Stack>
  ),
};
