import type { Meta, StoryObj } from '@storybook/react';
import { Background } from './Background.js';
import { Surface } from '../Surface/Surface.js';
import { Stack } from '../Stack/Stack.js';
import { Text } from '../Text/Text.js';

const meta = {
  title: 'Atoms/Background',
  component: Background,
  argTypes: {
    pattern: {
      control: { type: 'inline-radio' },
      options: ['none', 'grid', 'dots', 'mesh'],
    },
    pulse: { control: 'boolean' },
    scene: {
      control: { type: 'select' },
      options: [undefined, 'synthwave', 'blackhole', 'neural', 'pipboy', 'pacman'],
    },
  },
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Background>;

export default meta;

type Story = StoryObj<typeof meta>;

const Sample = (
  <Surface
    style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: '2rem',
    }}
  >
    <Surface level="raised" radius="lg" padding="lg">
      <Stack gap="sm">
        <Text size="lg" weight="semibold">
          the workshop, half-lit
        </Text>
        <Text tone="muted">
          the surface behind sits at z-index -1; the bench keeps its shape on top.
        </Text>
      </Stack>
    </Surface>
  </Surface>
);

export const None: Story = {
  args: { pattern: 'none' },
  render: (args) => (
    <>
      <Background {...args} />
      {Sample}
    </>
  ),
};

export const Grid: Story = {
  args: { pattern: 'grid' },
  render: (args) => (
    <>
      <Background {...args} />
      {Sample}
    </>
  ),
};

export const Dots: Story = {
  args: { pattern: 'dots' },
  render: (args) => (
    <>
      <Background {...args} />
      {Sample}
    </>
  ),
};

export const Mesh: Story = {
  args: { pattern: 'mesh' },
  render: (args) => (
    <>
      <Background {...args} />
      {Sample}
    </>
  ),
};

export const Pulsing: Story = {
  name: 'pulsing — synthwave/terminal themes breathe',
  args: { pattern: 'mesh', pulse: true },
  render: (args) => (
    <>
      <Background {...args} />
      {Sample}
    </>
  ),
};

export const SceneSynthwave: Story = {
  name: 'scene — synthwave',
  args: { scene: 'synthwave' },
  render: (args) => (
    <>
      <Background {...args} />
      {Sample}
    </>
  ),
};

export const SceneBlackhole: Story = {
  name: 'scene — blackhole (themed)',
  args: { scene: 'blackhole' },
  render: (args) => (
    <>
      <Background {...args} />
      {Sample}
    </>
  ),
};

export const SceneNeural: Story = {
  name: 'scene — neural (themed)',
  args: { scene: 'neural' },
  render: (args) => (
    <>
      <Background {...args} />
      {Sample}
    </>
  ),
};

export const ScenePipboy: Story = {
  name: 'scene — pipboy',
  args: { scene: 'pipboy' },
  render: (args) => (
    <>
      <Background {...args} />
      {Sample}
    </>
  ),
};

export const ScenePacman: Story = {
  name: 'scene — pacman',
  args: { scene: 'pacman' },
  render: (args) => (
    <>
      <Background {...args} />
      {Sample}
    </>
  ),
};

export const SceneOverGrid: Story = {
  name: 'scene + pattern — blackhole under grid',
  args: { scene: 'blackhole', pattern: 'grid' },
  render: (args) => (
    <>
      <Background {...args} />
      {Sample}
    </>
  ),
};
