import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TimeField } from './TimeField.js';
import { Stack } from '@touchstone/atoms';

const meta = {
  title: 'Molecules/TimeField',
  component: TimeField,
  args: {
    label: 'Alarm time',
  },
  argTypes: {
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    precision: { control: 'inline-radio', options: ['minute', 'second'] },
  },
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof TimeField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: '14:30' },
};

export const WithHint: Story = {
  args: { defaultValue: '14:30', hint: '24-hour clock.' },
};

export const WithError: Story = {
  args: { defaultValue: '14:30', error: 'Pick a time after 9 AM.' },
};

export const WithSeconds: Story = {
  args: { defaultValue: '14:30:45', precision: 'second' },
};

function ControlledDemo(): React.JSX.Element {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Stack direction="column" gap="md" style={{ maxWidth: '320px' }}>
      <TimeField
        label="Reservation time"
        hint="Local time, 24-hour."
        value={value}
        onChange={setValue}
        min="09:00"
        max="22:00"
      />
    </Stack>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
