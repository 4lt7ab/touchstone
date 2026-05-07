import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DateTimeInput } from './DateTimeInput.js';
import { Stack } from '../Stack/Stack.js';
import { Text } from '../Text/Text.js';

const meta = {
  title: 'Atoms/DateTimeInput',
  component: DateTimeInput,
  args: {
    'aria-label': 'event',
  },
  argTypes: {
    precision: { control: 'inline-radio', options: ['minute', 'second'] },
    segmentOrder: { control: 'inline-radio', options: ['MDY', 'DMY', 'YMD'] },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof DateTimeInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: {} };

export const WithValue: Story = {
  args: { defaultValue: '2026-05-15T14:30' },
};

export const WithSeconds: Story = {
  args: { defaultValue: '2026-05-15T14:30:45', precision: 'second' },
};

export const Invalid: Story = {
  args: { defaultValue: '2026-05-15T14:30', invalid: true },
};

export const Disabled: Story = {
  args: { defaultValue: '2026-05-15T14:30', disabled: true },
};

export const Bounded: Story = {
  args: {
    defaultValue: '2026-05-15T14:30',
    min: '2026-05-15T09:00',
    max: '2026-05-15T18:00',
  },
};

function ControlledDemo(): React.JSX.Element {
  const [value, setValue] = useState<string | null>('2026-05-15T14:30');
  return (
    <Stack direction="column" gap="sm" style={{ maxWidth: '320px' }}>
      <DateTimeInput aria-label="event" value={value} onChange={setValue} />
      <Text size="sm">value: {value ?? '(incomplete)'}</Text>
    </Stack>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
