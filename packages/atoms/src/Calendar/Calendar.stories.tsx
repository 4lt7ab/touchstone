import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar, type CalendarRangeValue } from './Calendar.js';
import { Stack } from '../Stack/Stack.js';
import { Text } from '../Text/Text.js';

const meta = {
  title: 'Atoms/Calendar',
  component: Calendar,
  args: {
    'aria-label': 'event date',
  },
  argTypes: {
    mode: { control: 'inline-radio', options: ['single', 'range'] },
    weekStartsOn: { control: 'inline-radio', options: [0, 1] },
    numberOfMonths: { control: 'inline-radio', options: [1, 2] },
    disabled: { control: 'boolean' },
  },
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: '2026-05-15' },
};

export const MondayStart: Story = {
  args: { defaultValue: '2026-05-15', weekStartsOn: 1 },
};

export const Bounded: Story = {
  args: {
    defaultValue: '2026-05-15',
    min: '2026-05-05',
    max: '2026-05-25',
  },
};

export const DisabledWeekends: Story = {
  args: {
    defaultValue: '2026-05-15',
    isDateDisabled: (date) => {
      const day = new Date(`${date}T00:00:00Z`).getUTCDay();
      return day === 0 || day === 6;
    },
  },
};

export const Disabled: Story = {
  args: { defaultValue: '2026-05-15', disabled: true },
};

function ControlledSingle(): React.JSX.Element {
  const [value, setValue] = useState<string | null>('2026-05-15');
  return (
    <Stack direction="column" gap="sm">
      <Calendar
        aria-label="event date"
        value={value}
        onChange={(v) => setValue(typeof v === 'string' ? v : null)}
      />
      <Text size="sm">selected: {value ?? '—'}</Text>
    </Stack>
  );
}

export const ControlledSingleStory: Story = {
  name: 'Controlled — Single',
  render: () => <ControlledSingle />,
};

function RangeDemo(): React.JSX.Element {
  const [value, setValue] = useState<CalendarRangeValue>({ start: '2026-05-10', end: '2026-05-18' });
  return (
    <Stack direction="column" gap="sm">
      <Calendar
        aria-label="trip dates"
        mode="range"
        numberOfMonths={2}
        value={value}
        onChange={(v) => {
          if (v && typeof v !== 'string') setValue(v);
        }}
      />
      <Text size="sm">
        {value.start ?? '—'} → {value.end ?? '—'}
      </Text>
    </Stack>
  );
}

export const Range: Story = {
  name: 'Range — Two Months',
  render: () => <RangeDemo />,
};
