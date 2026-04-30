import type { Meta, StoryObj } from '@storybook/react';
import { Surface, Text } from '@touchstone/atoms';
import { Disclosure } from './Disclosure.js';

const meta = {
  title: 'Molecules/Disclosure',
  component: Disclosure,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Disclosure>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  render: () => (
    <Surface level="raised" radius="md" padding="sm" style={{ width: '24rem' }}>
      <Disclosure>
        <Disclosure.Trigger>what is touchstone?</Disclosure.Trigger>
        <Disclosure.Content>
          <Text>
            a reference component library — the team&apos;s measure of quality.
          </Text>
        </Disclosure.Content>
      </Disclosure>
    </Surface>
  ),
};

export const Open: Story = {
  render: () => (
    <Surface level="raised" radius="md" padding="sm" style={{ width: '24rem' }}>
      <Disclosure defaultOpen>
        <Disclosure.Trigger>what is touchstone?</Disclosure.Trigger>
        <Disclosure.Content>
          <Text>
            a reference component library — the team&apos;s measure of quality.
          </Text>
        </Disclosure.Content>
      </Disclosure>
    </Surface>
  ),
};

export const Stack: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Surface
      level="page"
      padding="lg"
      style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center' }}
    >
      <Surface
        level="raised"
        radius="md"
        padding="sm"
        style={{ width: '32rem', display: 'flex', flexDirection: 'column' }}
      >
        <Disclosure>
          <Disclosure.Trigger>the recipe of the dye</Disclosure.Trigger>
          <Disclosure.Content>
            <Text>
              every drawer has a name in the ledger; switch the cabinet to see
              how the same name fetches a different fire.
            </Text>
          </Disclosure.Content>
        </Disclosure>
        <Disclosure>
          <Disclosure.Trigger>the rhythm of the rim</Disclosure.Trigger>
          <Disclosure.Content>
            <Text>
              still themes sleep; rhythmic themes breathe. one recipe, four
              heartbeats.
            </Text>
          </Disclosure.Content>
        </Disclosure>
        <Disclosure>
          <Disclosure.Trigger>the laws of the bench</Disclosure.Trigger>
          <Disclosure.Content>
            <Text>
              tokens → themes → atoms → molecules → organisms. nothing leans
              upward.
            </Text>
          </Disclosure.Content>
        </Disclosure>
      </Surface>
    </Surface>
  ),
};
