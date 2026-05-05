import type { Meta, StoryObj } from '@storybook/react';
import { Button, Stack } from '@touchstone/atoms';
import { Tooltip } from './Tooltip.js';

function GearGlyph(): React.JSX.Element {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="2.5" />
      <path d="M8 1.5v2M8 12.5v2M14.5 8h-2M3.5 8h-2M12.6 3.4l-1.4 1.4M4.8 11.2l-1.4 1.4M12.6 12.6l-1.4-1.4M4.8 4.8L3.4 3.4" />
    </svg>
  );
}

function SearchGlyph(): React.JSX.Element {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="4" />
      <path d="m13.5 13.5-3-3" />
    </svg>
  );
}

function InboxGlyph(): React.JSX.Element {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 8.5h3l1 2h4l1-2h3M2 8.5l1.5-5h9L14 8.5M2 8.5v4a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}

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
          <GearGlyph />
        </Button>
      </Tooltip>
      <Tooltip content="search">
        <Button intent="ghost" shape="square" aria-label="search">
          <SearchGlyph />
        </Button>
      </Tooltip>
      <Tooltip content="inbox (3 unread)">
        <Button intent="ghost" shape="square" aria-label="inbox">
          <InboxGlyph />
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
