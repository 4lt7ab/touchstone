import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner.js';
import { Surface } from '../Surface/Surface.js';
import { Text } from '../Text/Text.js';

const meta = {
  title: 'Atoms/Spinner',
  component: Spinner,
  args: { size: 'md', 'aria-label': 'tempering the metal' },
  argTypes: {
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
    },
  },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <Surface
      style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}
    >
      <Spinner size="sm" aria-label="kindling the embers" />
      <Spinner size="md" aria-label="tempering the metal" />
      <Spinner size="lg" aria-label="cooling the casting" />
    </Surface>
  ),
};

/** Pairs naturally with a label so the user knows what's underway. */
export const WithLabel: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <Surface
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
    >
      <Spinner aria-hidden />
      <Text tone="muted">the bellows are working — wait for the steady glow.</Text>
    </Surface>
  ),
};
