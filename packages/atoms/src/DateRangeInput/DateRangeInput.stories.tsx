import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DateRangeInput, type DateRangeValue } from './DateRangeInput.js';
import { CalendarIcon } from '@touchstone/icons';
import { Stack } from '../Stack/Stack.js';
import { Text } from '../Text/Text.js';

const meta = {
  title: 'Atoms/DateRangeInput',
  component: DateRangeInput,
  args: {
    'aria-label': 'trip',
  },
  argTypes: {
    includeTime: { control: 'boolean' },
    precision: { control: 'inline-radio', options: ['minute', 'second'] },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof DateRangeInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DateRange: Story = {
  args: { defaultValue: { start: '2026-05-10', end: '2026-05-15' } },
};

export const DateTimeRange: Story = {
  name: 'With time',
  args: {
    includeTime: true,
    defaultValue: { start: '2026-05-15T09:00', end: '2026-05-15T17:00' },
  },
};

export const WithAdornment: Story = {
  name: 'With end adornment',
  args: {
    includeTime: true,
    defaultValue: { start: '2026-05-15T09:00', end: '2026-05-15T17:00' },
    endAdornment: (
      <button
        type="button"
        aria-label="Open calendar"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          padding: '4px 8px',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <CalendarIcon size={16} />
      </button>
    ),
  },
};

export const Invalid: Story = {
  args: { defaultValue: { start: '2026-05-10', end: '2026-05-15' }, invalid: true },
};

export const Disabled: Story = {
  args: { defaultValue: { start: '2026-05-10', end: '2026-05-15' }, disabled: true },
};

function ControlledDemo(): React.JSX.Element {
  const [value, setValue] = useState<DateRangeValue>({
    start: '2026-05-15T09:00',
    end: '2026-05-15T17:00',
  });
  return (
    <Stack direction="column" gap="sm" style={{ maxWidth: '480px' }}>
      <DateRangeInput
        aria-label="meeting window"
        includeTime
        value={value}
        onChange={setValue}
      />
      <Text size="sm">
        start: {value.start ?? '—'} · end: {value.end ?? '—'}
      </Text>
    </Stack>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
