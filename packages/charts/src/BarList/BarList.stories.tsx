import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Surface, Text } from '@touchstone/atoms';
import { BarList } from './BarList.js';

const SOURCES = [
  { id: 'direct', name: 'Direct', value: 31, delta: { value: 0.02 } },
  { id: 'organic', name: 'Organic search', value: 28, delta: { value: 0.04 } },
  { id: 'referral', name: 'Referral', value: 14, delta: { value: -0.01 } },
  { id: 'social', name: 'Social', value: 12, delta: { value: 0.05 } },
  { id: 'email', name: 'Email', value: 9, delta: { value: -0.02 } },
  { id: 'paid', name: 'Paid', value: 6, delta: { value: 0 } },
];

const PAGES = [
  { id: '/', name: '/', value: 18000, description: '18k views', delta: { value: 0.06 } },
  {
    id: '/pricing',
    name: '/pricing',
    value: 9800,
    description: '9.8k views',
    delta: { value: 0.11 },
  },
  {
    id: '/docs',
    name: '/docs',
    value: 7400,
    description: '7.4k views',
    delta: { value: 0.04 },
  },
  {
    id: '/blog',
    name: '/blog/launch',
    value: 5200,
    description: '5.2k views',
    delta: { value: 0.42 },
  },
  {
    id: '/changelog',
    name: '/changelog',
    value: 3100,
    description: '3.1k views',
    delta: { value: -0.03 },
  },
];

const meta = {
  title: 'Charts/BarList',
  component: BarList,
  args: {
    items: SOURCES,
    'aria-label': 'Top sources',
    format: (n: number) => `${n}%`,
    tone: 'accent',
    density: 'comfortable',
  },
  argTypes: {
    tone: {
      control: { type: 'inline-radio' },
      options: ['accent', 'success', 'warning', 'danger', 'info', 'neutral'],
    },
    density: { control: { type: 'inline-radio' }, options: ['comfortable', 'compact'] },
  },
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof BarList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Surface level="panel" padding="lg" radius="md" style={{ maxWidth: 480 }}>
      <Stack direction="column" gap="md">
        <Stack direction="row" justify="between" align="center">
          <Text size="lg" weight="semibold">
            Top sources
          </Text>
          <Text size="sm" tone="muted">
            share of visitors
          </Text>
        </Stack>
        <BarList {...args} />
      </Stack>
    </Surface>
  ),
};

export const Compact: Story = {
  args: { density: 'compact' },
  render: (args) => (
    <Surface level="panel" padding="md" radius="md" style={{ maxWidth: 360 }}>
      <BarList {...args} />
    </Surface>
  ),
};

export const Pages: Story = {
  args: {
    items: PAGES,
    'aria-label': 'Top pages',
    format: (n: number) => `${(n / 1000).toFixed(1)}k`,
  },
  render: (args) => (
    <Surface level="panel" padding="lg" radius="md" style={{ maxWidth: 480 }}>
      <Stack direction="column" gap="md">
        <Text size="lg" weight="semibold">
          Top pages
        </Text>
        <BarList {...args} />
      </Stack>
    </Surface>
  ),
};

export const PerRowTone: Story = {
  args: {
    items: [
      { name: 'API uptime', value: 99.95, tone: 'success' },
      { name: 'Edge cache', value: 92.4, tone: 'accent' },
      { name: 'Background jobs', value: 84.1, tone: 'warning' },
      { name: 'Cold starts', value: 67.2, tone: 'danger' },
    ],
    'aria-label': 'SLOs',
    format: (n: number) => `${n.toFixed(2)}%`,
    max: 100,
  },
  render: (args) => (
    <Surface level="panel" padding="lg" radius="md" style={{ maxWidth: 480 }}>
      <BarList {...args} />
    </Surface>
  ),
};
