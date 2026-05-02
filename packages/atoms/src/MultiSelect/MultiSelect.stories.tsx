import type { Meta, StoryObj } from '@storybook/react';
import { MultiSelect } from './MultiSelect.js';

const TOOLS = [
  { value: 'hammer', label: 'hammer' },
  { value: 'anvil', label: 'anvil' },
  { value: 'tongs', label: 'tongs' },
  { value: 'mould', label: 'mould' },
  { value: 'crucible', label: 'crucible' },
  { value: 'bellows', label: 'bellows' },
];

const meta = {
  title: 'Atoms/MultiSelect',
  component: MultiSelect,
  args: {
    options: TOOLS,
    placeholder: 'pack the bench',
    'aria-label': 'tools',
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Multi-value form field. Selecting an option toggles it; the listbox stays open ' +
          'so consecutive selections are cheap. The trigger renders a single-line summary ' +
          '("anvil +3"); to remove an arbitrary value, open the listbox and uncheck it. ' +
          'Backspace on the closed trigger removes the most recently added value.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithDefaults: Story = {
  args: {
    defaultValue: ['hammer', 'tongs', 'bellows'],
  },
};

export const SizeSmall: Story = {
  args: { size: 'sm' },
};

export const SizeLarge: Story = {
  args: { size: 'lg' },
};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: ['hammer'] },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: ['hammer', 'anvil'] },
};

export const WithDisabledOption: Story = {
  args: {
    options: [
      { value: 'hammer', label: 'hammer' },
      { value: 'anvil', label: 'anvil' },
      { value: 'crucible', label: 'crucible (sealed by the master)', disabled: true },
      { value: 'tongs', label: 'tongs' },
    ],
  },
};

export const RemovableChips: Story = {
  args: { defaultValue: ['hammer', 'tongs', 'bellows'] },
  parameters: {
    docs: {
      description: {
        story:
          'Selected values render as chips inside the trigger. The × on each chip ' +
          'removes that value (mouse only — chip remove buttons are out of the tab ' +
          'order). Backspace on the closed trigger removes the most recently added.',
      },
    },
  },
};

export const WithSelectAll: Story = {
  args: {
    selectAll: true,
    defaultValue: ['hammer'],
  },
  parameters: {
    docs: {
      description: {
        story:
          'A "Select all" row at the top of the listbox toggles between every ' +
          'enabled value selected and none. Reads as `aria-checked="mixed"` when ' +
          'a partial selection is present.',
      },
    },
  },
};

export const Grouped: Story = {
  args: {
    options: [
      {
        label: 'Striking',
        options: [
          { value: 'hammer', label: 'hammer' },
          { value: 'anvil', label: 'anvil' },
        ],
      },
      {
        label: 'Holding',
        options: [
          { value: 'tongs', label: 'tongs' },
          { value: 'mould', label: 'mould' },
        ],
      },
      {
        label: 'Heat',
        options: [
          { value: 'crucible', label: 'crucible' },
          { value: 'bellows', label: 'bellows' },
        ],
      },
    ],
    selectAll: true,
  },
};
