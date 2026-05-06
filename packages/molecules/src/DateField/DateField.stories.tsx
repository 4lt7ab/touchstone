import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DateField } from './DateField.js';
import { Stack } from '@touchstone/atoms';

const meta = {
  title: 'Molecules/DateField',
  component: DateField,
  args: {
    label: 'Departure date',
  },
  argTypes: {
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    segmentOrder: { control: 'inline-radio', options: ['MDY', 'DMY', 'YMD'] },
  },
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof DateField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: '2026-05-15' },
};

export const WithHint: Story = {
  args: {
    defaultValue: '2026-05-15',
    hint: 'Pick the day you fly out.',
  },
};

export const WithError: Story = {
  args: {
    defaultValue: '2026-05-15',
    error: 'Departure must be in the future.',
  },
};

export const Required: Story = {
  args: {
    label: 'Date of birth',
    required: true,
  },
};

function ControlledDemo(): React.JSX.Element {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Stack direction="column" gap="md" style={{ maxWidth: '320px' }}>
      <DateField
        label="Reservation date"
        hint="MM / DD / YYYY"
        value={value}
        onChange={setValue}
        min="2026-05-06"
      />
    </Stack>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
