import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Stack, Surface } from '@touchstone/atoms';
import { NavItem } from '../NavItem/NavItem.js';
import { NavSection } from './NavSection.js';

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
  title: 'Molecules/NavSection',
  component: NavSection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NavSection>;

export default meta;

type Story = StoryObj<typeof meta>;

const PanelDecorator: Story['decorators'] = [
  (Story) => (
    <Surface level="solid" radius="lg" padding="md" style={{ width: '16rem' }}>
      <Story />
    </Surface>
  ),
];

export const Basic: Story = {
  args: {
    label: 'bench',
    children: (
      <>
        <NavItem icon={<HingeGlyph />} selected>
          orders
        </NavItem>
        <NavItem icon={<HingeGlyph />} trailing={<Badge tone="neutral">7</Badge>}>
          moulds
        </NavItem>
        <NavItem icon={<HingeGlyph />}>recipes</NavItem>
      </>
    ),
  },
  decorators: PanelDecorator,
};

export const Unlabelled: Story = {
  args: {
    'aria-label': 'quick actions',
    children: (
      <>
        <NavItem icon={<HingeGlyph />}>strike</NavItem>
        <NavItem icon={<HingeGlyph />}>set aside</NavItem>
      </>
    ),
  },
  decorators: PanelDecorator,
};

export const TwoSections: Story = {
  name: 'two sections — typical sidebar',
  parameters: {
    docs: {
      description: {
        story:
          'Two NavSections stacked. Each one carries its own roving focus, so ' +
          'arrow keys cycle within a section. Tab moves between sections.',
      },
    },
  },
  render: () => (
    <Surface level="solid" radius="lg" padding="md" style={{ width: '16rem' }}>
      <Stack gap="md">
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
      </Stack>
    </Surface>
  ),
};
