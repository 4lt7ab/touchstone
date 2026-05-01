import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Button, Surface, Text } from '@touchstone/atoms';
import { NavItem, NavSection } from '@touchstone/molecules';
import { Sidebar } from '@touchstone/organisms';

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

const meta = {
  title: 'Organisms/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    width: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
    },
    divider: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <Surface level="page" style={{ minHeight: '100vh', display: 'flex' }}>
        <Story />
      </Surface>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: (
      <NavSection label="bench">
        <NavItem icon={<HingeGlyph />} selected>
          orders
        </NavItem>
        <NavItem icon={<HingeGlyph />}>moulds</NavItem>
        <NavItem icon={<HingeGlyph />}>recipes</NavItem>
      </NavSection>
    ),
  },
};

export const WithHeaderAndFooter: Story = {
  args: {
    header: (
      <Text size="lg" weight="semibold">
        the workshop
      </Text>
    ),
    children: (
      <>
        <NavSection label="bench">
          <NavItem icon={<HingeGlyph />} selected>
            orders
          </NavItem>
          <NavItem icon={<HingeGlyph />} trailing={<Badge tone="neutral">7</Badge>}>
            moulds
          </NavItem>
          <NavItem icon={<HingeGlyph />}>recipes</NavItem>
        </NavSection>
        <NavSection label="ledger">
          <NavItem icon={<ScrollGlyph />} trailing={<Badge tone="warning">2</Badge>}>
            scrolls
          </NavItem>
          <NavItem icon={<ScrollGlyph />}>marks</NavItem>
        </NavSection>
      </>
    ),
    footer: (
      <Button intent="ghost" fullWidth>
        the apprentice
      </Button>
    ),
  },
};

export const WideAndFlush: Story = {
  name: 'wide column, flush edge',
  args: {
    width: 'lg',
    divider: false,
    header: (
      <Text size="lg" weight="semibold">
        the workshop
      </Text>
    ),
    children: (
      <NavSection label="bench">
        <NavItem icon={<HingeGlyph />} selected>
          orders
        </NavItem>
        <NavItem icon={<HingeGlyph />}>moulds</NavItem>
      </NavSection>
    ),
  },
};
