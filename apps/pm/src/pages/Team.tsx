import { Badge, Container, Grid, Stack, Surface, Text } from '@touchstone/atoms';
import { PageHeader } from '@touchstone/molecules';
import { people, projects, tasks } from '../data/mock.js';

export function TeamPage() {
  return (
    <Container width="wide" padding="lg">
      <Stack direction="column" gap="lg">
        <PageHeader title="Team" description="Who owns what, and how loaded they are." divider />
        <Grid columns={{ min: 'md' }} gap="md">
          {people.map((person) => {
            const owned = projects.filter((p) => p.ownerId === person.id);
            const assigned = tasks.filter((t) => t.assigneeId === person.id && t.status !== 'done');
            return (
              <Surface key={person.id} level="panel" padding="lg" radius="md">
                <Stack direction="column" gap="md">
                  <Stack direction="row" gap="md" align="center">
                    <Surface
                      level="muted"
                      radius="full"
                      style={{
                        width: 48,
                        height: 48,
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 700,
                        fontSize: 16,
                      }}
                    >
                      {person.initials}
                    </Surface>
                    <Stack direction="column" gap="none">
                      <Text size="lg" weight="semibold">
                        {person.name}
                      </Text>
                      <Text size="sm" tone="muted">
                        {person.role}
                      </Text>
                    </Stack>
                  </Stack>
                  <Stack direction="row" gap="sm" wrap>
                    <Badge tone="accent">
                      {owned.length} project{owned.length === 1 ? '' : 's'}
                    </Badge>
                    <Badge tone="neutral">
                      {assigned.length} open task
                      {assigned.length === 1 ? '' : 's'}
                    </Badge>
                  </Stack>
                  {owned.length > 0 && (
                    <Stack direction="column" gap="xs">
                      <Text size="xs" tone="muted" weight="medium">
                        Leads
                      </Text>
                      {owned.map((p) => (
                        <Text key={p.id} size="sm">
                          {p.name}
                        </Text>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Surface>
            );
          })}
        </Grid>
      </Stack>
    </Container>
  );
}
