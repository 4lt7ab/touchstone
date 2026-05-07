import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker, type DatePickerRangeValue, type DatePickerValue } from './DatePicker.js';
import { Stack, Text } from '@touchstone/atoms';

const meta = {
  title: 'Organisms/DatePicker',
  component: DatePicker,
  args: {
    'aria-label': 'event date',
  },
  argTypes: {
    mode: { control: 'inline-radio', options: ['single', 'range'] },
    valueFormat: { control: 'inline-radio', options: ['timestamp', 'date'] },
    segmentOrder: { control: 'inline-radio', options: ['MDY', 'DMY', 'YMD'] },
    weekStartsOn: { control: 'inline-radio', options: [0, 1] },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    side: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '320px', minHeight: '420px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Prefilled: Story = {
  args: { defaultValue: '2026-05-15T00:00:00-04:00' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '320px', minHeight: '420px' }}>
        <Story />
      </div>
    ),
  ],
};

function ControlledTimestampDemo(): React.JSX.Element {
  const [value, setValue] = useState<string | null>('2026-05-15T00:00:00-04:00');
  return (
    <Stack direction="column" gap="md" style={{ maxWidth: '320px', minHeight: '440px' }}>
      <DatePicker
        aria-label="event date"
        value={value}
        onChange={(v) => setValue(typeof v === 'string' ? v : null)}
      />
      <Text size="sm">value: {value ?? '(empty)'}</Text>
    </Stack>
  );
}

export const ControlledTimestamp: Story = {
  name: 'Controlled — Timestamp (default)',
  render: () => <ControlledTimestampDemo />,
};

function ControlledDateOnlyDemo(): React.JSX.Element {
  const [value, setValue] = useState<string | null>('2026-05-15');
  return (
    <Stack direction="column" gap="md" style={{ maxWidth: '320px', minHeight: '440px' }}>
      <DatePicker
        aria-label="birthday"
        valueFormat="date"
        value={value}
        onChange={(v) => setValue(typeof v === 'string' ? v : null)}
      />
      <Text size="sm">value: {value ?? '(empty)'}</Text>
    </Stack>
  );
}

export const DateOnly: Story = {
  name: 'valueFormat="date"',
  render: () => <ControlledDateOnlyDemo />,
};

function RangeDemo(): React.JSX.Element {
  const [value, setValue] = useState<DatePickerRangeValue>({
    start: '2026-05-10T00:00:00-04:00',
    end: '2026-05-18T00:00:00-04:00',
  });
  return (
    <Stack direction="column" gap="md" style={{ maxWidth: '520px', minHeight: '480px' }}>
      <DatePicker
        aria-label="trip dates"
        mode="range"
        value={value}
        onChange={(v: DatePickerValue) => {
          if (v && typeof v !== 'string') setValue(v);
        }}
      />
      <Text size="sm">
        start: {value.start ?? '—'} · end: {value.end ?? '—'}
      </Text>
    </Stack>
  );
}

export const Range: Story = {
  name: 'Range',
  render: () => <RangeDemo />,
};

export const Bounded: Story = {
  args: {
    defaultValue: '2026-05-15T00:00:00-04:00',
    min: '2026-05-05',
    max: '2026-05-25',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '320px', minHeight: '420px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: { defaultValue: '2026-05-15T00:00:00-04:00', disabled: true },
};

function IncludeTimeDemo(): React.JSX.Element {
  const [value, setValue] = useState<string | null>('2026-05-15T14:30:00-04:00');
  return (
    <Stack direction="column" gap="md" style={{ maxWidth: '480px', minHeight: '440px' }}>
      <DatePicker
        aria-label="event"
        includeTime
        value={value}
        onChange={(v) => setValue(typeof v === 'string' ? v : null)}
      />
      <Text size="sm">value: {value ?? '(empty)'}</Text>
    </Stack>
  );
}

export const IncludeTime: Story = {
  name: 'includeTime — date + time',
  render: () => <IncludeTimeDemo />,
};

function IncludeTimeRangeDemo(): React.JSX.Element {
  const [value, setValue] = useState<DatePickerRangeValue>({
    start: '2026-05-15T09:00:00-04:00',
    end: '2026-05-15T17:00:00-04:00',
  });
  return (
    <Stack direction="column" gap="md" style={{ maxWidth: '720px', minHeight: '480px' }}>
      <DatePicker
        aria-label="meeting window"
        mode="range"
        includeTime
        value={value}
        onChange={(v: DatePickerValue) => {
          if (v && typeof v !== 'string') setValue(v);
        }}
      />
      <Text size="sm">
        start: {value.start ?? '—'} · end: {value.end ?? '—'}
      </Text>
    </Stack>
  );
}

export const IncludeTimeRange: Story = {
  name: 'includeTime + range',
  render: () => <IncludeTimeRangeDemo />,
};

export const IncludeTimeWithSeconds: Story = {
  name: 'includeTime — second precision',
  args: {
    includeTime: true,
    timePrecision: 'second',
    defaultValue: '2026-05-15T14:30:45-04:00',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '480px', minHeight: '440px' }}>
        <Story />
      </div>
    ),
  ],
};

export const FixedTimezone: Story = {
  name: 'Fixed timeZone (Asia/Tokyo)',
  args: {
    defaultValue: '2026-05-15T00:00:00+09:00',
    timeZone: 'Asia/Tokyo',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '320px', minHeight: '420px' }}>
        <Story />
      </div>
    ),
  ],
};
