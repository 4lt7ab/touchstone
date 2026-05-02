import type { Meta, StoryObj } from '@storybook/react';
import { Code } from '@touchstone/atoms';
import { Prose } from './Prose.js';

const meta = {
  title: 'Molecules/Prose',
  component: Prose,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Long-form content container. Drops vertical rhythm and theme-bound visuals ' +
          'on bare HTML descendants — `h1`–`h6`, `p`, `ul`, `ol`, `li`, `blockquote`, ' +
          '`hr`, `a`, `strong`, `em`, `img`, `table`, `pre`. Pair with `Markdown` for ' +
          'rendered markdown, or wrap hand-authored documentation JSX directly.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Prose>;

export default meta;

type Story = StoryObj<typeof meta>;

const sampleBody = (
  <>
    <h1>the workshop guide</h1>
    <p>
      welcome to the bench. each chapter that follows is a rite the apprentice strikes in
      lockstep — read first, then take up the hammer.
    </p>
    <h2>the morning ledger</h2>
    <p>
      every shelf in the workshop carries a ledger. the entries are written in a single
      voice; the seal is set when the day&apos;s last apprentice signs the line.
    </p>
    <ul>
      <li>open the cabinet, set the lamps</li>
      <li>walk the shelves, note any stone out of place</li>
      <li>strike the dye-pot, ready the press</li>
    </ul>
    <h2>the afternoon rite</h2>
    <p>
      after the morning is sealed, the apprentice may carry a single vessel from the bench
      to the cart. the verse for the rite is{' '}
      <a href="https://example.com/chapter-four">written in chapter four</a>; consult it before
      striking.
    </p>
    <blockquote>
      the workshop is not a museum. every stone on the shelf was set there to be picked up.
    </blockquote>
    <p>
      installation is a single line:
    </p>
    <pre>
      <Code block language="bash">{`bun add @4lt7ab/touchstone`}</Code>
    </pre>
    <p>
      then in your entry file, import the stylesheet and the components you need. inline
      code like <Code>vars.color.fg</Code> reads from the active theme.
    </p>
    <hr />
    <h3>further reading</h3>
    <ol>
      <li>the design tenets in CLAUDE.md</li>
      <li>the theme contract</li>
      <li>the storybook for every leaf</li>
    </ol>
  </>
);

export const ReadingDefault: Story = {
  name: 'reading width, comfortable density',
  parameters: {
    docs: {
      description: {
        story:
          'Default. The reading-width clamp keeps paragraphs to ~65ch and the comfortable ' +
          'rhythm gives generous breathing room between blocks.',
      },
    },
  },
  render: () => <Prose>{sampleBody}</Prose>,
};

export const Compact: Story = {
  name: 'density=compact',
  parameters: {
    docs: {
      description: {
        story: 'Compact density tightens vertical rhythm — for in-app drawers and dialogs.',
      },
    },
  },
  render: () => <Prose density="compact">{sampleBody}</Prose>,
};

export const FullWidth: Story = {
  name: 'width=full',
  parameters: {
    docs: {
      description: {
        story: 'No line-length clamp; the prose fills its parent. Pair with a parent column.',
      },
    },
  },
  render: () => <Prose width="full">{sampleBody}</Prose>,
};
