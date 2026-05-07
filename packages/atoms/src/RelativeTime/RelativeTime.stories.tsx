import type { Meta, StoryObj } from '@storybook/react';
import { RelativeTime } from './RelativeTime.js';
import { Stack } from '../Stack/Stack.js';
import { Text } from '../Text/Text.js';

const meta = {
  title: 'Atoms/RelativeTime',
  component: RelativeTime,
  argTypes: {
    length: { control: 'inline-radio', options: ['long', 'short', 'narrow'] },
    numeric: { control: 'inline-radio', options: ['auto', 'always'] },
    live: { control: 'boolean' },
  },
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof RelativeTime>;

export default meta;

type Story = StoryObj<typeof meta>;

const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
const twoHoursAhead = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

export const PastMinutes: Story = {
  args: { value: fiveMinAgo },
};

export const FutureHours: Story = {
  args: { value: twoHoursAhead },
};

export const PastDays: Story = {
  args: { value: threeDaysAgo },
};

export const Short: Story = {
  args: { value: fiveMinAgo, length: 'short' },
};

export const Narrow: Story = {
  args: { value: fiveMinAgo, length: 'narrow' },
};

export const NumericAlways: Story = {
  args: { value: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), numeric: 'always' },
};

export const LiveTicking: Story = {
  args: { value: new Date(Date.now() - 5 * 1000).toISOString(), live: true },
  name: 'Live — opt in',
};

export const Spectrum: Story = {
  render: () => (
    <Stack direction="column" gap="sm">
      <Text size="sm">5 sec ago: <RelativeTime value={new Date(Date.now() - 5 * 1000).toISOString()} /></Text>
      <Text size="sm">5 min ago: <RelativeTime value={fiveMinAgo} /></Text>
      <Text size="sm">2 hr ahead: <RelativeTime value={twoHoursAhead} /></Text>
      <Text size="sm">3 days ago: <RelativeTime value={threeDaysAgo} /></Text>
    </Stack>
  ),
};
