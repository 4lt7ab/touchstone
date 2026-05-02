import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AlertBanner } from './AlertBanner.js';

const meta = {
  title: 'Molecules/AlertBanner',
  component: AlertBanner,
  args: {
    tone: 'info',
    title: 'a quiet word from the master',
    children: 'the kiln will not be opened until the bricks have cooled.',
  },
  argTypes: {
    tone: {
      control: { type: 'inline-radio' },
      options: ['success', 'warning', 'danger', 'info'],
    },
  },
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof AlertBanner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Success: Story = {
  args: {
    tone: 'success',
    title: 'the seal held',
    children: 'the vessel is ready for the master’s mark.',
  },
};

export const Warning: Story = {
  args: {
    tone: 'warning',
    title: 'look once more',
    children: 'the metal cools faster than the apprentice expects.',
  },
};

export const Danger: Story = {
  args: {
    tone: 'danger',
    title: 'the strike would unmake what was forged',
    children: 'the ledger entry cannot be erased once the seal has been struck.',
  },
};

function DismissibleDemo(args: React.ComponentProps<typeof AlertBanner>): React.JSX.Element {
  const [open, setOpen] = useState(true);
  if (!open) return <span>(the entry was sealed.)</span>;
  return <AlertBanner {...args} onDismiss={() => setOpen(false)} />;
}

export const Dismissible: Story = {
  render: (args) => <DismissibleDemo {...args} />,
  args: {
    tone: 'info',
    title: 'the apprentice is asking',
    children: 'whether the bench should be wiped before the next pour.',
  },
};
