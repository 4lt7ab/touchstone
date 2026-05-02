import { useMemo, useState } from 'react';
import { Badge, Button, Container, Grid, Input, Stack, Surface, Text } from '@touchstone/atoms';
import { EmptyState, PageHeader, toast } from '@touchstone/molecules';
import { audiences, deltaTone, formatDelta, formatNumber, formatRelative } from '../data/mock.js';

export function Audiences() {
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return audiences;
    return audiences.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <Container width="wide" padding="lg">
      <Stack direction="column" gap="lg">
        <PageHeader
          title="Audiences"
          description="Segmented cohorts powering targeting and reporting."
          actions={
            <Button intent="primary" onClick={() => toast({ title: 'New audience (mock)' })}>
              New audience
            </Button>
          }
          divider
        />

        <Stack direction="row" gap="md" align="center" wrap>
          <div style={{ flex: 1, maxWidth: 360 }}>
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
              placeholder="Filter by name, source, description"
              aria-label="Filter audiences"
            />
          </div>
          <Text size="sm" tone="muted">
            {visible.length} of {audiences.length}
          </Text>
        </Stack>

        {visible.length === 0 ? (
          <EmptyState level="section">
            <EmptyState.Title>No audiences match</EmptyState.Title>
            <EmptyState.Description>
              Try a shorter search or clear the filter.
            </EmptyState.Description>
            <EmptyState.Actions>
              <Button intent="secondary" onClick={() => setQuery('')}>
                Clear filter
              </Button>
            </EmptyState.Actions>
          </EmptyState>
        ) : (
          <Grid columns={{ min: 'md' }} gap="md">
            {visible.map((a) => (
              <Surface key={a.id} level="panel" padding="lg" radius="md">
                <Stack direction="column" gap="md">
                  <Stack direction="row" justify="between" align="center">
                    <Stack direction="column" gap="none">
                      <Text size="lg" weight="semibold">
                        {a.name}
                      </Text>
                      <Text size="xs" tone="muted">
                        {a.source} · updated {formatRelative(a.updatedAt)}
                      </Text>
                    </Stack>
                    <Badge tone={deltaTone(a.delta)}>{formatDelta(a.delta)}</Badge>
                  </Stack>
                  <Text size="sm" tone="muted">
                    {a.description}
                  </Text>
                  <Stack direction="row" justify="between" align="center">
                    <Text size="2xl" weight="bold">
                      {formatNumber(a.size)}
                    </Text>
                    <Text size="xs" tone="muted">
                      members
                    </Text>
                  </Stack>
                  <Stack direction="row" gap="sm" justify="end">
                    <Button intent="ghost" size="sm">
                      Preview
                    </Button>
                    <Button intent="secondary" size="sm">
                      Open
                    </Button>
                  </Stack>
                </Stack>
              </Surface>
            ))}
          </Grid>
        )}
      </Stack>
    </Container>
  );
}
