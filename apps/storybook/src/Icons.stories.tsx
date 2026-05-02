import type { Meta, StoryObj } from '@storybook/react';
import { Grid, Stack, Surface, Text } from '@touchstone/atoms';
import {
  AudienceIcon,
  BookIcon,
  CalendarIcon,
  CardIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ClockIcon,
  FolderIcon,
  FunnelIcon,
  GearIcon,
  HomeIcon,
  InboxIcon,
  ListIcon,
  MinusIcon,
  MoreIcon,
  PaletteIcon,
  PeopleIcon,
  PlusIcon,
  ReportIcon,
  RocketIcon,
  SearchIcon,
  ShareIcon,
  ShieldIcon,
  SparkleIcon,
  TrendIcon,
  XIcon,
} from '@touchstone/icons';
import type { ComponentType } from 'react';
import type { IconProps } from '@touchstone/icons';

const ICONS: { name: string; Icon: ComponentType<IconProps> }[] = [
  { name: 'CheckIcon', Icon: CheckIcon },
  { name: 'XIcon', Icon: XIcon },
  { name: 'ChevronDownIcon', Icon: ChevronDownIcon },
  { name: 'ChevronUpIcon', Icon: ChevronUpIcon },
  { name: 'ChevronLeftIcon', Icon: ChevronLeftIcon },
  { name: 'ChevronRightIcon', Icon: ChevronRightIcon },
  { name: 'SearchIcon', Icon: SearchIcon },
  { name: 'PaletteIcon', Icon: PaletteIcon },
  { name: 'PlusIcon', Icon: PlusIcon },
  { name: 'MinusIcon', Icon: MinusIcon },
  { name: 'MoreIcon', Icon: MoreIcon },
  { name: 'HomeIcon', Icon: HomeIcon },
  { name: 'FolderIcon', Icon: FolderIcon },
  { name: 'ListIcon', Icon: ListIcon },
  { name: 'PeopleIcon', Icon: PeopleIcon },
  { name: 'InboxIcon', Icon: InboxIcon },
  { name: 'CalendarIcon', Icon: CalendarIcon },
  { name: 'ClockIcon', Icon: ClockIcon },
  { name: 'BookIcon', Icon: BookIcon },
  { name: 'GearIcon', Icon: GearIcon },
  { name: 'SparkleIcon', Icon: SparkleIcon },
  { name: 'ShareIcon', Icon: ShareIcon },
  { name: 'TrendIcon', Icon: TrendIcon },
  { name: 'ShieldIcon', Icon: ShieldIcon },
  { name: 'CardIcon', Icon: CardIcon },
  { name: 'RocketIcon', Icon: RocketIcon },
  { name: 'FunnelIcon', Icon: FunnelIcon },
  { name: 'ReportIcon', Icon: ReportIcon },
  { name: 'AudienceIcon', Icon: AudienceIcon },
];

const meta = {
  title: 'Icons/Overview',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The shared 24×24, stroke-2 icon set. Every icon follows the same ' +
          'recipe (currentColor stroke, hidden from a11y by default, opt-in ' +
          'via `title`). Compose with `Button`, `NavItem`, `Menu.Item`, or ' +
          'render directly inside `Avatar`.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Catalogue: Story = {
  render: () => (
    <Grid columns={{ min: 'sm' }} gap="md">
      {ICONS.map(({ name, Icon }) => (
        <Surface
          key={name}
          level="panel"
          padding="md"
          radius="md"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Icon size={24} />
          <Text size="xs" tone="muted">
            {name.replace(/Icon$/, '')}
          </Text>
        </Surface>
      ))}
    </Grid>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack direction="row" gap="md" align="center">
      <SparkleIcon size={12} />
      <SparkleIcon size={16} />
      <SparkleIcon size={20} />
      <SparkleIcon size={24} />
      <SparkleIcon size={32} />
    </Stack>
  ),
};

export const Labelled: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <Stack direction="row" gap="md" align="center">
      <SparkleIcon title="Sparkle — semantic search" />
      <Text size="sm" tone="muted">
        Pass <code>title</code> when an icon stands on its own.
      </Text>
    </Stack>
  ),
};
