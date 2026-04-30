import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button, Stack, Surface, Text } from '@touchstone/atoms';
import { Popover } from './Popover.js';

const meta = {
  title: 'Organisms/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Bottom: Story = {
  render: () => {
    function Host() {
      const [open, setOpen] = useState(false);
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger>
            <Button intent="secondary">filters</Button>
          </Popover.Trigger>
          <Popover.Content aria-label="filter options">
            <Stack gap="sm" style={{ minWidth: '14rem' }}>
              <Text size="sm" weight="semibold">
                filter the ledger
              </Text>
              <Text size="sm" tone="muted">
                pick which entries the bench will show.
              </Text>
            </Stack>
          </Popover.Content>
        </Popover>
      );
    }
    return <Host />;
  },
};

export const TopCenter: Story = {
  render: () => {
    function Host() {
      const [open, setOpen] = useState(false);
      return (
        <Surface
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '12rem',
          }}
        >
          <Popover open={open} onOpenChange={setOpen}>
            <Popover.Trigger>
              <Button>show the recipe</Button>
            </Popover.Trigger>
            <Popover.Content side="top" align="center" aria-label="the recipe">
              <Stack gap="sm" style={{ width: '16rem' }}>
                <Text size="sm" weight="semibold">
                  the recipe
                </Text>
                <Text size="sm">
                  one stone, two parts ash, three turns at the anvil.
                </Text>
              </Stack>
            </Popover.Content>
          </Popover>
        </Surface>
      );
    }
    return <Host />;
  },
};

export const ForcedChoice: Story = {
  render: () => {
    function Host() {
      const [open, setOpen] = useState(false);
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger>
            <Button intent="danger">unmake</Button>
          </Popover.Trigger>
          <Popover.Content
            dismissible={false}
            aria-label="confirm the unmaking"
          >
            <Stack gap="sm" style={{ minWidth: '16rem' }}>
              <Text size="sm" weight="semibold">
                this cannot be rejoined.
              </Text>
              <Stack direction="row" gap="sm" justify="end">
                <Button intent="secondary" size="sm" onClick={() => setOpen(false)}>
                  stay the hand
                </Button>
                <Button intent="danger" size="sm" onClick={() => setOpen(false)}>
                  strike
                </Button>
              </Stack>
            </Stack>
          </Popover.Content>
        </Popover>
      );
    }
    return <Host />;
  },
};
