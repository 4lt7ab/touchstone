import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown.js';

const DYES = [
  { value: 'iron', label: 'iron-gall black' },
  { value: 'madder', label: 'madder root red' },
  { value: 'woad', label: 'woad blue' },
  { value: 'lichen', label: 'lichen purple' },
  { value: 'saffron', label: 'saffron yellow' },
  { value: 'walnut', label: 'walnut brown' },
];

const meta = {
  title: 'Atoms/Dropdown',
  component: Dropdown,
  args: {
    options: DYES,
    placeholder: 'choose a dye',
    'aria-label': 'dye',
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Single-select form field. A `<select>` replacement with a portalled, ' +
          'keyboard-navigable listbox. Pair with `Field` for label, hint, and error ' +
          'wiring; for typeahead use `Combobox`, for many-of-N use `MultiSelect`.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'madder',
  },
};

export const SizeSmall: Story = {
  args: { size: 'sm' },
};

export const SizeLarge: Story = {
  args: { size: 'lg' },
};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: 'iron' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'iron' },
};

export const WithDisabledOption: Story = {
  args: {
    options: [
      { value: 'iron', label: 'iron-gall black' },
      { value: 'madder', label: 'madder root red' },
      { value: 'cinnabar', label: 'cinnabar (sealed by the master)', disabled: true },
      { value: 'woad', label: 'woad blue' },
    ],
  },
};

export const Empty: Story = {
  args: {
    options: [],
    emptyMessage: 'the dye shelf is bare',
  },
};

export const Grouped: Story = {
  args: {
    options: [
      {
        label: 'Mineral',
        options: [
          { value: 'iron', label: 'iron-gall black' },
          { value: 'cinnabar', label: 'cinnabar' },
        ],
      },
      {
        label: 'Plant',
        options: [
          { value: 'madder', label: 'madder root red' },
          { value: 'woad', label: 'woad blue' },
          { value: 'walnut', label: 'walnut brown' },
        ],
      },
      {
        label: 'Lichen',
        options: [{ value: 'lichen', label: 'lichen purple' }],
      },
    ],
  },
};

export const TypeaheadJump: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Open the listbox (or focus the trigger) and press a letter to jump ' +
          'to the next option whose label begins with that letter. Multiple ' +
          'characters typed within 500ms refine the prefix.',
      },
    },
  },
};

const STATUSES = [
  { value: 'todo', label: 'todo' },
  { value: 'in-progress', label: 'in progress' },
  { value: 'review', label: 'in review' },
  { value: 'done', label: 'done' },
  { value: 'archived', label: 'archived' },
];

export const Badge: Story = {
  args: {
    shape: 'badge',
    options: STATUSES,
    placeholder: 'status',
    defaultValue: 'in-progress',
    'aria-label': 'status',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A compact, pill-shaped trigger borrowing the `Badge` atom’s geometry — for ' +
          'inline filter chips and status pickers. Pair with `tone` to colour the pill; ' +
          'the listbox keeps full keyboard navigation.',
      },
    },
  },
};

export const BadgeTones: Story = {
  args: { shape: 'badge', options: STATUSES, defaultValue: 'in-progress' },
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {(['neutral', 'success', 'warning', 'danger', 'info', 'accent'] as const).map((tone) => (
        <Dropdown key={tone} {...args} tone={tone} aria-label={`status (${tone})`} />
      ))}
    </div>
  ),
};
