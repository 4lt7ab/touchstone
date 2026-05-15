import type { Meta, StoryObj } from '@storybook/react';
import remarkGfm from 'remark-gfm';
import { Markdown } from './Markdown.js';

const meta = {
  title: 'Molecules/Markdown',
  component: Markdown,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Markdown reader. Wraps `react-markdown` with a default `components` map ' +
          'that routes `code`/`pre` to the `Code` atom and GFM tables to the `Table` ' +
          'family; everything else is left bare so the surrounding `Prose` styles it. ' +
          'For tables, task-lists, and strikethrough, pass `remarkPlugins={[remarkGfm]}`.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Markdown>;

export default meta;

type Story = StoryObj<typeof meta>;

const longRead = `# the workshop guide

welcome to the bench. each chapter that follows is a rite the apprentice strikes in
lockstep — read first, then take up the hammer.

## the morning ledger

every shelf in the workshop carries a ledger. the entries are written in a single
voice; the seal is set when the day's last apprentice signs the line.

- open the cabinet, set the lamps
- walk the shelves, note any stone out of place
- strike the dye-pot, ready the press

## the afternoon rite

after the morning is sealed, the apprentice may carry a single vessel from the bench
to the cart. the verse for the rite is [written in chapter four](#); consult it
before striking.

> the workshop is not a museum. every stone on the shelf was set there to be picked up.

installation is a single line:

\`\`\`bash
bun add @4lt7ab/touchstone
\`\`\`

then in your entry file, import the stylesheet and the components you need. inline
code like \`vars.color.fg\` reads from the active theme.

---

### further reading

1. the design tenets in CLAUDE.md
2. the theme contract
3. the storybook for every leaf
`;

const gfmTable = `## the apprentice ledger

| name | role       | shelves |
| :--- | :--------: | ------: |
| ada  | apprentice |       3 |
| sam  | journey    |       7 |
| mor  | master     |      12 |

each row is a hand on the bench; the count is the shelves they sealed last week.
`;

const wideTable = `## the bench inventory

| sku       | vessel                          | dye                       | weight | sealed by         | sealed at  | shelf | notes                                            |
| :-------- | :------------------------------ | :------------------------ | -----: | :---------------- | :--------- | ----: | :----------------------------------------------- |
| 001-a-127 | small crucible, banded rim      | indigo, double-dipped     |  1.2kg | ada the apprentice | 2026-03-04 |     3 | reserved for the morning ledger run              |
| 014-b-038 | hammered chalice, twin handles  | madder, single steep      |  2.8kg | sam the journey    | 2026-03-05 |     7 | dye cracked in the kiln; reseal before shipment  |
| 027-c-902 | long-stemmed retort, smoke seal | weld + walnut hull blend  |  0.6kg | mor the master     | 2026-03-06 |    12 | for the chamber-of-mirrors commission            |
| 041-d-441 | ribbed alembic, capped funnel   | walnut hull, three coats  |  3.4kg | ada the apprentice | 2026-03-07 |     1 | the apprentice's first sealed piece              |

the bench keeps a single row per vessel; the shelf number is the apprentice's seat.
`;

export const LongRead: Story = {
  name: 'long-form prose',
  parameters: {
    docs: {
      description: {
        story:
          'The canonical reading shape — headings, paragraphs, lists, blockquote, code, ' +
          'horizontal rule, ordered list — all rendered through the default components ' +
          'map and Prose-styled.',
      },
    },
  },
  render: () => <Markdown>{longRead}</Markdown>,
};

export const GfmTable: Story = {
  name: 'GFM table',
  parameters: {
    docs: {
      description: {
        story:
          'Tables, task-lists, and strikethrough require `remark-gfm` — pass it via ' +
          '`remarkPlugins`. The default components map routes `table` and friends through ' +
          'the `Table` family, honors `:---`/`---:`/`:---:` alignment markers on each ' +
          'column, and wraps the table in an overflow-scrolling box so wide tables ' +
          'don’t get clipped by the surrounding Prose reading clamp.',
      },
    },
  },
  render: () => <Markdown remarkPlugins={[remarkGfm]}>{gfmTable}</Markdown>,
};

export const WideTable: Story = {
  name: 'GFM table — wide (overflow-scrolls inside reading clamp)',
  parameters: {
    docs: {
      description: {
        story:
          'A table that overflows the 65ch reading clamp scrolls horizontally rather than ' +
          'being squashed. The overflow wrapper is internal to `Markdown` — no consumer wiring.',
      },
    },
  },
  render: () => <Markdown remarkPlugins={[remarkGfm]}>{wideTable}</Markdown>,
};

export const Compact: Story = {
  name: 'density=compact',
  parameters: {
    docs: {
      description: {
        story: 'Drawer / dialog density — tighter rhythm, smaller base size.',
      },
    },
  },
  render: () => <Markdown density="compact">{longRead}</Markdown>,
};

export const TextMode: Story = {
  name: 'mode=text (line-clamped preview)',
  parameters: {
    docs: {
      description: {
        story:
          '`mode="text"` strips the markup and emits the inner text content as a single ' +
          '`<span>` — for line-clamped previews in tables, breadcrumbs, snippet excerpts. ' +
          'The same stripping is exposed as `markdownToPlainText`.',
      },
    },
  },
  render: () => (
    <div
      style={{
        width: '32rem',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}
    >
      <Markdown mode="text">{longRead}</Markdown>
    </div>
  ),
};
