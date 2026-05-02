import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar.js';
import { Stack } from '../Stack/Stack.js';
import { Text } from '../Text/Text.js';
import { Surface } from '../Surface/Surface.js';

const meta = {
  title: 'Atoms/ProgressBar',
  component: ProgressBar,
  args: {
    value: 42,
    'aria-label': 'forging the rim',
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    tone: {
      control: { type: 'inline-radio' },
      options: ['accent', 'success', 'warning', 'danger'],
    },
  },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Surface style={{ width: '24rem' }}>
        <Story />
      </Surface>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <Stack gap="md" style={{ width: '24rem' }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Stack key={s} gap="xs">
          <Text size="sm" tone="muted">
            size={s}
          </Text>
          <ProgressBar value={60} size={s} aria-label={`size ${s}`} />
        </Stack>
      ))}
    </Stack>
  ),
};

export const Tones: Story = {
  render: () => (
    <Stack gap="md" style={{ width: '24rem' }}>
      {(['accent', 'success', 'warning', 'danger'] as const).map((t) => (
        <Stack key={t} gap="xs">
          <Text size="sm" tone="muted">
            tone={t}
          </Text>
          <ProgressBar value={70} tone={t} aria-label={`tone ${t}`} />
        </Stack>
      ))}
    </Stack>
  ),
};

export const Animated: Story = {
  name: 'animated — counts to 100',
  render: () => {
    function Host() {
      const [v, setV] = useState(0);
      useEffect(() => {
        const id = window.setInterval(() => {
          setV((x) => (x >= 100 ? 0 : x + 7));
        }, 600);
        return () => window.clearInterval(id);
      }, []);
      return (
        <Stack gap="xs" style={{ width: '24rem' }}>
          <Text size="sm" tone="muted">
            {v}%
          </Text>
          <ProgressBar value={v} aria-label="forging" />
        </Stack>
      );
    }
    return <Host />;
  },
};
