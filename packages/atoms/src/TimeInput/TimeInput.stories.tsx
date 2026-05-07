import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TimeInput } from './TimeInput.js';
import { Stack } from '../Stack/Stack.js';
import { Text } from '../Text/Text.js';

const meta = {
  title: 'Atoms/TimeInput',
  component: TimeInput,
  args: {
    'aria-label': 'alarm time',
  },
  argTypes: {
    precision: { control: 'inline-radio', options: ['minute', 'second'] },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof TimeInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: {} };

export const WithValue: Story = {
  args: { defaultValue: '14:30' },
};

export const WithSeconds: Story = {
  args: { defaultValue: '14:30:45', precision: 'second' },
};

export const Invalid: Story = {
  args: { defaultValue: '14:30', invalid: true },
};

export const Disabled: Story = {
  args: { defaultValue: '14:30', disabled: true },
};

export const Bounded: Story = {
  args: { defaultValue: '14:30', min: '09:00', max: '17:00' },
};

function ControlledDemo(): React.JSX.Element {
  const [value, setValue] = useState<string | null>('14:30');
  return (
    <Stack direction="column" gap="sm">
      <TimeInput aria-label="alarm time" value={value} onChange={setValue} />
      <Text size="sm">value: {value ?? '(incomplete)'}</Text>
    </Stack>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
