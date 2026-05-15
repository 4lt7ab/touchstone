import type { Meta, StoryObj } from '@storybook/react';
import { Code, Stack, Text } from '@touchstone/atoms';
import { ToolCall } from './ToolCall.js';

const meta = {
  title: 'Molecules/ToolCall',
  component: ToolCall,
  args: {
    name: 'search_docs',
    status: 'success',
    args: (
      <Code block language="json">
        {JSON.stringify({ query: 'umbrella package', limit: 5 }, null, 2)}
      </Code>
    ),
    result: (
      <Code block language="json">
        {JSON.stringify(
          {
            hits: [
              { title: 'Architecture · Distribution', score: 0.92 },
              { title: 'Coding conventions · Adding a new component', score: 0.81 },
            ],
          },
          null,
          2,
        )}
      </Code>
    ),
  },
  argTypes: {
    status: {
      control: { type: 'inline-radio' },
      options: ['pending', 'success', 'error'],
    },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 'min(40rem, 100%)' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ToolCall>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {};

export const Pending: Story = {
  args: { status: 'pending', result: undefined },
};

export const Errored: Story = {
  args: {
    status: 'error',
    result: <Text tone="danger">connection refused (ECONNREFUSED 127.0.0.1:8787)</Text>,
  },
};

export const StackOfCalls: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Stack
      direction="column"
      gap="sm"
      style={{ width: 'min(40rem, 100%)', padding: '2rem', margin: '0 auto' }}
    >
      <ToolCall
        name="search_docs"
        status="success"
        args={
          <Code block language="json">
            {JSON.stringify({ query: 'theme contract' }, null, 2)}
          </Code>
        }
        result={<Text size="sm">3 hits returned</Text>}
      />
      <ToolCall
        name="read_file"
        status="success"
        args={
          <Code block language="json">
            {JSON.stringify({ path: 'docs/architecture.md' }, null, 2)}
          </Code>
        }
        result={<Text size="sm">1.4 KB read · 28 lines</Text>}
      />
      <ToolCall name="fetch_url" status="pending" />
    </Stack>
  ),
};
