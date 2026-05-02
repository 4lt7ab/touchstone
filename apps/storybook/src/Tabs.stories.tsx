import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Stack, Surface, Text } from '@touchstone/atoms';
import { Field, PageHeader } from '@touchstone/molecules';
import { Tabs } from '@touchstone/organisms';

const meta = {
  title: 'Organisms/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'WAI-ARIA tablist / tabpanel pair for switching between views inside ' +
          'a page — settings sub-pages, profile sections, "Overview / Activity" ' +
          'sub-nav. Manual activation: arrow keys move focus across triggers, ' +
          'but selection only happens on click / Enter / Space. For one-of-N ' +
          'selection without panel switching, use `SegmentedControl`.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Tabs defaultValue="profile">
      <Tabs.List aria-label="account sections">
        <Tabs.Trigger value="profile">profile</Tabs.Trigger>
        <Tabs.Trigger value="security">security</Tabs.Trigger>
        <Tabs.Trigger value="ledger">ledger</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="profile">
        <Stack gap="md">
          <Field label="name on the ledger" defaultValue="apprentice" />
          <Field label="bench number" defaultValue="3" />
        </Stack>
      </Tabs.Panel>
      <Tabs.Panel value="security">
        <Stack gap="md">
          <Field
            label="the word that opens the door"
            type="password"
            placeholder="the one only the master and you know"
          />
          <Field label="strike count" defaultValue="14 stone" />
        </Stack>
      </Tabs.Panel>
      <Tabs.Panel value="ledger">
        <Stack gap="sm">
          <Text>seven entries this week, all sealed.</Text>
          <Text size="sm" tone="muted">
            the master's hand is kind to the bench that keeps its rhythm.
          </Text>
        </Stack>
      </Tabs.Panel>
    </Tabs>
  ),
};

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="profile">
      <Tabs.List aria-label="account sections">
        <Tabs.Trigger value="profile">profile</Tabs.Trigger>
        <Tabs.Trigger value="security">security</Tabs.Trigger>
        <Tabs.Trigger value="audit" disabled>
          audit
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="profile">profile body</Tabs.Panel>
      <Tabs.Panel value="security">security body</Tabs.Panel>
      <Tabs.Panel value="audit">audit body</Tabs.Panel>
    </Tabs>
  ),
};

export const SmallSize: Story = {
  render: () => (
    <Tabs defaultValue="day">
      <Tabs.List aria-label="window">
        <Tabs.Trigger value="day" size="sm">
          day
        </Tabs.Trigger>
        <Tabs.Trigger value="week" size="sm">
          week
        </Tabs.Trigger>
        <Tabs.Trigger value="month" size="sm">
          month
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="day">a single sweep of the bench.</Tabs.Panel>
      <Tabs.Panel value="week">seven days of marks.</Tabs.Panel>
      <Tabs.Panel value="month">the whole great ledger.</Tabs.Panel>
    </Tabs>
  ),
};

export const UnderPageHeader: Story = {
  name: 'under PageHeader — settings sub-nav',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'The intended composition: page sub-navigation under a `PageHeader`. ' +
          'Each tab swaps the body without changing the URL surface or the ' +
          'top-level nav.',
      },
    },
  },
  render: () => (
    <Surface level="page" style={{ minHeight: '40rem', padding: '1.5rem' }}>
      <Stack gap="md">
        <PageHeader
          title="account"
          description="the apprentice's name on the lid, the workshop's name underneath."
          meta={<Badge tone="success">sealed</Badge>}
        />
        <Tabs defaultValue="profile">
          <Tabs.List aria-label="account sections">
            <Tabs.Trigger value="profile">profile</Tabs.Trigger>
            <Tabs.Trigger value="security">security</Tabs.Trigger>
            <Tabs.Trigger value="ledger">ledger</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Panel value="profile">
            <Surface level="raised" radius="lg" padding="lg">
              <Stack gap="md">
                <Field label="name on the ledger" defaultValue="apprentice" />
                <Field label="bench number" defaultValue="3" />
              </Stack>
            </Surface>
          </Tabs.Panel>
          <Tabs.Panel value="security">
            <Surface level="raised" radius="lg" padding="lg">
              <Stack gap="md">
                <Field
                  label="the word that opens the door"
                  type="password"
                  placeholder="the one only the master and you know"
                />
              </Stack>
            </Surface>
          </Tabs.Panel>
          <Tabs.Panel value="ledger">
            <Surface level="raised" radius="lg" padding="lg">
              <Text>seven entries this week, all sealed.</Text>
            </Surface>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Surface>
  ),
};
