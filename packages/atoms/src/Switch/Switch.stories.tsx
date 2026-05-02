import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch.js';
import { Surface } from '../Surface/Surface.js';
import { Text } from '../Text/Text.js';

const meta = {
  title: 'Atoms/Switch',
  component: Switch,
  args: {
    'aria-label': 'keep the bellows working',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Off: Story = {};

export const On: Story = { args: { defaultChecked: true } };

export const Disabled: Story = { args: { disabled: true } };

function WithLabelDemo(): React.JSX.Element {
  const [on, setOn] = useState(false);
  const labelId = 'bellows-label';
  return (
    <Surface style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
      <Switch checked={on} onCheckedChange={setOn} aria-labelledby={labelId} />
      <Text as="label" id={labelId}>
        {on ? 'the bellows are working.' : 'the bellows are at rest.'}
      </Text>
    </Surface>
  );
}

export const WithLabel: Story = {
  parameters: { layout: 'centered' },
  render: () => <WithLabelDemo />,
};
