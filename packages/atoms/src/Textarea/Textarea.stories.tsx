import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea.js';

const meta = {
  title: 'Atoms/Textarea',
  component: Textarea,
  args: {
    'aria-label': 'notes for the apprentice',
    placeholder: 'leave a note in the margin',
    rows: 4,
  },
  argTypes: {
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    rows: { control: { type: 'number', min: 1, max: 12 } },
    resize: {
      control: { type: 'inline-radio' },
      options: ['none', 'vertical', 'horizontal', 'both'],
    },
  },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: 'a stroke too long, the line is broken.',
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'set down for the night.' },
};

export const FixedHeight: Story = {
  args: { resize: 'none', rows: 6 },
};
