import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Kbd, Stack, Text } from '@touchstone/atoms';
import { useHotkey } from '@touchstone/hooks';
import {
  FolderIcon,
  GearIcon,
  HomeIcon,
  PaletteIcon,
  PlusIcon,
  RocketIcon,
  TrashIcon,
} from '@touchstone/icons';
import { CommandPalette, type CommandPaletteCommand } from './CommandPalette.js';

const meta = {
  title: 'Organisms/CommandPalette',
  component: CommandPalette,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof CommandPalette>;

export default meta;

type Story = StoryObj<typeof meta>;

function Demo({
  withHotkey = true,
  initialOpen = true,
}: {
  withHotkey?: boolean;
  initialOpen?: boolean;
}): React.JSX.Element {
  const [open, setOpen] = useState(initialOpen);
  const [last, setLast] = useState<string | null>(null);

  const commands: CommandPaletteCommand[] = [
    {
      id: 'home',
      label: 'Go home',
      group: 'Navigation',
      icon: <HomeIcon />,
      shortcut: <Kbd>⌘H</Kbd>,
      onSelect: () => setLast('Go home'),
    },
    {
      id: 'projects',
      label: 'Open project',
      group: 'Navigation',
      icon: <FolderIcon />,
      shortcut: <Kbd>⌘O</Kbd>,
      keywords: ['workspace', 'switch'],
      onSelect: () => setLast('Open project'),
    },
    {
      id: 'new',
      label: 'New project',
      group: 'Actions',
      icon: <PlusIcon />,
      shortcut: <Kbd>⌘N</Kbd>,
      onSelect: () => setLast('New project'),
    },
    {
      id: 'launch',
      label: 'Quickstart',
      description: 'Boot a fresh workspace from the template',
      group: 'Actions',
      icon: <RocketIcon />,
      onSelect: () => setLast('Quickstart'),
    },
    {
      id: 'theme',
      label: 'Switch theme',
      group: 'Preferences',
      icon: <PaletteIcon />,
      keywords: ['color', 'dark', 'light'],
      onSelect: () => setLast('Switch theme'),
    },
    {
      id: 'settings',
      label: 'Settings',
      group: 'Preferences',
      icon: <GearIcon />,
      shortcut: <Kbd>⌘,</Kbd>,
      onSelect: () => setLast('Settings'),
    },
    {
      id: 'delete',
      label: 'Delete project',
      description: 'Permanently remove this project',
      group: 'Danger zone',
      tone: 'danger',
      icon: <TrashIcon />,
      onSelect: () => setLast('Delete project'),
    },
  ];

  useHotkey('mod+k', () => setOpen((o) => !o), { enabled: withHotkey });

  return (
    <Stack
      direction="column"
      gap="md"
      style={{ minHeight: '100vh', padding: '4rem', alignItems: 'center', justifyContent: 'center' }}
    >
      <Text size="lg">
        Press <Kbd>⌘K</Kbd> to open the palette.
      </Text>
      <Button onClick={() => setOpen(true)}>open palette</Button>
      <Text size="sm">
        last action: <strong>{last ?? '(none yet)'}</strong>
      </Text>
      <CommandPalette open={open} onOpenChange={setOpen} commands={commands} />
    </Stack>
  );
}

export const Default: Story = {
  render: () => <Demo initialOpen={false} />,
};

export const Open: Story = {
  render: () => <Demo />,
};

function NoFooterDemo(): React.JSX.Element {
  const [open, setOpen] = useState(true);
  return (
    <CommandPalette
      open={open}
      onOpenChange={setOpen}
      showFooter={false}
      commands={[
        { id: 'a', label: 'A spare command', onSelect: () => {} },
        { id: 'b', label: 'B spare command', onSelect: () => {} },
      ]}
    />
  );
}

export const NoFooter: Story = {
  render: () => <NoFooterDemo />,
};
