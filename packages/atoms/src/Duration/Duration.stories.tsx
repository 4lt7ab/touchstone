import type { Meta, StoryObj } from '@storybook/react';
import { Duration } from './Duration.js';
import { Stack } from '../Stack/Stack.js';
import { Text } from '../Text/Text.js';

const meta = {
  title: 'Atoms/Duration',
  component: Duration,
  argTypes: {
    format: { control: 'inline-radio', options: ['clock', 'short'] },
    precision: { control: 'inline-radio', options: ['second', 'minute'] },
    unit: { control: 'inline-radio', options: ['milliseconds', 'seconds'] },
  },
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Duration>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Clock: Story = {
  args: { value: (3600 + 23 * 60 + 45) * 1000 },
};

export const ClockShort: Story = {
  args: { value: (5 * 60 + 30) * 1000 },
};

export const ClockMinutePrecision: Story = {
  args: { value: (3600 + 23 * 60 + 45) * 1000, precision: 'minute' },
};

export const Short: Story = {
  args: { value: (3600 + 23 * 60 + 45) * 1000, format: 'short' },
};

export const ShortMinutePrecision: Story = {
  args: { value: (3600 + 23 * 60 + 45) * 1000, format: 'short', precision: 'minute' },
};

export const Negative: Story = {
  args: { value: -65 * 1000 },
};

export const Spectrum: Story = {
  render: () => (
    <Stack direction="column" gap="sm">
      <Text size="sm">3 sec: <Duration value={3 * 1000} /></Text>
      <Text size="sm">2 min 5 sec: <Duration value={(2 * 60 + 5) * 1000} /></Text>
      <Text size="sm">1 hr 23 min 4 sec (clock): <Duration value={(3600 + 23 * 60 + 4) * 1000} /></Text>
      <Text size="sm">1 hr 23 min 4 sec (short): <Duration value={(3600 + 23 * 60 + 4) * 1000} format="short" /></Text>
    </Stack>
  ),
};
