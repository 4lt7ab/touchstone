import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Button, Stack, Surface, Text } from '@touchstone/atoms';
import { DetailPage } from './DetailPage.js';

const meta = {
  title: 'Organisms/DetailPage',
  component: DetailPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Entity-detail page envelope. Drops inside `AppShell.Main`. ' +
          '`DetailPage.Actions` is portaled into the header trailing slot — ' +
          'declared inline with the body, lands in the header DOM.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Surface level="page" style={{ minHeight: '100vh', padding: '2rem' }}>
        <Story />
      </Surface>
    ),
  ],
} satisfies Meta<typeof DetailPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Full: Story = {
  name: 'full — every part',
  render: () => (
    <DetailPage>
      <DetailPage.Header title="Invoice INV-001" subtitle="Acme Corp" />

      <DetailPage.Meta>
        <DetailPage.MetaItem label="Status">
          <Badge tone="success">Paid</Badge>
        </DetailPage.MetaItem>
        <DetailPage.MetaItem label="Amount">$4,200.00</DetailPage.MetaItem>
        <DetailPage.MetaItem label="Issued">2 days past</DetailPage.MetaItem>
        <DetailPage.MetaItem label="Due">last week</DetailPage.MetaItem>
      </DetailPage.Meta>

      <DetailPage.Body>
        <Surface level="raised" radius="lg" padding="lg">
          <Stack gap="sm">
            <Text size="lg" weight="semibold">
              line items
            </Text>
            <Text>
              every strike of the day, in the order it was made. the master reads top to bottom.
            </Text>
          </Stack>
        </Surface>
        <Surface level="raised" radius="lg" padding="lg">
          <Stack gap="sm">
            <Text size="lg" weight="semibold">
              activity
            </Text>
            <Text tone="muted">the apprentice signed the seal at the end of the day.</Text>
          </Stack>
        </Surface>
      </DetailPage.Body>

      <DetailPage.Actions>
        <Button intent="ghost">cancel</Button>
        <Button intent="primary">edit</Button>
      </DetailPage.Actions>

      <DetailPage.RightPanel aria-label="related entries">
        <Surface level="raised" radius="lg" padding="lg">
          <Stack gap="sm">
            <Text weight="semibold">related</Text>
            <Text size="sm" tone="muted">
              INV-000 — paid
            </Text>
            <Text size="sm" tone="muted">
              CR-014 — open
            </Text>
          </Stack>
        </Surface>
      </DetailPage.RightPanel>
    </DetailPage>
  ),
};

export const NoRightPanel: Story = {
  name: 'no right rail',
  render: () => (
    <DetailPage>
      <DetailPage.Header title="Invoice INV-001" subtitle="Acme Corp" />
      <DetailPage.Meta>
        <DetailPage.MetaItem label="Status">
          <Badge tone="warning">Open</Badge>
        </DetailPage.MetaItem>
        <DetailPage.MetaItem label="Amount">$1,200.00</DetailPage.MetaItem>
      </DetailPage.Meta>
      <DetailPage.Body>
        <Surface level="raised" radius="lg" padding="lg">
          <Text>without a right rail, the body fills the column.</Text>
        </Surface>
      </DetailPage.Body>
      <DetailPage.Actions>
        <Button intent="primary">mark as paid</Button>
      </DetailPage.Actions>
    </DetailPage>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <DetailPage>
      <DetailPage.Header title="Invoice INV-001" />
      <DetailPage.Body>
        <Surface level="raised" radius="lg" padding="lg">
          <Text>a bare detail page — heading and body only.</Text>
        </Surface>
      </DetailPage.Body>
    </DetailPage>
  ),
};
