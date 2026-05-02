import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SegmentedControl } from './SegmentedControl.js';

type ForgePhase = 'stoke' | 'hammer' | 'cool';

const PHASE_OPTIONS = [
  { value: 'stoke', label: 'stoke' },
  { value: 'hammer', label: 'hammer' },
  { value: 'cool', label: 'cool' },
] as const satisfies ReadonlyArray<{ value: ForgePhase; label: string }>;

const meta = {
  title: 'Molecules/SegmentedControl',
  component: SegmentedControl,
  args: {
    options: PHASE_OPTIONS,
    'aria-label': 'the forging phase',
    size: 'md',
  },
  argTypes: {
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md'],
    },
    disabled: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SegmentedControl<ForgePhase>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Uncontrolled: Story = {};

export const Small: Story = {
  args: { size: 'sm' },
};

function ControlledDemo(
  args: React.ComponentProps<typeof SegmentedControl<ForgePhase>>,
): React.JSX.Element {
  const [value, setValue] = useState<ForgePhase>('hammer');
  return <SegmentedControl {...args} value={value} onValueChange={setValue} />;
}

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};

export const WithDisabledOption: Story = {
  args: {
    options: [
      { value: 'stoke', label: 'stoke' },
      { value: 'hammer', label: 'hammer' },
      { value: 'cool', label: 'cool', disabled: true },
    ],
  },
};

export const FullyDisabled: Story = {
  args: { disabled: true },
};
