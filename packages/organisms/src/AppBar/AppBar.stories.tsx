import type { Meta, StoryObj } from '@storybook/react';
import { Button, Input, Surface } from '@touchstone/atoms';
import { AppBar } from './AppBar.js';

function HammerGlyph(): React.JSX.Element {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="6" width="9" height="3" rx="0.5" />
      <path d="M12 7.5h4M16 4l-2 3.5L16 11" />
      <path d="M7.5 9 4 17" />
    </svg>
  );
}

const meta = {
  title: 'Organisms/AppBar',
  component: AppBar,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    height: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md'],
    },
    divider: { control: 'boolean' },
    sticky: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <Surface level="page" style={{ minHeight: '20rem' }}>
        <Story />
      </Surface>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof AppBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    brand: (
      <>
        <HammerGlyph />
        <span>workshop</span>
      </>
    ),
    actions: (
      <>
        <Button intent="ghost">apprentice</Button>
        <Button intent="primary">strike</Button>
      </>
    ),
  },
};

export const WithSearch: Story = {
  args: {
    brand: (
      <>
        <HammerGlyph />
        <span>workshop</span>
      </>
    ),
    children: (
      <Input placeholder="search the ledger" style={{ maxWidth: '24rem' }} />
    ),
    actions: (
      <>
        <Button intent="ghost">apprentice</Button>
        <Button intent="primary">strike</Button>
      </>
    ),
  },
};

export const Flush: Story = {
  name: 'flush — no divider',
  args: {
    brand: (
      <>
        <HammerGlyph />
        <span>workshop</span>
      </>
    ),
    actions: <Button intent="primary">strike</Button>,
    divider: false,
  },
};

export const Compact: Story = {
  args: {
    height: 'sm',
    brand: (
      <>
        <HammerGlyph />
        <span>workshop</span>
      </>
    ),
    actions: <Button intent="primary">strike</Button>,
  },
};
