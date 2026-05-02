import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Surface, Text } from '@touchstone/atoms';
import { StackedBar } from './StackedBar.js';

const SOURCES = [
  { id: 'direct', label: 'Direct', value: 31 },
  { id: 'organic', label: 'Organic', value: 28 },
  { id: 'referral', label: 'Referral', value: 14 },
  { id: 'social', label: 'Social', value: 12 },
  { id: 'email', label: 'Email', value: 9 },
  { id: 'paid', label: 'Paid', value: 6 },
];

const BUDGET = [
  { id: 'eng', label: 'Engineering', value: 4_200_000 },
  { id: 'mkt', label: 'Marketing', value: 1_350_000 },
  { id: 'ops', label: 'Operations', value: 980_000 },
  { id: 'rd', label: 'R&D', value: 720_000 },
];

const meta = {
  title: 'Charts/StackedBar',
  component: StackedBar,
  args: {
    segments: SOURCES,
    'aria-label': 'Source mix',
    height: 16,
  },
  argTypes: {
    height: { control: { type: 'number', min: 6, max: 48, step: 2 } },
    showLegend: { control: 'boolean' },
  },
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof StackedBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Surface level="panel" padding="lg" radius="md" style={{ maxWidth: 520 }}>
      <Stack direction="column" gap="md">
        <Stack direction="row" justify="between" align="center">
          <Text size="lg" weight="semibold">
            Source mix
          </Text>
          <Text size="sm" tone="muted">
            share of visitors · 90d
          </Text>
        </Stack>
        <StackedBar {...args} />
      </Stack>
    </Surface>
  ),
};

export const Tall: Story = {
  args: { height: 28 },
  render: (args) => (
    <Surface level="panel" padding="lg" radius="md" style={{ maxWidth: 520 }}>
      <StackedBar {...args} />
    </Surface>
  ),
};

export const NoLegend: Story = {
  args: { showLegend: false, height: 8 },
  render: (args) => (
    <Surface level="panel" padding="md" radius="md" style={{ maxWidth: 360 }}>
      <Stack direction="column" gap="xs">
        <Text size="xs" tone="muted">
          Source mix
        </Text>
        <StackedBar {...args} />
      </Stack>
    </Surface>
  ),
};

export const Currency: Story = {
  args: {
    segments: BUDGET,
    'aria-label': 'Budget breakdown',
    format: (v: number) => `$${(v / 1_000_000).toFixed(1)}M`,
  },
  render: (args) => (
    <Surface level="panel" padding="lg" radius="md" style={{ maxWidth: 520 }}>
      <Stack direction="column" gap="md">
        <Text size="lg" weight="semibold">
          FY26 budget
        </Text>
        <StackedBar {...args} />
      </Stack>
    </Surface>
  ),
};

export const PerSegmentTones: Story = {
  args: {
    segments: [
      { id: 'on-track', label: 'On track', value: 64, tone: 'success' },
      { id: 'at-risk', label: 'At risk', value: 22, tone: 'warning' },
      { id: 'blocked', label: 'Blocked', value: 14, tone: 'danger' },
    ],
    'aria-label': 'Project health',
  },
  render: (args) => (
    <Surface level="panel" padding="lg" radius="md" style={{ maxWidth: 520 }}>
      <Stack direction="column" gap="md">
        <Text size="lg" weight="semibold">
          Project health
        </Text>
        <StackedBar {...args} />
      </Stack>
    </Surface>
  ),
};
