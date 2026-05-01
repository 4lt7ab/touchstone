import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Stack, Surface, Text } from '@touchstone/atoms';
import { NavItem } from './NavItem.js';

function HingeGlyph(): React.JSX.Element {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="3" width="11" height="10" rx="1.5" />
      <path d="M2.5 7h11" />
    </svg>
  );
}

function ScrollGlyph(): React.JSX.Element {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5" />
      <path d="M3 3v8a2 2 0 0 0 2 2" />
      <path d="M6 6h5M6 9h5" />
    </svg>
  );
}

function SealedGlyph(): React.JSX.Element {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="6" width="10" height="7" rx="1.5" />
      <path d="M5.5 6V4a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}

const meta = {
  title: 'Molecules/NavItem',
  component: NavItem,
  args: {
    children: 'orders',
  },
  argTypes: {
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md'],
    },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NavItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  decorators: [
    (Story) => (
      <Surface style={{ width: '16rem' }}>
        <Story />
      </Surface>
    ),
  ],
};

export const WithIcon: Story = {
  args: {
    icon: <HingeGlyph />,
  },
  decorators: Basic.decorators,
};

export const WithTrailing: Story = {
  args: {
    icon: <HingeGlyph />,
    trailing: <Badge tone="accent">14</Badge>,
  },
  decorators: Basic.decorators,
};

export const Selected: Story = {
  args: {
    icon: <HingeGlyph />,
    selected: true,
  },
  decorators: Basic.decorators,
};

export const Disabled: Story = {
  args: {
    icon: <SealedGlyph />,
    disabled: true,
    children: 'sealed drawer',
  },
  decorators: Basic.decorators,
};

export const Small: Story = {
  args: {
    size: 'sm',
    icon: <HingeGlyph />,
  },
  decorators: Basic.decorators,
};

export const AsLink: Story = {
  args: {
    asChild: true,
    icon: <HingeGlyph />,
    children: <a href="https://example.com/orders">orders</a>,
  },
  decorators: Basic.decorators,
};

export const SidebarList: Story = {
  name: 'sidebar list — composed in context',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'A natural composition: a vertical Stack of NavItems, one selected, ' +
          'a divider, then a second group. This is what a sidebar looks like ' +
          'while the dedicated `Sidebar` envelope is still in development.',
      },
    },
  },
  render: () => (
    <Surface
      level="page"
      style={{ minHeight: '100vh', padding: '1.5rem' }}
    >
      <Surface
        level="solid"
        radius="lg"
        padding="md"
        style={{ width: '16rem' }}
      >
        <Stack gap="xs">
          <Text size="xs" tone="muted" weight="medium">
            bench
          </Text>
          <NavItem icon={<HingeGlyph />} selected>
            orders
          </NavItem>
          <NavItem icon={<HingeGlyph />} trailing={<Badge tone="neutral">7</Badge>}>
            moulds
          </NavItem>
          <NavItem icon={<HingeGlyph />}>recipes</NavItem>

          <Text size="xs" tone="muted" weight="medium" style={{ marginTop: '0.75rem' }}>
            ledger
          </Text>
          <NavItem icon={<ScrollGlyph />} trailing={<Badge tone="warning">2</Badge>}>
            scrolls
          </NavItem>
          <NavItem icon={<ScrollGlyph />}>marks</NavItem>
          <NavItem icon={<SealedGlyph />} disabled>
            sealed drawer
          </NavItem>
        </Stack>
      </Surface>
    </Surface>
  ),
};
