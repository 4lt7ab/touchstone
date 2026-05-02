import { Badge, Container, Grid, Stack, Surface, Text } from '@touchstone/atoms';
import { PageHeader } from '@touchstone/molecules';
import type { Route } from '../App.js';
import { articlesByCategory, categories } from '../data/mock.js';
import { CategoryIcon } from '../shell/icons.js';

interface BrowsePageProps {
  onNavigate: (route: Route) => void;
}

export function BrowsePage({ onNavigate }: BrowsePageProps) {
  return (
    <Container width="wide" padding="lg">
      <Stack direction="column" gap="lg">
        <PageHeader
          title="Browse the docs"
          description="Five sections, twenty-five articles, one search box that finds them all."
          divider
        />
        <Grid columns={{ min: 'md' }} gap="md">
          {categories.map((c) => {
            const count = articlesByCategory(c.id).length;
            return (
              <Surface
                key={c.id}
                level="panel"
                padding="lg"
                radius="md"
                style={{ cursor: 'pointer' }}
                onClick={() => onNavigate({ name: 'category', categoryId: c.id })}
              >
                <Stack direction="column" gap="md">
                  <Stack direction="row" gap="md" align="center">
                    <Surface
                      level="muted"
                      radius="md"
                      style={{
                        width: 40,
                        height: 40,
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <CategoryIcon kind={c.icon} />
                    </Surface>
                    <Stack direction="column" gap="none">
                      <Text size="lg" weight="semibold">
                        {c.name}
                      </Text>
                      <Text size="xs" tone="muted">
                        {count} article{count === 1 ? '' : 's'}
                      </Text>
                    </Stack>
                  </Stack>
                  <Text size="sm" tone="muted">
                    {c.description}
                  </Text>
                  <Stack direction="row" gap="xs" wrap>
                    {articlesByCategory(c.id)
                      .slice(0, 3)
                      .map((a) => (
                        <Badge key={a.id} tone="neutral">
                          {a.title}
                        </Badge>
                      ))}
                  </Stack>
                </Stack>
              </Surface>
            );
          })}
        </Grid>
      </Stack>
    </Container>
  );
}
