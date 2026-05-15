import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MessageActions } from './MessageActions.js';

const meta = {
  title: 'Molecules/MessageActions',
  component: MessageActions,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof MessageActions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Full: Story = {
  render: () => {
    function Row(): React.JSX.Element {
      const [liked, setLiked] = useState(false);
      const [disliked, setDisliked] = useState(false);
      return (
        <MessageActions
          onCopy={() => {}}
          onRegenerate={() => {}}
          onLike={() => {
            setLiked((v) => !v);
            setDisliked(false);
          }}
          onDislike={() => {
            setDisliked((v) => !v);
            setLiked(false);
          }}
          liked={liked}
          disliked={disliked}
        />
      );
    }
    return <Row />;
  },
};

export const CopyOnly: Story = {
  render: () => <MessageActions onCopy={() => {}} />,
};

export const AssistantRating: Story = {
  render: () => (
    <MessageActions
      onCopy={() => {}}
      onRegenerate={() => {}}
      onLike={() => {}}
      onDislike={() => {}}
    />
  ),
};

export const DisabledWhileStreaming: Story = {
  render: () => (
    <MessageActions
      onCopy={() => {}}
      onRegenerate={() => {}}
      onLike={() => {}}
      onDislike={() => {}}
      disabled
    />
  ),
};
