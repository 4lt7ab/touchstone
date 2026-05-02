import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Surface, Text } from '@touchstone/atoms';
import { ThemeSwitcher } from './ThemeSwitcher.js';

const OPTIONS = [
  { key: 'warm-sand', label: 'Warm sand' },
  { key: 'slate', label: 'Slate' },
  { key: 'moss', label: 'Moss' },
  { key: 'coral', label: 'Coral' },
  { key: 'synthwave', label: 'Synthwave' },
  { key: 'terminal', label: 'Terminal' },
];

const meta = {
  title: 'Organisms/ThemeSwitcher',
  component: ThemeSwitcher,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A drop-in palette picker. Pass the catalogue of themes and the ' +
          'currently selected key; receive the new key on change. The ' +
          'apprentice no longer rebuilds this menu in every app.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;

type Story = StoryObj<typeof meta>;

function DefaultDemo(): React.JSX.Element {
  const [value, setValue] = useState('warm-sand');
  return (
    <Surface padding="md" radius="md" level="panel">
      <Stack direction="row" align="center" gap="md">
        <ThemeSwitcher options={OPTIONS} value={value} onChange={setValue} />
        <Text size="sm" tone="muted">
          current: {value}
        </Text>
      </Stack>
    </Surface>
  );
}

function CustomLabelDemo(): React.JSX.Element {
  const [value, setValue] = useState('moss');
  return <ThemeSwitcher options={OPTIONS} value={value} onChange={setValue} label="Palette" />;
}

export const Default: Story = { render: () => <DefaultDemo /> };

export const WithCustomLabel: Story = { render: () => <CustomLabelDemo /> };
