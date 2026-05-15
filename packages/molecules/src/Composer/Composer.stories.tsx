import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button, Stack, Text } from '@touchstone/atoms';
import { AttachIcon, PaletteIcon } from '@touchstone/icons';
import { Composer } from './Composer.js';

const meta = {
  title: 'Molecules/Composer',
  component: Composer,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 'min(40rem, 100%)' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Composer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: () => <Composer onSubmit={() => {}} />,
};

export const WithSlots: Story = {
  render: () => (
    <Composer
      onSubmit={() => {}}
      placeholder="Ask anything — Enter to send, Shift+Enter for a newline"
      attachmentSlot={
        <>
          <Button intent="ghost" shape="square" size="sm" aria-label="Attach a file">
            <AttachIcon size={14} />
          </Button>
          <Button intent="ghost" shape="square" size="sm" aria-label="Change theme">
            <PaletteIcon size={14} />
          </Button>
        </>
      }
      metaSlot="0 / 4096"
    />
  ),
};

export const Sending: Story = {
  render: () => (
    <Composer
      onSubmit={() => {}}
      defaultValue="What was the second tenet again?"
      state="sending"
    />
  ),
};

export const Streaming: Story = {
  render: () => (
    <Composer
      onSubmit={() => {}}
      placeholder="Wait for the assistant to finish, then keep going"
      state="streaming"
      metaSlot="streaming…"
    />
  ),
};

export const Interactive: Story = {
  render: () => {
    function Wired(): React.JSX.Element {
      const [value, setValue] = useState('');
      const [log, setLog] = useState<string[]>([]);
      return (
        <Stack direction="column" gap="sm">
          <Composer
            value={value}
            onChange={setValue}
            onSubmit={(text) => {
              setLog((prev) => [text, ...prev].slice(0, 4));
              setValue('');
            }}
            metaSlot={`${value.length} ch`}
          />
          {log.length > 0 ? (
            <Stack direction="column" gap="xs">
              <Text size="xs" tone="muted">
                Sent
              </Text>
              {log.map((line, i) => (
                <Text key={i} size="sm">
                  {line}
                </Text>
              ))}
            </Stack>
          ) : null}
        </Stack>
      );
    }
    return <Wired />;
  },
};
