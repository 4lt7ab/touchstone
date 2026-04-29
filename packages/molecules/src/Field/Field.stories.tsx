import type { Meta, StoryObj } from '@storybook/react';
import { Field } from './Field.js';

const meta = {
  title: 'Molecules/Field',
  component: Field,
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
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
    hint: 'We never share your email.',
  },
};

export const WithError: Story = {
  args: {
    error: 'Email is required',
    defaultValue: 'not-an-email',
  },
};

export const Disabled: Story = {
  args: { disabled: true, hint: 'Account email cannot be changed.' },
};
