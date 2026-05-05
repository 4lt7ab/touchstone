import type { Meta, StoryObj } from '@storybook/react';
import { Kbd, Stack } from '@touchstone/atoms';
import { FolderIcon, GearIcon, RocketIcon, TrashIcon } from '@touchstone/icons';
import { CommandItem } from './CommandItem.js';

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
    icon: <FolderIcon />,
    description: 'Switch to another workspace',
    shortcut: <Kbd>⌘O</Kbd>,
  },
};

export const Highlighted: Story = {
  args: {
    children: 'Settings',
    icon: <GearIcon />,
    shortcut: <Kbd>⌘,</Kbd>,
    highlighted: true,
  },
};

export const Danger: Story = {
  args: {
    children: 'Delete project',
    icon: <TrashIcon />,
    description: 'Permanently remove this project',
    tone: 'danger',
    highlighted: true,
  },
};

export const InAList: Story = {
  render: () => (
    <Stack direction="column" gap="none" role="listbox">
      <CommandItem icon={<FolderIcon />} shortcut={<Kbd>⌘O</Kbd>}>
        Open project
      </CommandItem>
      <CommandItem icon={<RocketIcon />} description="Boot a fresh workspace" highlighted>
        Quickstart
      </CommandItem>
      <CommandItem icon={<GearIcon />} shortcut={<Kbd>⌘,</Kbd>}>
        Settings
      </CommandItem>
      <CommandItem icon={<TrashIcon />} tone="danger">
        Delete project
      </CommandItem>
    </Stack>
  ),
};
