import type { Meta, StoryObj } from '@storybook/react';
import { Button, Surface } from '@touchstone/atoms';
import { EmptyState } from './EmptyState.js';

function InboxGlyph(): React.JSX.Element {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 22h8l2 4h8l2-4h8" />
      <path d="M6 22V10a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v12" />
      <path d="M6 22v6a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2v-6" />
    </svg>
  );
}

const meta = {
  title: 'Molecules/EmptyState',
  component: EmptyState,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Surface level="page" style={{ minHeight: '100vh', padding: '2rem' }}>
        <Story />
      </Surface>
    ),
  ],
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Section: Story = {
  render: () => (
    <Surface level="raised" radius="lg" padding="lg">
      <EmptyState>
        <EmptyState.Icon>
          <InboxGlyph />
        </EmptyState.Icon>
        <EmptyState.Title>no invoices yet</EmptyState.Title>
        <EmptyState.Description>
          the ledger is unmarked. create the first entry, and the rest will follow it.
        </EmptyState.Description>
        <EmptyState.Actions>
          <Button intent="primary">new invoice</Button>
        </EmptyState.Actions>
      </EmptyState>
    </Surface>
  ),
};

export const Page: Story = {
  name: 'page — vh-tall takeover',
  render: () => (
    <EmptyState level="page">
      <EmptyState.Icon>
        <InboxGlyph />
      </EmptyState.Icon>
      <EmptyState.Title as="h1">welcome to the workshop</EmptyState.Title>
      <EmptyState.Description>
        nothing has been struck yet. lay the first piece on the bench, and the ledger begins.
      </EmptyState.Description>
      <EmptyState.Actions>
        <Button intent="ghost">read the laws of the bench</Button>
        <Button intent="primary">strike the first</Button>
      </EmptyState.Actions>
    </EmptyState>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <Surface level="raised" radius="lg" padding="lg">
      <EmptyState>
        <EmptyState.Title>no entries match.</EmptyState.Title>
      </EmptyState>
    </Surface>
  ),
};

export const NoIcon: Story = {
  render: () => (
    <Surface level="raised" radius="lg" padding="lg">
      <EmptyState>
        <EmptyState.Title>the inbox is empty</EmptyState.Title>
        <EmptyState.Description>
          messages will land here when the apprentice writes.
        </EmptyState.Description>
      </EmptyState>
    </Surface>
  ),
};
