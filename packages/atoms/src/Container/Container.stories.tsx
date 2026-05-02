import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container.js';
import { Surface } from '../Surface/Surface.js';
import { Text } from '../Text/Text.js';
import { Stack } from '../Stack/Stack.js';

const meta = {
  title: 'Atoms/Container',
  component: Container,
  argTypes: {
    width: {
      control: { type: 'inline-radio' },
      options: ['narrow', 'prose', 'wide', 'full'],
    },
    padding: {
      control: { type: 'inline-radio' },
      options: ['none', 'sm', 'md', 'lg'],
    },
  },
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Surface level="page" style={{ minHeight: '100vh' }}>
        <Story />
      </Surface>
    ),
  ],
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof meta>;

const Body = (
  <Surface level="raised" radius="lg" padding="lg">
    <Stack gap="sm">
      <Text size="lg" weight="semibold">
        a centred panel
      </Text>
      <Text>
        the apprentice walks the long hall and the bench finds them at the middle, neither closer to
        one wall than the other. resize the viewport to feel the width hold the shape.
      </Text>
    </Stack>
  </Surface>
);

export const Narrow: Story = {
  args: { width: 'narrow', padding: 'lg', children: Body },
};

export const Prose: Story = {
  args: { width: 'prose', padding: 'lg', children: Body },
};

export const Wide: Story = {
  args: { width: 'wide', padding: 'lg', children: Body },
};

export const Full: Story = {
  args: { width: 'full', padding: 'lg', children: Body },
};

export const AllWidths: Story = {
  name: 'all widths — side by side',
  render: () => (
    <Stack gap="lg">
      {(['narrow', 'prose', 'wide', 'full'] as const).map((w) => (
        <Container key={w} width={w} padding="md">
          <Surface level="raised" radius="md" padding="md">
            <Text size="sm" weight="medium">
              width={w}
            </Text>
          </Surface>
        </Container>
      ))}
    </Stack>
  ),
};
