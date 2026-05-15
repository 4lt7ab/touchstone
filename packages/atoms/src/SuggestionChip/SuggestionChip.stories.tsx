import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '../Stack/Stack.js';
import { SuggestionChip } from './SuggestionChip.js';

function SparkleGlyph(): React.JSX.Element {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 2l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
    </svg>
  );
}

const meta = {
  title: 'Atoms/SuggestionChip',
  component: SuggestionChip,
  args: { children: 'summarise the thread', size: 'md', tone: 'neutral' },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md'] },
    tone: { control: { type: 'inline-radio' }, options: ['neutral', 'accent'] },
    disabled: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof SuggestionChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Accent: Story = {
  args: { tone: 'accent' },
};

export const WithIcon: Story = {
  args: { icon: <SparkleGlyph />, children: 'draft a reply' },
};

export const StarterRow: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <Stack direction="row" gap="sm" wrap>
      <SuggestionChip icon={<SparkleGlyph />}>summarise the thread</SuggestionChip>
      <SuggestionChip>explain like i&apos;m five</SuggestionChip>
      <SuggestionChip>find an example</SuggestionChip>
      <SuggestionChip>show me the source</SuggestionChip>
      <SuggestionChip tone="accent">draft a reply</SuggestionChip>
    </Stack>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, children: 'queued — wait for it' },
};
