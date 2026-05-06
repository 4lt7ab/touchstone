import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DateInput } from './DateInput.js';
import { Stack } from '../Stack/Stack.js';
import { Text } from '../Text/Text.js';

const meta = {
  title: 'Atoms/DateInput',
  component: DateInput,
  args: {
    'aria-label': 'event date',
  },
  argTypes: {
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    segmentOrder: { control: 'inline-radio', options: ['MDY', 'DMY', 'YMD'] },
  },
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof DateInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {},
};

export const WithValue: Story = {
  args: { defaultValue: '2026-05-15' },
};

export const Invalid: Story = {
  args: { defaultValue: '2026-05-15', invalid: true },
};

export const Disabled: Story = {
  args: { defaultValue: '2026-05-15', disabled: true },
};

export const ReadOnly: Story = {
  args: { defaultValue: '2026-05-15', readOnly: true },
};

export const DayMonthYear: Story = {
  name: 'DD/MM/YYYY',
  args: { defaultValue: '2026-05-15', segmentOrder: 'DMY' },
};

export const YearMonthDay: Story = {
  name: 'YYYY/MM/DD',
  args: { defaultValue: '2026-05-15', segmentOrder: 'YMD' },
};

function ControlledDemo(): React.JSX.Element {
  const [value, setValue] = useState<string | null>('2026-05-15');
  return (
    <Stack direction="column" gap="sm">
      <DateInput aria-label="event date" value={value} onChange={setValue} />
      <Text size="sm">value: {value ?? '(incomplete)'}</Text>
    </Stack>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};

export const Bounded: Story = {
  args: {
    defaultValue: '2026-05-15',
    min: '2026-05-01',
    max: '2026-05-31',
  },
};
