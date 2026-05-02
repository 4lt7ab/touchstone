import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Surface, Text } from '@touchstone/atoms';
import { Sparkline } from './Sparkline.js';

function generate(count: number, seed: number): { label: string; value: number }[] {
  const out: { label: string; value: number }[] = [];
  let v = 100 + seed * 11;
  for (let i = 0; i < count; i++) {
    v = Math.max(10, v + Math.sin((i + seed) / 3) * 12 + ((i * seed) % 7));
    out.push({ label: `D${i + 1}`, value: Math.round(v) });
  }
  return out;
}

const SAMPLE_30 = generate(30, 7);
const SAMPLE_14 = generate(14, 3);

const meta = {
  title: 'Charts/Sparkline',
  component: Sparkline,
  args: {
    data: SAMPLE_30,
    'aria-label': 'Visitors spark',
    tone: 'accent',
    fill: true,
    showEndpoint: true,
  },
  argTypes: {
    tone: {
      control: { type: 'inline-radio' },
      options: ['accent', 'success', 'warning', 'danger', 'info', 'neutral'],
    },
    fill: { control: 'boolean' },
    showEndpoint: { control: 'boolean' },
    height: { control: { type: 'number', min: 12, max: 80, step: 4 } },
  },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Sparkline>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 200 }}>
      <Sparkline {...args} />
    </div>
  ),
};

export const Inline: Story = {
  render: () => (
    <Stack direction="row" align="center" gap="md">
      <Text size="sm" tone="muted">
        Sessions
      </Text>
      <Text size="lg" weight="bold">
        565k
      </Text>
      <Sparkline data={SAMPLE_30} aria-label="Sessions spark" width={120} />
      <Text size="sm" tone="muted">
        +6.1%
      </Text>
    </Stack>
  ),
};

export const Tones: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack direction="column" gap="sm">
      {(['accent', 'success', 'warning', 'danger', 'info', 'neutral'] as const).map((tone) => (
        <Surface key={tone} level="panel" padding="sm" radius="md">
          <Stack direction="row" align="center" gap="md">
            <div style={{ width: 80 }}>
              <Text size="sm" weight="medium">
                {tone}
              </Text>
            </div>
            <Sparkline data={SAMPLE_14} tone={tone} aria-label={`${tone} spark`} width={160} />
          </Stack>
        </Surface>
      ))}
    </Stack>
  ),
};

export const FillOff: Story = {
  args: { fill: false, showEndpoint: false, tone: 'neutral' },
  render: (args) => (
    <div style={{ width: 200 }}>
      <Sparkline {...args} />
    </div>
  ),
};

export const Tight: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <Stack direction="row" align="center" gap="sm">
      <Text size="sm">404k</Text>
      <Sparkline data={SAMPLE_14} aria-label="Visitors" width={48} height={16} />
    </Stack>
  ),
};
