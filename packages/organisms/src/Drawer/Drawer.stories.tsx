import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button, Stack, Text } from '@touchstone/atoms';
import { Field } from '@touchstone/molecules';
import { Dialog } from '../Dialog/Dialog.js';
import { Drawer } from './Drawer.js';

const meta = {
  title: 'Organisms/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Edge-anchored modal. Same surface contract as `Dialog` — focus trap, focus ' +
          'return, scroll lock, click-outside, Escape, modal-stack registration — but the ' +
          'panel is anchored to a viewport edge and slides in. Use for filter sheets, ' +
          'detail panels, and settings drawers. Common shapes: `side="left"` for nav, ' +
          '`side="right"` for detail, `side="bottom"` for mobile filters.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RightDetail: Story = {
  name: 'side=right — detail panel',
  parameters: {
    docs: {
      description: {
        story: 'A detail panel sliding in from the trailing edge — the classic data-table use case.',
      },
    },
  },
  render: () => {
    function Host() {
      const [open, setOpen] = useState(false);
      return (
        <Drawer open={open} onOpenChange={setOpen}>
          <Drawer.Trigger>
            <Button>open the entry</Button>
          </Drawer.Trigger>
          <Drawer.Content
            title="ledger row #042"
            description="the apprentice's hand on the bench, the ink not yet dry."
            side="right"
            size="md"
          >
            <Field label="apprentice" placeholder="name on the bench" />
            <Field label="strike count" placeholder="0" />
            <Field label="notes" placeholder="what the hammer found" />
            <Drawer.Footer>
              <Drawer.Close>
                <Button intent="secondary">close</Button>
              </Drawer.Close>
              <Drawer.Close>
                <Button intent="primary">save</Button>
              </Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      );
    }
    return <Host />;
  },
};

export const LeftNav: Story = {
  name: 'side=left — secondary nav',
  parameters: {
    docs: {
      description: {
        story: 'A leading-edge drawer for secondary navigation or settings.',
      },
    },
  },
  render: () => (
    <Drawer>
      <Drawer.Trigger>
        <Button intent="ghost">open the chart</Button>
      </Drawer.Trigger>
      <Drawer.Content
        title="the workshop"
        description="rooms past the front bench."
        side="left"
        size="sm"
      >
        <Stack direction="column" gap="xs">
          <Button intent="ghost">the bench</Button>
          <Button intent="ghost">the anvil</Button>
          <Button intent="ghost">the press</Button>
          <Button intent="ghost">the dye-house</Button>
        </Stack>
      </Drawer.Content>
    </Drawer>
  ),
};

export const BottomSheet: Story = {
  name: 'side=bottom — mobile sheet',
  parameters: {
    docs: {
      description: {
        story:
          'A bottom sheet — common on narrow viewports for filter / sort / action menus.',
      },
    },
  },
  render: () => (
    <Drawer>
      <Drawer.Trigger>
        <Button>narrow the catalogue</Button>
      </Drawer.Trigger>
      <Drawer.Content title="filters" side="bottom" size="md">
        <Field label="apprentice" placeholder="any name" />
        <Field label="shelf" placeholder="any shelf" />
        <Drawer.Footer align="between">
          <Drawer.Close>
            <Button intent="ghost">clear</Button>
          </Drawer.Close>
          <Drawer.Close>
            <Button intent="primary">apply</Button>
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  ),
};

export const Sides: Story = {
  name: 'side — left / right / top / bottom',
  parameters: {
    docs: {
      description: {
        story: 'Four triggers, one per side, so you can compare the slide directions.',
      },
    },
  },
  render: () => (
    <Stack direction="row" gap="sm" wrap>
      {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
        <Drawer key={side}>
          <Drawer.Trigger>
            <Button intent="secondary">from {side}</Button>
          </Drawer.Trigger>
          <Drawer.Content title={`side: ${side}`} side={side} size="md">
            <Text>the {side} chamber, sliding into view.</Text>
            <Drawer.Footer>
              <Drawer.Close>
                <Button intent="primary">close</Button>
              </Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      ))}
    </Stack>
  ),
};

export const StackedOnDialog: Story = {
  name: 'stacked — Dialog opened from inside Drawer',
  parameters: {
    docs: {
      description: {
        story:
          'Modal stack registration in action — pressing Escape inside the inner Dialog ' +
          'closes only the Dialog. The Drawer beneath stays open until Escape fires again. ' +
          'Both surfaces share the global scroll lock; the page underneath stays still.',
      },
    },
  },
  render: () => (
    <Drawer>
      <Drawer.Trigger>
        <Button>open the chamber</Button>
      </Drawer.Trigger>
      <Drawer.Content title="the chamber" side="right" size="lg">
        <Text>
          a Dialog opened from inside this Drawer dismisses first; Escape walks the
          stack outward.
        </Text>
        <Dialog>
          <Dialog.Trigger>
            <Button intent="primary">open the inner dialog</Button>
          </Dialog.Trigger>
          <Dialog.Content title="the inner rite" description="press Escape — only this closes.">
            <Dialog.Footer>
              <Dialog.Close>
                <Button intent="primary">resolved</Button>
              </Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
        <Drawer.Footer>
          <Drawer.Close>
            <Button intent="secondary">leave the chamber</Button>
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  ),
};
