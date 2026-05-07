import type { Meta, StoryObj } from '@storybook/react';
import { Time } from './Time.js';
import { Stack } from '../Stack/Stack.js';
import { Text } from '../Text/Text.js';

const meta = {
  title: 'Atoms/Time',
  component: Time,
  argTypes: {
    precision: { control: 'inline-radio', options: ['minute', 'second'] },
    hourCycle: { control: 'inline-radio', options: [undefined, 'h12', 'h23'] },
    showDate: { control: 'boolean' },
    live: { control: 'boolean' },
  },
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Time>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: '2026-05-15T15:30:00Z' },
};

export const WithSeconds: Story = {
  args: { value: '2026-05-15T15:30:45Z', precision: 'second' },
};

export const Force24Hour: Story = {
  args: { value: '2026-05-15T15:30:00Z', hourCycle: 'h23' },
};

export const Force12Hour: Story = {
  args: { value: '2026-05-15T15:30:00Z', hourCycle: 'h12' },
};

export const WithDate: Story = {
  args: { value: '2026-05-15T15:30:00Z', showDate: true },
};

export const LiveClock: Story = {
  name: 'Live clock — opt in',
  args: { live: true, precision: 'second' },
};

export const Localized: Story = {
  render: () => (
    <Stack direction="column" gap="sm">
      <Text size="sm">en-US: <Time value="2026-05-15T15:30:00Z" locale="en-US" /></Text>
      <Text size="sm">en-GB: <Time value="2026-05-15T15:30:00Z" locale="en-GB" /></Text>
      <Text size="sm">de-DE: <Time value="2026-05-15T15:30:00Z" locale="de-DE" /></Text>
      <Text size="sm">ja-JP: <Time value="2026-05-15T15:30:00Z" locale="ja-JP" /></Text>
    </Stack>
  ),
};
