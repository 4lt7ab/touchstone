import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Grid, Stack, Surface, Text } from '@touchstone/atoms';

const meta = {
  title: 'Atoms/Grid',
  component: Grid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'CSS-Grid layout primitive — sibling to `Stack`. Pass `columns` as ' +
          'a fixed integer for forms and dashboards (`columns={3}`), or ' +
          '`{ min: \'md\' }` for an auto-fit responsive card grid. The ' +
          '`gap` / `align` / `justify` vocabulary mirrors `Stack`.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

const cards = [
  { title: 'orders open', value: '14', tone: 'accent' as const },
  { title: 'sealed today', value: '7', tone: 'success' as const },
  { title: 'in error', value: '1', tone: 'danger' as const },
  { title: 'on the shelf', value: '42', tone: 'neutral' as const },
  { title: 'apprentices', value: '3', tone: 'accent' as const },
  { title: 'dye left', value: '68%', tone: 'warning' as const },
];

function Card({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: 'accent' | 'success' | 'danger' | 'neutral' | 'warning';
}): React.JSX.Element {
  return (
    <Surface level="raised" radius="lg" padding="md">
      <Stack gap="sm">
        <Stack direction="row" align="center" justify="between" gap="sm">
          <Text size="sm" tone="muted" weight="medium">
            {title}
          </Text>
          <Badge tone={tone}>now</Badge>
        </Stack>
        <Text size="2xl" weight="bold">
          {value}
        </Text>
      </Stack>
    </Surface>
  );
}

export const Responsive: Story = {
  name: 'responsive — { min: "md" }',
  parameters: {
    docs: {
      description: {
        story:
          '`columns={{ min: \'md\' }}` (16rem) → auto-fit cards that reflow ' +
          'down to one column without a media query.',
      },
    },
  },
  args: {
    columns: { min: 'md' },
    gap: 'md',
    children: cards.map((c) => <Card key={c.title} {...c} />),
  },
};

export const FixedColumns: Story = {
  name: 'fixed — columns={3}',
  args: {
    columns: 3,
    gap: 'md',
    children: cards.map((c) => <Card key={c.title} {...c} />),
  },
};

export const TwelveColumnForm: Story = {
  name: 'forms — columns={2} with gap="lg"',
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side label / control rows in a settings form.',
      },
    },
  },
  render: () => (
    <Grid columns={2} gap="lg" align="center">
      <Text size="sm" weight="medium">
        name on the ledger
      </Text>
      <Surface level="raised" radius="md" padding="sm">
        <Text>apprentice</Text>
      </Surface>
      <Text size="sm" weight="medium">
        bench number
      </Text>
      <Surface level="raised" radius="md" padding="sm">
        <Text>3</Text>
      </Surface>
      <Text size="sm" weight="medium">
        anvil weight
      </Text>
      <Surface level="raised" radius="md" padding="sm">
        <Text>14 stone</Text>
      </Surface>
    </Grid>
  ),
};

export const TightAndDense: Story = {
  name: 'tight gap, small min',
  args: {
    columns: { min: 'xs' },
    gap: 'sm',
    children: Array.from({ length: 12 }).map((_, i) => (
      <Surface
        key={i}
        level="raised"
        radius="sm"
        padding="sm"
        style={{ textAlign: 'center' }}
      >
        <Text size="sm">{i + 1}</Text>
      </Surface>
    )),
  },
};
