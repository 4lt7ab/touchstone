import type { Meta, StoryObj } from '@storybook/react';
import { Button, Stack, Surface, Text } from '@touchstone/atoms';
import { Menu } from '@touchstone/organisms';

function HingeGlyph(): React.JSX.Element {
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
      <rect x="2.5" y="3" width="11" height="10" rx="1.5" />
      <path d="M2.5 7h11" />
    </svg>
  );
}

function ScrollGlyph(): React.JSX.Element {
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
      <path d="M3 3h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5" />
      <path d="M3 3v8a2 2 0 0 0 2 2" />
      <path d="M6 6h5M6 9h5" />
    </svg>
  );
}

const meta = {
  title: 'Organisms/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Keyboard-navigable dropdown anchored to a trigger. Composes ' +
          '`Popover`\'s primitives with menu semantics — `role="menu"` on the ' +
          'surface, `role="menuitem"` on rows, arrow-key roving focus, and ' +
          'close-on-select. Drop into an `AppBar` actions slot for a profile ' +
          'menu, into a `Table` row for a context action, into a `PageHeader` ' +
          'as an overflow.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A profile menu — the canonical AppBar actions slot use case. Click ' +
          'the trigger; arrow keys move between items; Enter activates and ' +
          'closes; Escape dismisses.',
      },
    },
  },
  render: () => (
    <Menu>
      <Menu.Trigger>
        <Button intent="ghost">apprentice</Button>
      </Menu.Trigger>
      <Menu.Content aria-label="account">
        <Menu.Item icon={<HingeGlyph />} onSelect={() => {}}>
          profile
        </Menu.Item>
        <Menu.Item icon={<ScrollGlyph />} onSelect={() => {}}>
          ledger
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item tone="danger" onSelect={() => {}}>
          leave the bench
        </Menu.Item>
      </Menu.Content>
    </Menu>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <Menu>
      <Menu.Trigger>
        <Button intent="ghost">strike</Button>
      </Menu.Trigger>
      <Menu.Content aria-label="strike actions">
        <Menu.Item onSelect={() => {}}>seal the row</Menu.Item>
        <Menu.Item onSelect={() => {}} disabled>
          unmake the row
        </Menu.Item>
        <Menu.Item onSelect={() => {}}>copy the mark</Menu.Item>
      </Menu.Content>
    </Menu>
  ),
};

export const WithTrailingHints: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Trailing hints — keyboard shortcuts, counts, badges.',
      },
    },
  },
  render: () => (
    <Menu>
      <Menu.Trigger>
        <Button intent="ghost">file</Button>
      </Menu.Trigger>
      <Menu.Content aria-label="file actions">
        <Menu.Item
          onSelect={() => {}}
          trailing={<span>⌘N</span>}
        >
          new entry
        </Menu.Item>
        <Menu.Item
          onSelect={() => {}}
          trailing={<span>⌘S</span>}
        >
          seal
        </Menu.Item>
        <Menu.Item
          onSelect={() => {}}
          trailing={<span>⌘O</span>}
        >
          open
        </Menu.Item>
      </Menu.Content>
    </Menu>
  ),
};

export const InAppBarActions: Story = {
  name: 'in app bar — profile menu',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'The intended composition: a profile menu in the trailing actions ' +
          'slot of an `AppBar`. The library now renders this without consumer ' +
          'chrome.',
      },
    },
  },
  render: () => (
    <Surface level="page" style={{ minHeight: '12rem', padding: '1.5rem' }}>
      <Surface
        level="solid"
        radius="lg"
        padding="md"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Stack direction="row" align="center" gap="sm">
          <Text weight="semibold">the workshop</Text>
        </Stack>
        <Stack direction="row" align="center" gap="sm">
          <Button intent="ghost">help</Button>
          <Menu>
            <Menu.Trigger>
              <Button intent="ghost">apprentice ▾</Button>
            </Menu.Trigger>
            <Menu.Content side="bottom" align="end" aria-label="account">
              <Menu.Item icon={<HingeGlyph />} onSelect={() => {}}>
                profile
              </Menu.Item>
              <Menu.Item icon={<ScrollGlyph />} onSelect={() => {}}>
                settings
              </Menu.Item>
              <Menu.Separator />
              <Menu.Item tone="danger" onSelect={() => {}}>
                leave the bench
              </Menu.Item>
            </Menu.Content>
          </Menu>
        </Stack>
      </Surface>
    </Surface>
  ),
};
