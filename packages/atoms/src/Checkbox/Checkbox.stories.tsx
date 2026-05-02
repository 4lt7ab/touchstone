import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox.js';
import { Surface } from '../Surface/Surface.js';
import { Text } from '../Text/Text.js';

const meta = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  args: {
    'aria-label': 'mark the seal as struck',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Off: Story = {};

export const On: Story = { args: { defaultChecked: true } };

export const Indeterminate: Story = { args: { indeterminate: true } };

export const Disabled: Story = { args: { disabled: true } };

export const WithLabel: Story = {
  render: () => {
    function Host() {
      const [agreed, setAgreed] = useState(false);
      const labelId = 'terms-label';
      return (
        <Surface
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <Checkbox checked={agreed} onCheckedChange={setAgreed} aria-labelledby={labelId} />
          <Text as="label" id={labelId}>
            {agreed ? 'the maker’s mark is set on the seal.' : 'set the maker’s mark on the seal.'}
          </Text>
        </Surface>
      );
    }
    return <Host />;
  },
};

export const SelectAll: Story = {
  render: () => {
    function Host() {
      const [a, setA] = useState(false);
      const [b, setB] = useState(false);
      const [c, setC] = useState(true);
      const allChecked = a && b && c;
      const noneChecked = !a && !b && !c;
      return (
        <Surface
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <Surface
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <Checkbox
              aria-label="select every entry in the ledger"
              checked={allChecked}
              indeterminate={!allChecked && !noneChecked}
              onCheckedChange={(next) => {
                setA(next);
                setB(next);
                setC(next);
              }}
            />
            <Text as="span">every entry</Text>
          </Surface>
          <Surface
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <Checkbox checked={a} onCheckedChange={setA} aria-label="strike" />
            <Text as="span">strike</Text>
          </Surface>
          <Surface
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <Checkbox checked={b} onCheckedChange={setB} aria-label="anvil" />
            <Text as="span">anvil</Text>
          </Surface>
          <Surface
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <Checkbox checked={c} onCheckedChange={setC} aria-label="kiln" />
            <Text as="span">kiln</Text>
          </Surface>
        </Surface>
      );
    }
    return <Host />;
  },
};
