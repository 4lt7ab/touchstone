import type { Meta, StoryObj } from '@storybook/react';
import { Field } from './Field.js';

const meta = {
  title: 'Molecules/Field',
  component: Field,
  args: {
    label: "maker's mark",
    placeholder: "the name you'll strike on every vessel",
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithHint: Story = {
  args: {
    hint: 'the ledger keeps it; no other forge will see.',
  },
};

export const WithError: Story = {
  args: {
    error: 'no mark struck — the vessel cannot leave the workshop.',
    defaultValue: '(unsigned)',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    hint: 'the master sealed this drawer; it cannot be re-cut.',
  },
};
