import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from './Combobox.js';

const SCROLLS = [
  { value: 'iron-gall-recipe', label: 'iron-gall recipe' },
  { value: 'madder-bath', label: 'madder bath instructions' },
  { value: 'woad-fermentation', label: 'woad fermentation rite' },
  { value: 'lichen-dye-notes', label: 'lichen dye notes' },
  { value: 'saffron-yield', label: 'saffron yield ledger' },
  { value: 'walnut-staining', label: 'walnut staining method' },
  { value: 'mordant-table', label: 'mordant ratios table' },
  { value: 'colorfastness', label: 'colorfastness trials' },
];

const meta = {
  title: 'Atoms/Combobox',
  component: Combobox,
  args: {
    options: SCROLLS,
    placeholder: 'search the shelf…',
    'aria-label': 'scroll',
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Typeable single-select. Substring filtering (case-insensitive) by default; ' +
          'pass a `filter` to override. The selected option fills the input on choose; ' +
          'on blur without a fresh selection the input reverts to the selected label.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithDefaultValue: Story = {
  args: { defaultValue: 'madder-bath' },
};

export const SizeSmall: Story = {
  args: { size: 'sm' },
};

export const SizeLarge: Story = {
  args: { size: 'lg' },
};

export const Invalid: Story = {
  args: { invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'iron-gall-recipe' },
};

export const NoMatches: Story = {
  args: { emptyMessage: 'no scroll matches that mark' },
};

export const Grouped: Story = {
  args: {
    options: [
      {
        label: 'Recipes',
        options: [
          { value: 'iron-gall-recipe', label: 'iron-gall recipe' },
          { value: 'madder-bath', label: 'madder bath instructions' },
          { value: 'woad-fermentation', label: 'woad fermentation rite' },
        ],
      },
      {
        label: 'Notes',
        options: [
          { value: 'lichen-dye-notes', label: 'lichen dye notes' },
          { value: 'mordant-table', label: 'mordant ratios table' },
        ],
      },
      {
        label: 'Trials',
        options: [
          { value: 'colorfastness', label: 'colorfastness trials' },
          { value: 'saffron-yield', label: 'saffron yield ledger' },
        ],
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Filtering respects groups: empty groups drop out as the user narrows ' +
          'the query. Try typing "fa" to see only Trials remain.',
      },
    },
  },
};
