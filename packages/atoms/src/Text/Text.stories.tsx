import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text.js';
import { Surface } from '../Surface/Surface.js';

const meta = {
  title: 'Atoms/Text',
  component: Text,
  args: {
    children: 'every letter inscribed twice — once in the heart, once on the parchment.',
    size: 'md',
    weight: 'regular',
    tone: 'default',
  },
  argTypes: {
    size: {
      control: { type: 'inline-radio' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    weight: {
      control: { type: 'inline-radio' },
      options: ['regular', 'medium', 'semibold', 'bold'],
    },
    tone: {
      control: { type: 'inline-radio' },
      options: ['default', 'muted', 'accent', 'danger'],
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const SIZE_LINES: ReadonlyArray<{ size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'; line: string }> = [
  { size: 'xs', line: 'xs — the smallest mark, barely a breath on the page.' },
  { size: 'sm', line: 'sm — a margin note: see also the chapter on cooling oils.' },
  { size: 'md', line: 'md — the body of the entry, plain and unhurried.' },
  { size: 'lg', line: 'lg — a section called out for the apprentice who read in haste.' },
  { size: 'xl', line: 'xl — a chapter heading, struck in the larger die.' },
  { size: '2xl', line: "2xl — the ledger's first words: this is a workshop." },
];

const WEIGHT_LINES: ReadonlyArray<{ weight: 'regular' | 'medium' | 'semibold' | 'bold'; line: string }> = [
  { weight: 'regular', line: 'regular — the daily script, set down without ornament.' },
  { weight: 'medium', line: 'medium — given a small extra weight where the hand pressed harder.' },
  { weight: 'semibold', line: 'semibold — the kind of line a master underlines twice.' },
  { weight: 'bold', line: 'bold — etched deep, so the apprentice will not miss it.' },
];

const TONE_LINES: ReadonlyArray<{ tone: 'default' | 'muted' | 'accent' | 'danger'; line: string }> = [
  { tone: 'default', line: 'tone=default — ink in its true colour, neither louder nor quieter than the page.' },
  { tone: 'muted', line: 'tone=muted — set in pale grey, for words that wait their turn.' },
  { tone: 'accent', line: "tone=accent — in the dye reserved for the maker's mark." },
  { tone: 'danger', line: 'tone=danger — in the red used only when the work must be stopped.' },
];

/** Every size at the default weight + tone. */
export const Sizes: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Surface
      level="page"
      padding="lg"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
    >
      {SIZE_LINES.map(({ size, line }) => (
        <Text key={size} size={size}>
          {line}
        </Text>
      ))}
    </Surface>
  ),
};

/** Weight scale at md size. */
export const Weights: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Surface
      level="page"
      padding="lg"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
    >
      {WEIGHT_LINES.map(({ weight, line }) => (
        <Text key={weight} weight={weight}>
          {line}
        </Text>
      ))}
    </Surface>
  ),
};

/** Each tone — default, muted, accent, danger. */
export const Tones: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Surface
      level="page"
      padding="lg"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
    >
      {TONE_LINES.map(({ tone, line }) => (
        <Text key={tone} tone={tone}>
          {line}
        </Text>
      ))}
    </Surface>
  ),
};

/** Render Text as different elements via `as`. */
export const AsHeading: Story = {
  args: {
    as: 'h1',
    size: '2xl',
    weight: 'bold',
    children: 'the chapter the apprentice will read first',
  },
};
