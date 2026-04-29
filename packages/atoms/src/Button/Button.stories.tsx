import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button.js';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  args: {
    children: 'Button',
    intent: 'primary',
    size: 'md',
  },
  argTypes: {
    intent: {
      control: { type: 'inline-radio' },
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
    },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { intent: 'secondary' },
};

export const Ghost: Story = {
  args: { intent: 'ghost' },
};

export const Danger: Story = {
  args: { intent: 'danger', children: 'Delete' },
};

export const AsLink: Story = {
  args: {
    asChild: true,
    children: <a href="https://example.com">Linked button</a>,
  },
};
