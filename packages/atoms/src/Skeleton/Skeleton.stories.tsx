import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton.js';
import { Surface } from '../Surface/Surface.js';

const meta = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  args: { shape: 'text', width: '12rem', 'aria-label': 'the entry is being inscribed' },
  argTypes: {
    shape: {
      control: { type: 'inline-radio' },
      options: ['text', 'box', 'circle'],
    },
  },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleLine: Story = {};

export const Card: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <Surface
      level="raised"
      padding="md"
      radius="md"
      style={{
        width: '20rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <Surface style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Skeleton shape="circle" width="2.5rem" aria-hidden />
        <Skeleton shape="text" width="60%" aria-label="the maker's name is being read" />
      </Surface>
      <Skeleton shape="box" height="6rem" aria-label="the vessel is being measured" />
      <Skeleton shape="text" width="90%" aria-hidden />
      <Skeleton shape="text" width="75%" aria-hidden />
    </Surface>
  ),
};
