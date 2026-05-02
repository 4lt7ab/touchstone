import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Surface, Text } from '@touchstone/atoms';
import { Trendline } from './Trendline.js';

function generate(count: number, seed: number): { label: string; value: number }[] {
  const out: { label: string; value: number }[] = [];
  let v = 100 + seed * 11;
  for (let i = 0; i < count; i++) {
    v = Math.max(10, v + Math.sin((i + seed) / 3) * 12 + ((i * seed) % 7));
    out.push({
      label: `D${i + 1}`,
      value: Math.round(v),
    });
  }
  return out;
}

const SAMPLE_90 = generate(90, 3);
const SAMPLE_30 = generate(30, 7);
const SAMPLE_PERCENT = generate(45, 1).map((d) => ({
  label: d.label,
  value: Math.min(8, d.value / 50),
}));

const meta = {
  title: 'Charts/Trendline',
  component: Trendline,
  args: {
    data: SAMPLE_90,
    'aria-label': 'Visitors trend',
    tone: 'accent',
  },
  argTypes: {
    tone: {
      control: { type: 'inline-radio' },
      options: ['accent', 'success', 'warning', 'danger', 'info', 'neutral'],
    },
    showAxis: { control: 'boolean' },
    height: { control: { type: 'number', min: 80, max: 320, step: 20 } },
  },
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Trendline>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Percent: Story = {
  args: {
    data: SAMPLE_PERCENT,
    format: (n: number) => `${n.toFixed(2)}%`,
    'aria-label': 'Conversion trend',
  },
};

export const Tones: Story = {
  render: () => (
    <Stack direction="column" gap="lg">
      {(['accent', 'success', 'warning', 'danger', 'info', 'neutral'] as const).map((tone) => (
        <Surface key={tone} level="panel" padding="md" radius="md">
          <Stack direction="column" gap="sm">
            <Text size="sm" weight="medium">
              {tone}
            </Text>
            <Trendline data={SAMPLE_30} tone={tone} aria-label={`${tone} trend`} height={120} />
          </Stack>
        </Surface>
      ))}
    </Stack>
  ),
};

export const MultiSeries: Story = {
  render: () => (
    <Trendline
      aria-label="Visitors and sessions"
      format={(n) => `${(n / 1000).toFixed(0)}k`}
      series={[
        { label: 'Visitors', data: SAMPLE_90, tone: 'accent' },
        {
          label: 'Sessions',
          data: SAMPLE_90.map((d) => ({ ...d, value: d.value * 1.45 })),
          tone: 'info',
        },
        {
          label: 'Conversions',
          data: SAMPLE_90.map((d) => ({ ...d, value: d.value * 0.04 })),
          tone: 'success',
        },
      ]}
    />
  ),
};

export const MultiSeriesWithFill: Story = {
  render: () => (
    <Trendline
      aria-label="Two series with fill"
      series={[
        { label: 'Visitors', data: SAMPLE_30, tone: 'accent', fill: true },
        {
          label: 'Sessions',
          data: SAMPLE_30.map((d) => ({ ...d, value: d.value * 1.4 })),
          tone: 'info',
          fill: true,
        },
      ]}
    />
  ),
};

export const Sparkline: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <Stack direction="row" align="center" gap="md">
      <Text size="sm">Sessions</Text>
      <div style={{ width: 160 }}>
        <Trendline data={SAMPLE_30} aria-label="Sessions sparkline" height={32} showAxis={false} />
      </div>
      <Text size="sm" weight="semibold">
        +6.1%
      </Text>
    </Stack>
  ),
};
