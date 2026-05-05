import type { Meta, StoryObj } from '@storybook/react';
import { Kbd, Stack } from '@touchstone/atoms';
import { CommandItem } from './CommandItem.js';

function FolderGlyph(): React.JSX.Element {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1.5 4.5a1.5 1.5 0 0 1 1.5-1.5h3l1.5 1.5h5.5a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5H3a1.5 1.5 0 0 1-1.5-1.5z" />
    </svg>
  );
}

function GearGlyph(): React.JSX.Element {
  return (
    <svg
      width="16"
      height="16"
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

function RocketGlyph(): React.JSX.Element {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 1.5c2.5 0 4.5 2 4.5 4.5v3.5l1.5 2v1.5h-3l-1 1.5h-4l-1-1.5h-3v-1.5l1.5-2V6c0-2.5 2-4.5 4.5-4.5z" />
      <circle cx="8" cy="6" r="1" />
    </svg>
  );
}

function TrashGlyph(): React.JSX.Element {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 4.5h11M6 4.5V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M4 4.5l.7 8.5a1 1 0 0 0 1 .9h4.6a1 1 0 0 0 1-.9l.7-8.5" />
    </svg>
  );
}

const meta = {
  title: 'Molecules/CommandItem',
  component: CommandItem,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof CommandItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Open project',
    icon: <FolderGlyph />,
    description: 'Switch to another workspace',
    shortcut: <Kbd>⌘O</Kbd>,
  },
};

export const Highlighted: Story = {
  args: {
    children: 'Settings',
    icon: <GearGlyph />,
    shortcut: <Kbd>⌘,</Kbd>,
    highlighted: true,
  },
};

export const Danger: Story = {
  args: {
    children: 'Delete project',
    icon: <TrashGlyph />,
    description: 'Permanently remove this project',
    tone: 'danger',
    highlighted: true,
  },
};

export const InAList: Story = {
  render: () => (
    <Stack direction="column" gap="none" role="listbox">
      <CommandItem icon={<FolderGlyph />} shortcut={<Kbd>⌘O</Kbd>}>
        Open project
      </CommandItem>
      <CommandItem icon={<RocketGlyph />} description="Boot a fresh workspace" highlighted>
        Quickstart
      </CommandItem>
      <CommandItem icon={<GearGlyph />} shortcut={<Kbd>⌘,</Kbd>}>
        Settings
      </CommandItem>
      <CommandItem icon={<TrashGlyph />} tone="danger">
        Delete project
      </CommandItem>
    </Stack>
  ),
};
