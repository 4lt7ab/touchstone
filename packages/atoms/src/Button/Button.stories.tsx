import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button.js';

function DismissGlyph(): React.JSX.Element {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

const meta = {
  title: 'Atoms/Button',
  component: Button,
  args: {
    children: 'strike',
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
    shape: {
      control: { type: 'inline-radio' },
      options: ['rect', 'square'],
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
  args: { intent: 'secondary', children: 'set aside' },
};

export const Ghost: Story = {
  args: { intent: 'ghost', children: 'linger' },
};

export const Danger: Story = {
  args: { intent: 'danger', children: 'unmake' },
};

export const AsLink: Story = {
  args: {
    asChild: true,
    children: <a href="https://example.com">follow the scroll to the next bench</a>,
  },
};

export const SquareIcon: Story = {
  args: {
    intent: 'ghost',
    shape: 'square',
    size: 'sm',
    'aria-label': 'dismiss',
    children: <DismissGlyph />,
  },
};

function PlusGlyph(): React.JSX.Element {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

function ArrowGlyph(): React.JSX.Element {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export const WithLeadingIcon: Story = {
  args: {
    icon: <PlusGlyph />,
    children: 'new project',
  },
};

export const WithTrailingIcon: Story = {
  args: {
    intent: 'secondary',
    trailing: <ArrowGlyph />,
    children: 'continue',
  },
};

export const WithBothSlots: Story = {
  args: {
    intent: 'ghost',
    icon: <PlusGlyph />,
    trailing: <ArrowGlyph />,
    children: 'add and follow',
  },
};

export const SquareDanger: Story = {
  args: {
    intent: 'danger',
    shape: 'square',
    size: 'md',
    'aria-label': 'unmake',
    children: <DismissGlyph />,
  },
};
