import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider.js';
import { Stack } from '../Stack/Stack.js';
import { Text } from '../Text/Text.js';

const meta = {
  title: 'Atoms/Slider',
  component: Slider,
  args: {
    'aria-label': 'volume',
  },
  argTypes: {
    range: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: 35 },
};

export const Stepped: Story = {
  args: { defaultValue: 50, step: 10 },
};

export const Range: Story = {
  args: { range: true, defaultValue: [20, 80], 'aria-label': 'band' },
};

export const Disabled: Story = {
  args: { defaultValue: 60, disabled: true },
};

function ControlledDemo(): React.JSX.Element {
  const [value, setValue] = useState(40);
  return (
    <Stack direction="column" gap="sm">
      <Slider
        aria-label="bitrate"
        value={value}
        onChange={(v) => setValue(v as number)}
        formatValue={(v) => `${v} kbps`}
      />
      <Text size="sm">value: {value} kbps</Text>
    </Stack>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};

function PriceRangeDemo(): React.JSX.Element {
  const [value, setValue] = useState<[number, number]>([100, 400]);
  return (
    <Stack direction="column" gap="sm">
      <Slider
        aria-label="price range"
        range
        min={0}
        max={500}
        step={10}
        value={value}
        onChange={(v) => setValue(v as [number, number])}
        formatValue={(v) => `$${v}`}
      />
      <Text size="sm">
        ${value[0]} – ${value[1]}
      </Text>
    </Stack>
  );
}

export const PriceRange: Story = {
  render: () => <PriceRangeDemo />,
};
