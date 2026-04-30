import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge.js';
import { Surface } from '../Surface/Surface.js';

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  args: {
    children: 'apprentice',
    tone: 'neutral',
  },
  argTypes: {
    tone: {
      control: { type: 'inline-radio' },
      options: ['neutral', 'success', 'warning', 'danger', 'info', 'accent'],
    },
  },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllTones: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <Surface
      style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
    >
      <Badge tone="neutral">apprentice</Badge>
      <Badge tone="success">tempered</Badge>
      <Badge tone="warning">cooling</Badge>
      <Badge tone="danger">cracked</Badge>
      <Badge tone="info">on the bench</Badge>
      <Badge tone="accent">master mark</Badge>
    </Surface>
  ),
};
