import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Surface, Text } from '@touchstone/atoms';
import { Heatmap, type HeatmapCell } from './Heatmap.js';

function activityGrid(): HeatmapCell[][] {
  const rows = 7;
  const cols = 24;
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const morning = c >= 9 && c <= 12;
      const afternoon = c >= 13 && c <= 17;
      const weekend = r === 0 || r === 6;
      const base = weekend ? 4 : 12;
      const peak = morning ? 18 : afternoon ? 22 : 0;
      const noise = ((r * 31 + c * 17) % 9) - 4;
      return { value: Math.max(0, base + peak + noise) };
    }),
  );
}

function contributionsGrid(): HeatmapCell[][] {
  return Array.from({ length: 7 }, (_, r) =>
    Array.from({ length: 26 }, (_, c) => ({
      value: Math.max(
        0,
        Math.round(
          3 + Math.sin((c + r) / 4) * 4 + ((r * 7 + c * 3) % 11) - (c < 4 || c > 22 ? 4 : 0),
        ),
      ),
    })),
  );
}

const meta = {
  title: 'Charts/Heatmap',
  component: Heatmap,
  args: {
    data: activityGrid(),
    'aria-label': 'Sessions by day-of-week and hour',
    rowLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    columnLabels: Array.from({ length: 24 }, (_, i) => `${i}`),
    tone: 'accent',
    cellSize: 14,
  },
  argTypes: {
    tone: {
      control: { type: 'inline-radio' },
      options: ['accent', 'success', 'warning', 'danger', 'info', 'neutral'],
    },
    cellSize: { control: { type: 'number', min: 6, max: 32, step: 2 } },
    cellGap: { control: { type: 'number', min: 0, max: 8, step: 1 } },
    showLegend: { control: 'boolean' },
  },
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Heatmap>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Surface level="panel" padding="lg" radius="md">
      <Stack direction="column" gap="md">
        <Stack direction="row" justify="between" align="center">
          <Text size="lg" weight="semibold">
            Sessions by hour
          </Text>
          <Text size="sm" tone="muted">
            7 days × 24 hours · UTC
          </Text>
        </Stack>
        <Heatmap {...args} format={(v) => `${v} sessions`} />
      </Stack>
    </Surface>
  ),
};

export const Contributions: Story = {
  args: {
    data: contributionsGrid(),
    'aria-label': 'Commits by week',
    rowLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    columnLabels: undefined,
    tone: 'success',
    cellSize: 12,
    cellGap: 3,
  },
  render: (args) => (
    <Surface level="panel" padding="lg" radius="md">
      <Stack direction="column" gap="md">
        <Text size="lg" weight="semibold">
          Commits over the past 6 months
        </Text>
        <Heatmap {...args} format={(v) => `${v} commits`} />
      </Stack>
    </Surface>
  ),
};

export const Tones: Story = {
  render: () => (
    <Stack direction="column" gap="md">
      {(['accent', 'success', 'warning', 'danger', 'info', 'neutral'] as const).map((tone) => (
        <Surface key={tone} level="panel" padding="md" radius="md">
          <Stack direction="row" gap="md" align="center">
            <div style={{ width: 80 }}>
              <Text size="sm" weight="medium">
                {tone}
              </Text>
            </div>
            <Heatmap
              data={activityGrid()}
              aria-label={`${tone} activity`}
              tone={tone}
              cellSize={10}
              cellGap={1}
              showLegend={false}
            />
          </Stack>
        </Surface>
      ))}
    </Stack>
  ),
};

export const FixedDomain: Story = {
  args: {
    domain: [0, 100],
    format: (v: number) => `${v}%`,
    'aria-label': 'Capacity %',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Pin the colour scale with `domain={[0, 100]}` so two heatmaps share a reference. Cells outside the domain clamp to its endpoints.',
      },
    },
  },
};
