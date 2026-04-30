import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button, Stack, Text } from '@touchstone/atoms';
import { Dialog } from './Dialog.js';

const meta = {
  title: 'Organisms/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Confirm: Story = {
  render: () => {
    function Host() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>
            <Button intent="danger">unmake the seal</Button>
          </Dialog.Trigger>
          <Dialog.Content
            title="confirm strike"
            description="this will unmake what was forged. there is no rejoining."
          >
            <Stack direction="row" justify="end" gap="sm">
              <Dialog.Close>
                <Button intent="secondary">stay the hand</Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button intent="danger">strike</Button>
              </Dialog.Close>
            </Stack>
          </Dialog.Content>
        </Dialog>
      );
    }
    return <Host />;
  },
};

export const Forced: Story = {
  render: () => {
    function Host() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>
            <Button>open the ledger</Button>
          </Dialog.Trigger>
          <Dialog.Content
            title="the ledger demands a name"
            description="dismissible=false; only the explicit close affordance ends the rite."
            dismissible={false}
          >
            <Text>strike the maker&apos;s mark before the page will turn.</Text>
            <Stack direction="row" justify="end" gap="sm">
              <Dialog.Close>
                <Button>I have struck</Button>
              </Dialog.Close>
            </Stack>
          </Dialog.Content>
        </Dialog>
      );
    }
    return <Host />;
  },
};
