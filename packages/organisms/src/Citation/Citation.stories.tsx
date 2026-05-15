import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Surface, Text } from '@touchstone/atoms';
import { Citation, CitationList } from './Citation.js';

const meta = {
  title: 'Organisms/Citation',
  component: Citation,
  args: {
    index: 1,
    title: 'docs/architecture.md',
    snippet:
      'The umbrella @4lt7ab/touchstone is the only published package. Every leaf package is private.',
    href: 'https://example.com/docs/architecture',
  },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Citation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  render: (args) => (
    <Surface level="raised" radius="md" padding="md" style={{ maxWidth: '32rem' }}>
      <Text>
        Touchstone bundles every workspace dependency into one tarball so consumers install one
        package and import one stylesheet <Citation {...args} />. Themes are class-based and
        applied at the root <Citation index={2} title="docs/decisions.md" snippet="One class swaps the whole tree's tokens." />.
      </Text>
    </Surface>
  ),
};

export const Accent: Story = {
  args: { tone: 'accent' },
  render: (args) => (
    <Text>
      pair it with an accent tone when the citation is the main affordance{' '}
      <Citation {...args} />
    </Text>
  ),
};

export const Footer: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Stack
      direction="column"
      gap="md"
      style={{ width: 'min(40rem, 100%)', padding: '2rem', margin: '0 auto' }}
    >
      <Text>
        The Touchstone build graph drives a solution-style `tsc -b` from the root
        <Citation index={1} title="docs/architecture.md" snippet="Each leaf composes via re-export." />
        and each leaf is bundled with the shared tsup preset
        <Citation index={2} title="tooling/tsup-config/" snippet="Vanilla-extract aware." />.
      </Text>
      <CitationList
        items={[
          {
            index: 1,
            title: 'docs/architecture.md',
            snippet: 'Each leaf composes via re-export rather than re-bundle.',
            href: 'https://example.com/docs/architecture',
          },
          {
            index: 2,
            title: 'tooling/tsup-config/',
            snippet: 'Shared tsup preset, vanilla-extract aware.',
            href: 'https://example.com/tsup-config',
          },
        ]}
      />
    </Stack>
  ),
};
