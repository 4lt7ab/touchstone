import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import {
  Code,
  Stack,
  Surface,
  Text,
  TypingIndicator,
} from '@touchstone/atoms';
import { Message, MessageActions, ToolCall, Composer } from '@touchstone/molecules';
import { EmptyState } from '@touchstone/molecules';
import { Conversation } from './Conversation.js';

const meta = {
  title: 'Organisms/Conversation',
  component: Conversation,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Conversation>;

export default meta;

type Story = StoryObj<typeof meta>;

function Shell({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <Surface level="page" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {children}
    </Surface>
  );
}

export const Empty: Story = {
  render: () => (
    <Shell>
      <Conversation
        emptyState={
          <EmptyState>
            <EmptyState.Title>How can I help today?</EmptyState.Title>
            <EmptyState.Description>
              The conversation starts as soon as you send your first message.
            </EmptyState.Description>
          </EmptyState>
        }
        composer={<Composer onSubmit={() => {}} placeholder="Ask anything…" />}
      />
    </Shell>
  ),
};

export const Threaded: Story = {
  render: () => (
    <Shell>
      <Conversation
        composer={<Composer onSubmit={() => {}} placeholder="Ask anything…" />}
      >
        <Message author="user" authorName="You" timestamp="11:02">
          How do themes compose in Touchstone?
        </Message>
        <Message
          author="assistant"
          authorName="Assistant"
          timestamp="11:02"
          actions={<MessageActions onCopy={() => {}} onLike={() => {}} onDislike={() => {}} />}
        >
          Every theme is a CSS class that fills the same vars.* contract. Apply the class to any
          wrapper element and the whole subtree picks up the theme.
        </Message>
        <Message author="user" authorName="You" timestamp="11:03">
          Can a tool be invoked from inside a message?
        </Message>
        <Message
          author="assistant"
          authorName="Assistant"
          timestamp="11:03"
          actions={<MessageActions onCopy={() => {}} onRegenerate={() => {}} />}
        >
          <Stack direction="column" gap="sm">
            <Text>Yes — here&apos;s a sample call:</Text>
            <ToolCall
              name="read_file"
              status="success"
              args={
                <Code block language="json">
                  {JSON.stringify({ path: 'docs/architecture.md' }, null, 2)}
                </Code>
              }
              result={<Text size="sm">1.4 KB · 28 lines</Text>}
            />
          </Stack>
        </Message>
      </Conversation>
    </Shell>
  ),
};

export const Streaming: Story = {
  render: () => {
    function Live(): React.JSX.Element {
      const [body, setBody] = useState('');
      const target =
        'Touchstone bundles every workspace dep into one tarball, so consumers install one package and import one stylesheet.';
      useEffect(() => {
        let i = 0;
        const id = window.setInterval(() => {
          i += 2;
          setBody(target.slice(0, i));
          if (i >= target.length) window.clearInterval(id);
        }, 60);
        return () => window.clearInterval(id);
      }, []);
      const done = body.length >= target.length;
      return (
        <Shell>
          <Conversation
            typing={!done && body.length === 0 ? <TypingIndicator /> : undefined}
            composer={<Composer onSubmit={() => {}} state={done ? 'idle' : 'streaming'} />}
          >
            <Message author="user" authorName="You">
              Pitch me the umbrella package in one breath.
            </Message>
            <Message
              author="assistant"
              authorName="Assistant"
              state={done ? 'complete' : 'streaming'}
            >
              {body}
            </Message>
          </Conversation>
        </Shell>
      );
    }
    return <Live />;
  },
};
