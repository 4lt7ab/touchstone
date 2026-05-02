import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio, RadioGroup } from './Radio.js';
import { Surface } from '../Surface/Surface.js';

const meta = {
  title: 'Atoms/Radio',
  component: RadioGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Surface style={{ width: '20rem' }}>
      <RadioGroup aria-label="plan" defaultValue="pro">
        <Radio value="free">Free</Radio>
        <Radio value="pro">Pro — $20/mo</Radio>
        <Radio value="team">Team — $50/seat</Radio>
      </RadioGroup>
    </Surface>
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <Surface style={{ width: '24rem' }}>
      <RadioGroup aria-label="plan" defaultValue="pro">
        <Radio value="free" description="for the apprentice; one bench, one apron.">
          Free
        </Radio>
        <Radio value="pro" description="for the journeyman; the workshop in their satchel.">
          Pro — $20/mo
        </Radio>
        <Radio value="team" description="for the master and crew; many hands at the same anvil.">
          Team — $50/seat
        </Radio>
      </RadioGroup>
    </Surface>
  ),
};

export const Controlled: Story = {
  render: () => {
    function Host() {
      const [value, setValue] = useState('pro');
      return (
        <Surface style={{ width: '20rem' }}>
          <RadioGroup aria-label="plan" value={value} onValueChange={setValue}>
            <Radio value="free">Free</Radio>
            <Radio value="pro">Pro</Radio>
            <Radio value="team">Team</Radio>
          </RadioGroup>
        </Surface>
      );
    }
    return <Host />;
  },
};

export const WithDisabledOption: Story = {
  render: () => (
    <Surface style={{ width: '20rem' }}>
      <RadioGroup aria-label="plan" defaultValue="free">
        <Radio value="free">Free</Radio>
        <Radio value="pro" disabled>
          Pro — coming soon
        </Radio>
        <Radio value="team">Team</Radio>
      </RadioGroup>
    </Surface>
  ),
};

export const DisabledGroup: Story = {
  render: () => (
    <Surface style={{ width: '20rem' }}>
      <RadioGroup aria-label="plan" defaultValue="pro" disabled>
        <Radio value="free">Free</Radio>
        <Radio value="pro">Pro</Radio>
        <Radio value="team">Team</Radio>
      </RadioGroup>
    </Surface>
  ),
};
