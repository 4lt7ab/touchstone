import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Text } from '@touchstone/atoms';
import { Code } from './Code.js';

const meta = {
  title: 'Atoms/Code',
  component: Code,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Monospace primitive. Inline by default (`<code>`); pass `block` for a ' +
          'fenced `<pre><code>` with padding, scroll-x, and a tinted surround. ' +
          '`language` shows a corner pill in block mode and forwards as ' +
          '`data-language` for downstream highlighters.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Code>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Inline code, the default. Wraps a literal inside surrounding text.',
      },
    },
  },
  render: () => (
    <Text>
      run <Code>bun install</Code> from the workshop root, then{' '}
      <Code>bun run storybook</Code> to fire the kilns.
    </Text>
  ),
};

export const Block: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A fenced block — the markdown ``` shape. Scrolls horizontally on long lines.',
      },
    },
  },
  render: () => (
    <Stack direction="column" gap="md" style={{ maxWidth: '40rem' }}>
      <Code block>{`bun install
bun run --filter @touchstone/atoms test
bun run build`}</Code>
    </Stack>
  ),
};

export const BlockWithLanguage: Story = {
  name: 'block — with language pill',
  parameters: {
    docs: {
      description: {
        story:
          'When a `language` is set, a small uppercase pill renders in the top-right ' +
          'corner. The same string is forwarded as `data-language` on the `<pre>`.',
      },
    },
  },
  render: () => (
    <Stack direction="column" gap="md" style={{ maxWidth: '40rem' }}>
      <Code block language="ts">{`import { Code } from '@4lt7ab/touchstone';

export function Snippet() {
  return <Code language="bash">npm test</Code>;
}`}</Code>
      <Code block language="bash">{`bun run --filter '*' build
bun run --filter '*' test`}</Code>
    </Stack>
  ),
};
