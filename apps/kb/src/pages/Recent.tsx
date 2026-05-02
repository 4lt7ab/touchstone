import { Badge, Button, Container, Stack, Surface, Text } from '@touchstone/atoms';
import { EmptyState, PageHeader } from '@touchstone/molecules';
import type { Route } from '../App.js';
import { articleById, categoryById, formatRelative } from '../data/mock.js';

interface RecentPageProps {
  recent: string[];
  onNavigate: (route: Route) => void;
}

export function RecentPage({ recent, onNavigate }: RecentPageProps) {
  return (
    <Container width="wide" padding="lg">
      <Stack direction="column" gap="lg">
        <PageHeader
          title="Recently viewed"
          description="The last articles you opened in this session."
          divider
        />

        {recent.length === 0 ? (
          <EmptyState level="section">
            <EmptyState.Title>Nothing here yet</EmptyState.Title>
            <EmptyState.Description>
              {"Open an article from search or browse and it'll show up here."}
            </EmptyState.Description>
            <EmptyState.Actions>
              <Button intent="secondary" onClick={() => onNavigate({ name: 'browse' })}>
                Browse
              </Button>
              <Button intent="primary" onClick={() => onNavigate({ name: 'search' })}>
                Search
              </Button>
            </EmptyState.Actions>
          </EmptyState>
        ) : (
          <Stack direction="column" gap="md">
            {recent.map((id) => {
              const article = articleById(id);
              if (!article) return null;
              const category = categoryById(article.categoryId);
              return (
                <Surface
                  key={id}
                  level="panel"
                  padding="lg"
                  radius="md"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onNavigate({ name: 'article', articleId: id })}
                >
                  <Stack direction="column" gap="sm">
                    <Stack direction="row" justify="between" align="center">
                      <Text size="lg" weight="semibold">
                        {article.title}
                      </Text>
                      <Text size="xs" tone="muted">
                        {formatRelative(article.updatedAt)}
                      </Text>
                    </Stack>
                    <Text size="sm" tone="muted">
                      {article.summary}
                    </Text>
                    <Stack direction="row" gap="xs" wrap>
                      {category && <Badge tone="accent">{category.name}</Badge>}
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} tone="neutral">
                          {tag}
                        </Badge>
                      ))}
                    </Stack>
                  </Stack>
                </Surface>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
