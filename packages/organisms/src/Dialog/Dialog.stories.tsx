import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button, Stack, Text } from '@touchstone/atoms';
import { Field } from '@touchstone/molecules';
import { Dialog } from './Dialog.js';

const meta = {
  title: 'Organisms/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Modal dialog. Composes the full surface recipe — focus trap, focus return, ' +
          'scroll lock, click-outside, Escape, modal-stack registration — through one ' +
          '`useModalSurface` call. `size` picks the panel width, `severity="danger"` ' +
          'switches the role to `alertdialog` and applies a danger accent rail, and a ' +
          '`Dialog.Footer` child is sliced out and pinned beneath the scrollable body.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Confirm: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Default `Dialog`. The `Dialog.Footer` slot pins the action row beneath the ' +
          'body so long content scrolls without losing the buttons.',
      },
    },
  },
  render: () => {
    function Host() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>
            <Button>open the ledger</Button>
          </Dialog.Trigger>
          <Dialog.Content
            title="seal the entry"
            description="commit this row to the ledger; the ink will set."
          >
            <Text>name the apprentice who struck this mark.</Text>
            <Field label="apprentice" placeholder="name on the bench" />
            <Dialog.Footer>
              <Dialog.Close>
                <Button intent="secondary">stay the hand</Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button intent="primary">seal</Button>
              </Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      );
    }
    return <Host />;
  },
};

export const Danger: Story = {
  name: 'severity — danger / alertdialog',
  parameters: {
    docs: {
      description: {
        story:
          '`severity="danger"` switches the panel to `role="alertdialog"` and adds a ' +
          'danger accent rail along the leading edge. Use for destructive confirms.',
      },
    },
  },
  render: () => {
    function Host() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>
            <Button intent="danger">unmake the seal</Button>
          </Dialog.Trigger>
          <Dialog.Content
            severity="danger"
            title="confirm strike"
            description="this will unmake what was forged. there is no rejoining."
          >
            <Dialog.Footer>
              <Dialog.Close>
                <Button intent="secondary">stay the hand</Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button intent="danger">strike</Button>
              </Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      );
    }
    return <Host />;
  },
};

export const Sizes: Story = {
  name: 'size — sm / md / lg / xl',
  parameters: {
    docs: {
      description: {
        story: 'Each size opens its own dialog so you can compare panel widths side by side.',
      },
    },
  },
  render: () => {
    return (
      <Stack direction="row" gap="sm" wrap>
        {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <Dialog key={size}>
            <Dialog.Trigger>
              <Button intent="secondary">{size}</Button>
            </Dialog.Trigger>
            <Dialog.Content title={`size: ${size}`} size={size}>
              <Text>
                the {size} panel — the chamber sized for the work it holds.
              </Text>
              <Dialog.Footer>
                <Dialog.Close>
                  <Button intent="primary">close</Button>
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog>
        ))}
      </Stack>
    );
  },
};

export const Scrollable: Story = {
  name: 'scrollable body, pinned footer',
  parameters: {
    docs: {
      description: {
        story:
          'When body content exceeds panel height, the body scrolls and the `Dialog.Footer` ' +
          'stays pinned at the base. Title and description stay pinned at the top.',
      },
    },
  },
  render: () => (
    <Dialog>
      <Dialog.Trigger>
        <Button>open the long ledger</Button>
      </Dialog.Trigger>
      <Dialog.Content
        title="every entry on the shelf"
        description="title and footer stay pinned; the body scrolls."
        size="md"
      >
        <Stack direction="column" gap="sm">
          {Array.from({ length: 24 }).map((_, i) => (
            <Text key={i}>
              entry {i + 1} — a row of ink, set in the press, marked by the apprentice&apos;s hand.
            </Text>
          ))}
        </Stack>
        <Dialog.Footer>
          <Dialog.Close>
            <Button intent="secondary">close</Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button intent="primary">seal</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
};

export const Reader: Story = {
  name: 'mode — reader',
  parameters: {
    docs: {
      description: {
        story:
          '`mode="reader"` reframes the panel for long-form reading — wider default ' +
          'size (`lg`), more generous header / body padding, relaxed line-height, and a ' +
          '`~65ch` reading measure capped on body content. `description` accepts a ' +
          '`ReactNode` so authors can pin a byline or dateline alongside the title.',
      },
    },
  },
  render: () => (
    <Dialog>
      <Dialog.Trigger>
        <Button>open the long scroll</Button>
      </Dialog.Trigger>
      <Dialog.Content
        mode="reader"
        title="the recipe of the dye"
        description={
          <Stack direction="column" gap="xs">
            <Text size="sm" tone="muted">marked by the journeyman, on the night of the longest fire.</Text>
            <Text size="sm" tone="muted">vat IV — third reading</Text>
          </Stack>
        }
      >
        <Text>
          every drawer has a name in the ledger. switch the cabinet, and the same name
          fetches a different fire — the same ink, struck across a different anvil. the
          mark is constant; the chamber that holds it is not.
        </Text>
        <Text>
          a dye is not the colour you see; it is the agreement between the cloth, the
          mordant, the heat, and the hand. break any of these, and the page does not lie
          — it simply names a different thing.
        </Text>
        <Text>
          the apprentice who first reads this entry should know: the recipe is not a
          formula. it is a rhythm. the ledger keeps the rhythm; the bench keeps the
          ledger; the workshop keeps the bench.
        </Text>
        <Dialog.Footer>
          <Dialog.Close>
            <Button intent="primary">close the scroll</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
};

export const Forced: Story = {
  name: 'dismissible=false (forced choice)',
  parameters: {
    docs: {
      description: {
        story:
          '`dismissible=false` removes the built-in close X and disables Escape / ' +
          'backdrop-press dismissal. The consumer must wire an explicit `Dialog.Close`.',
      },
    },
  },
  render: () => {
    function Host() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>
            <Button>open the rite</Button>
          </Dialog.Trigger>
          <Dialog.Content
            title="the ledger demands a name"
            description="dismissible=false; only the explicit close ends the rite."
            dismissible={false}
          >
            <Text>strike the maker&apos;s mark before the page will turn.</Text>
            <Dialog.Footer>
              <Dialog.Close>
                <Button intent="primary">I have struck</Button>
              </Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      );
    }
    return <Host />;
  },
};
