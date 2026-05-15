import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@touchstone/atoms';
import { Message } from './Message.js';
import { MessageActions } from '../MessageActions/MessageActions.js';

const meta = {
  title: 'Molecules/Message',
  component: Message,
  args: {
    author: 'assistant',
    authorName: 'Assistant',
    children:
      "Touchstone is a themed, accessible React component library. The umbrella package bundles every atomic-design tier into one tarball.",
  },
  argTypes: {
    author: {
      control: { type: 'inline-radio' },
      options: ['user', 'assistant', 'system', 'tool'],
    },
    state: {
      control: { type: 'inline-radio' },
      options: ['complete', 'streaming', 'error'],
    },
    align: {
      control: { type: 'inline-radio' },
      options: ['start', 'end', 'stretch'],
    },
  },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Message>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Assistant: Story = {};

export const User: Story = {
  args: {
    author: 'user',
    authorName: 'You',
    children: 'How does the umbrella package combine the layers?',
  },
};

export const Streaming: Story = {
  args: {
    state: 'streaming',
    children: 'Sure — let me walk through how the build graph rolls each layer in',
  },
};

export const Error: Story = {
  args: {
    state: 'error',
    children:
      "Something went wrong while contacting the model. Press the regenerate button below to try again.",
  },
};

export const System: Story = {
  args: {
    author: 'system',
    children: 'You opened a new conversation · 2 minutes ago',
    authorName: undefined,
  },
};

export const WithActions: Story = {
  render: () => (
    <Message
      author="assistant"
      authorName="Assistant"
      timestamp="just now"
      actions={
        <MessageActions
          onCopy={() => {}}
          onRegenerate={() => {}}
          onLike={() => {}}
          onDislike={() => {}}
        />
      }
    >
      A `MessageActions` row docks below the bubble. Each affordance is independent so user
      turns can show only `Copy`, while assistant turns light up the full set.
    </Message>
  ),
};

export const ThreadedExchange: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Stack
      direction="column"
      gap="md"
      style={{ width: 'min(46rem, 100%)', padding: '2rem', margin: '0 auto' }}
    >
      <Message author="system">A fresh conversation begins.</Message>
      <Message author="user" authorName="You" timestamp="11:02">
        How do themes compose in Touchstone?
      </Message>
      <Message
        author="assistant"
        authorName="Assistant"
        timestamp="11:02"
        actions={<MessageActions onCopy={() => {}} onLike={() => {}} onDislike={() => {}} />}
      >
        Every theme is a CSS class that fills the same `vars.*` contract — apply the class to
        any wrapper and the whole subtree picks up the theme.
      </Message>
      <Message author="user" authorName="You" timestamp="11:03">
        Can two themes coexist on the same page?
      </Message>
      <Message
        author="assistant"
        authorName="Assistant"
        timestamp="11:03"
        state="streaming"
      >
        Yes — scope one theme to a panel and another to the page shell
      </Message>
    </Stack>
  ),
};
