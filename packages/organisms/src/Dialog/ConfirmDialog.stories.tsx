import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@touchstone/atoms';
import { ConfirmDialog } from './ConfirmDialog.js';

const meta = {
  title: 'Organisms/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flat-prop wrapper over `Dialog` for confirm/cancel prompts — the ' +
          'ergonomic shortcut that replaces `window.confirm()` for destructive ' +
          'actions. `severity="danger"` defaults the confirm button to the danger ' +
          'intent and switches the panel to `role="alertdialog"`.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ConfirmDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>open prompt</Button>
          <ConfirmDialog
            open={open}
            onOpenChange={setOpen}
            title="Save changes?"
            description="The mark goes onto the bench."
            onConfirm={() => undefined}
          />
        </>
      );
    };
    return <Demo />;
  },
};

export const DangerWithTrigger: Story = {
  render: () => (
    <ConfirmDialog
      severity="danger"
      title="Unmake the seal?"
      description="this will be removed from the ledger and cannot be redrawn."
      confirmLabel="unmake"
      cancelLabel="hold"
      onConfirm={() => undefined}
      trigger={<Button intent="danger">unmake</Button>}
    />
  ),
};

export const AsyncConfirm: Story = {
  render: () => {
    const Demo = () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>send to the kiln</Button>
          <ConfirmDialog
            open={open}
            onOpenChange={setOpen}
            title="send to the kiln?"
            description="this will fire the batch — the cycle is one minute, no draws."
            confirmLabel="fire"
            onConfirm={() =>
              new Promise<void>((resolve) => {
                setTimeout(resolve, 1500);
              })
            }
          />
        </>
      );
    };
    return <Demo />;
  },
};
