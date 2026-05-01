import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Button, Surface } from '@touchstone/atoms';
import { PageHeader } from './PageHeader.js';

const meta = {
  title: 'Molecules/PageHeader',
  component: PageHeader,
  args: {
    title: 'orders for today',
  },
  argTypes: {
    as: {
      control: { type: 'inline-radio' },
      options: ['h1', 'h2', 'h3', 'h4'],
    },
    divider: { control: 'boolean' },
  },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Surface
        level="page"
        style={{ minHeight: '100vh', padding: '2rem', maxWidth: '960px', margin: '0 auto' }}
      >
        <Story />
      </Surface>
    ),
  ],
} satisfies Meta<typeof PageHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithDescription: Story = {
  args: {
    description: 'every strike, in the order it was made.',
  },
};

export const WithActions: Story = {
  args: {
    description: 'every strike, in the order it was made.',
    actions: (
      <>
        <Button intent="ghost">filter</Button>
        <Button intent="primary">new entry</Button>
      </>
    ),
  },
};

export const WithMeta: Story = {
  args: {
    description: 'every strike, in the order it was made.',
    meta: (
      <>
        <Badge tone="accent">14 open</Badge>
        <Badge tone="success">7 sealed</Badge>
      </>
    ),
  },
};

export const WithBreadcrumbs: Story = {
  args: {
    description: 'every strike, in the order it was made.',
    breadcrumbs: (
      <nav aria-label="breadcrumb">
        <a href="/" style={{ color: 'inherit' }}>workshop</a>
        <span aria-hidden="true"> / </span>
        <a href="/ledger" style={{ color: 'inherit' }}>ledger</a>
        <span aria-hidden="true"> / </span>
        <span>orders</span>
      </nav>
    ),
  },
};

export const Full: Story = {
  name: 'full — every slot',
  args: {
    description:
      'every strike of the day, in the order it was made. the master reads top to bottom; the apprentice strikes bottom to top.',
    breadcrumbs: (
      <nav aria-label="breadcrumb">
        <a href="/" style={{ color: 'inherit' }}>workshop</a>
        <span aria-hidden="true"> / </span>
        <a href="/ledger" style={{ color: 'inherit' }}>ledger</a>
        <span aria-hidden="true"> / </span>
        <span>orders</span>
      </nav>
    ),
    meta: (
      <>
        <Badge tone="accent">14 open</Badge>
        <Badge tone="warning">2 in error</Badge>
      </>
    ),
    actions: (
      <>
        <Button intent="ghost">filter</Button>
        <Button intent="secondary">export</Button>
        <Button intent="primary">new entry</Button>
      </>
    ),
    divider: true,
  },
};

export const WithDivider: Story = {
  args: {
    description: 'a thin rule beneath, when the body needs a clear break.',
    divider: true,
  },
};

export const SubsectionH2: Story = {
  args: {
    title: 'recent entries',
    as: 'h2',
    description: 'rendered as h2 — for sub-sections within a page.',
  },
};
