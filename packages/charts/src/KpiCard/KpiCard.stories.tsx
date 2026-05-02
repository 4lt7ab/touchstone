import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from '@touchstone/atoms';
import { KpiCard } from './KpiCard.js';
import { Sparkline } from '../Sparkline/Sparkline.js';

function generate(count: number, seed: number): { label: string; value: number }[] {
  const out: { label: string; value: number }[] = [];
  let v = 100 + seed * 11;
  for (let i = 0; i < count; i++) {
    v = Math.max(10, v + Math.sin((i + seed) / 3) * 12 + ((i * seed) % 7));
    out.push({ label: `D${i + 1}`, value: Math.round(v) });
  }
  return out;
}

const SPARK_VISITORS = generate(30, 3);
const SPARK_SESSIONS = generate(30, 5);
const SPARK_CONVERSION = generate(30, 7).map((d) => ({ ...d, value: d.value / 50 }));
const SPARK_BOUNCE = generate(30, 11).map((d) => ({ ...d, value: 80 - d.value / 4 }));

const meta = {
  title: 'Charts/KpiCard',
  component: KpiCard,
  args: {
    label: 'Visitors (90d)',
    value: '404k',
    delta: { value: 0.094 },
  },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof KpiCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutDelta: Story = {
  args: { label: 'Visitors (90d)', value: '404k', delta: undefined },
};

export const Negative: Story = {
  args: { label: 'Bounce rate', value: '38.2%', delta: { value: -0.022 } },
};

export const Neutral: Story = {
  args: { label: 'Paid share', value: '6%', delta: { value: 0 } },
};

export const InvertedTone: Story = {
  args: {
    label: 'Bounce rate',
    value: '38.2%',
    delta: { value: -0.022, tone: 'success' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'When falling is good (bounce rate, error rate, latency), pass an explicit `tone` so the badge tracks the metric, not the sign.',
      },
    },
  },
};

export const CustomFormat: Story = {
  args: {
    label: 'p95 latency',
    value: '320 ms',
    delta: {
      value: -12,
      tone: 'success',
      format: (v) => `${v} ms`,
      caption: 'WoW',
    },
  },
};

export const Row: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Grid columns={4} gap="md">
      <KpiCard label="Visitors (90d)" value="404k" delta={{ value: 0.094 }} />
      <KpiCard label="Sessions (90d)" value="565k" delta={{ value: 0.061 }} />
      <KpiCard label="Avg conversion" value="2.74%" delta={{ value: 0.118 }} />
      <KpiCard label="Bounce rate" value="38.2%" delta={{ value: -0.022, tone: 'success' }} />
    </Grid>
  ),
};

export const WithSparkline: Story = {
  args: {
    label: 'Visitors (90d)',
    value: '404k',
    delta: { value: 0.094 },
    sparkline: <Sparkline data={SPARK_VISITORS} aria-label="Visitors trend" />,
  },
};

export const RowWithSparklines: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Grid columns={4} gap="md">
      <KpiCard
        label="Visitors (90d)"
        value="404k"
        delta={{ value: 0.094 }}
        sparkline={<Sparkline data={SPARK_VISITORS} aria-label="Visitors trend" />}
      />
      <KpiCard
        label="Sessions (90d)"
        value="565k"
        delta={{ value: 0.061 }}
        sparkline={<Sparkline data={SPARK_SESSIONS} aria-label="Sessions trend" />}
      />
      <KpiCard
        label="Avg conversion"
        value="2.74%"
        delta={{ value: 0.118 }}
        sparkline={<Sparkline data={SPARK_CONVERSION} aria-label="Conversion trend" />}
      />
      <KpiCard
        label="Bounce rate"
        value="38.2%"
        delta={{ value: -0.022, tone: 'success' }}
        sparkline={<Sparkline data={SPARK_BOUNCE} aria-label="Bounce rate trend" tone="success" />}
      />
    </Grid>
  ),
};
