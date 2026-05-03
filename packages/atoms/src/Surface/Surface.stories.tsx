import type { Meta, StoryObj } from '@storybook/react';
import { Surface } from './Surface.js';
import { Text } from '../Text/Text.js';

const meta = {
  title: 'Atoms/Surface',
  component: Surface,
  args: {
    level: 'raised',
    padding: 'md',
    radius: 'md',
    children: 'the bench, before any work is laid on it',
  },
  argTypes: {
    level: {
      control: { type: 'select' },
      options: [
        'none',
        'base',
        'solid',
        'raised',
        'muted',
        'panel',
        'input',
        'overlay',
        'veil',
        'disabled',
        'page',
      ],
    },
    padding: {
      control: { type: 'inline-radio' },
      options: ['none', 'sm', 'md', 'lg'],
    },
    radius: {
      control: { type: 'inline-radio' },
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
    glow: {
      control: { type: 'inline-radio' },
      options: ['none', 'soft', 'pulse'],
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Surface>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * Every `level` value renders side-by-side. On translucent themes (synthwave,
 * terminal) the difference between `bg` and `solid` becomes visible.
 */
export const AllLevels: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Surface
      level="page"
      padding="lg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      {(
        [
          'base',
          'solid',
          'raised',
          'muted',
          'panel',
          'input',
          'disabled',
          'overlay',
          'veil',
          'page',
        ] as const
      ).map((level) => (
        <Surface key={level} level={level} padding="md" radius="md" style={{ minWidth: '10rem' }}>
          <Text size="sm" weight="medium">
            level={level}
          </Text>
        </Surface>
      ))}
    </Surface>
  ),
};

/**
 * `glow="pulse"` syncs to the active theme's rhythm. On synthwave/terminal
 * the border ring breathes; on light/dark it stays at zero (no rhythm).
 */
export const GlowPulse: Story = {
  args: {
    level: 'raised',
    padding: 'lg',
    radius: 'lg',
    glow: 'pulse',
    children: <Text size="md">the rim breathes when the theme has a heartbeat.</Text>,
  },
};

/**
 * `as` swaps the rendered element while keeping the recipe. Pair with
 * landmark roles for a11y (`as='section' aria-label='...'`).
 */
export const AsSection: Story = {
  args: {
    as: 'section',
    'aria-label': 'the chapter on featured wares',
    level: 'raised',
    padding: 'lg',
    radius: 'lg',
    children: <Text>rendered as a chapter in the ledger, not a loose leaf.</Text>,
  },
};
