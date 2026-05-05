import type { Meta, StoryObj } from '@storybook/react';
import { Button, Stack } from '@touchstone/atoms';
import { GearIcon, InboxIcon, SearchIcon } from '@touchstone/icons';
import { Tooltip } from './Tooltip.js';

const meta = {
  title: 'Molecules/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'open the bellows',
    children: <Button intent="primary">Hover me</Button>,
  },
};

export const IconOnly: Story = {
  render: () => (
    <Stack direction="row" gap="sm">
      <Tooltip content="settings">
        <Button intent="ghost" shape="square" aria-label="settings">
          <GearIcon />
        </Button>
      </Tooltip>
      <Tooltip content="search">
        <Button intent="ghost" shape="square" aria-label="search">
          <SearchIcon />
        </Button>
      </Tooltip>
      <Tooltip content="inbox (3 unread)">
        <Button intent="ghost" shape="square" aria-label="inbox">
          <InboxIcon />
        </Button>
      </Tooltip>
    </Stack>
  ),
};

export const Sides: Story = {
  render: () => (
    <Stack direction="row" gap="md">
      <Tooltip content="top" side="top">
        <Button>top</Button>
      </Tooltip>
      <Tooltip content="bottom" side="bottom">
        <Button>bottom</Button>
      </Tooltip>
      <Tooltip content="left" side="left">
        <Button>left</Button>
      </Tooltip>
      <Tooltip content="right" side="right">
        <Button>right</Button>
      </Tooltip>
    </Stack>
  ),
};

export const Tones: Story = {
  render: () => (
    <Stack direction="row" gap="md">
      <Tooltip content="default tip">
        <Button>default</Button>
      </Tooltip>
      <Tooltip content="for your information" tone="info">
        <Button>info</Button>
      </Tooltip>
      <Tooltip content="this will fail" tone="danger">
        <Button intent="ghost">danger</Button>
      </Tooltip>
    </Stack>
  ),
};

export const RichContent: Story = {
  args: {
    content: (
      <span>
        Hold <strong>Shift</strong> to step in 10s
      </span>
    ),
    children: <Button>volume</Button>,
  },
};
