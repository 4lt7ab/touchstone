import { Badge, Button, Container, Divider, Stack, Surface, Text } from '@touchstone/atoms';
import { Breadcrumbs, EmptyState, toast } from '@touchstone/molecules';
import { DetailPage } from '@touchstone/organisms';
import type { Route } from '../App.js';
import {
  articleById,
  categoryById,
  formatDate,
  formatRelative,
  relatedArticles,
} from '../data/mock.js';

interface ArticlePageProps {
  articleId: string;
  onNavigate: (route: Route) => void;
}

export function ArticlePage({ articleId, onNavigate }: ArticlePageProps) {
  const article = articleById(articleId);

  if (!article) {
    return (
      <Container width="wide" padding="lg">
        <EmptyState level="page">
          <EmptyState.Title>Article not found</EmptyState.Title>
          <EmptyState.Description>
            {"The article you were looking for doesn't exist."}
          </EmptyState.Description>
          <EmptyState.Actions>
            <Button onClick={() => onNavigate({ name: 'browse' })}>Browse categories</Button>
            <Button intent="primary" onClick={() => onNavigate({ name: 'search' })}>
              Search
            </Button>
          </EmptyState.Actions>
        </EmptyState>
      </Container>
    );
  }

  const category = categoryById(article.categoryId);
  const related = relatedArticles(articleId);

  return (
    <Container width="wide" padding="lg">
      <Stack direction="column" gap="md">
        <Breadcrumbs>
          <Breadcrumbs.Item asChild>
            <button
              type="button"
              onClick={() => onNavigate({ name: 'search' })}
              style={{ all: 'unset', cursor: 'pointer' }}
            >
              Search
            </button>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item asChild>
            <button
              type="button"
              onClick={() => onNavigate({ name: 'browse' })}
              style={{ all: 'unset', cursor: 'pointer' }}
            >
              Browse
            </button>
          </Breadcrumbs.Item>
          {category && (
            <Breadcrumbs.Item asChild>
              <button
                type="button"
                onClick={() => onNavigate({ name: 'category', categoryId: category.id })}
                style={{ all: 'unset', cursor: 'pointer' }}
              >
                {category.name}
              </button>
            </Breadcrumbs.Item>
          )}
          <Breadcrumbs.Item current>{article.title}</Breadcrumbs.Item>
        </Breadcrumbs>

        <DetailPage>
          <DetailPage.Header title={article.title} subtitle={article.summary} />
          <DetailPage.Actions>
            <Stack direction="row" gap="sm">
              <Button
                intent="ghost"
                onClick={() => toast({ title: 'Link copied (mock)', tone: 'success' })}
              >
                Copy link
              </Button>
              <Button
                intent="primary"
                onClick={() => toast({ title: 'Thanks for the feedback!', tone: 'success' })}
              >
                Helpful
              </Button>
            </Stack>
          </DetailPage.Actions>

          <DetailPage.Meta>
            <DetailPage.MetaItem label="Category">{category?.name ?? '—'}</DetailPage.MetaItem>
            <DetailPage.MetaItem label="Author">{article.author}</DetailPage.MetaItem>
            <DetailPage.MetaItem label="Updated">
              {formatDate(article.updatedAt)}
            </DetailPage.MetaItem>
            <DetailPage.MetaItem label="Read">{article.readMinutes} min</DetailPage.MetaItem>
          </DetailPage.Meta>

          <DetailPage.Body>
            <Stack direction="column" gap="md">
              <Surface level="panel" padding="lg" radius="md">
                <Stack direction="column" gap="sm">
                  <Text size="md" tone="muted">
                    {article.summary}
                  </Text>
                  <Divider />
                  <Text>{article.body}</Text>
                </Stack>
              </Surface>
              <Stack direction="row" gap="xs" wrap>
                {article.tags.map((tag) => (
                  <Badge key={tag} tone="neutral">
                    {tag}
                  </Badge>
                ))}
              </Stack>
            </Stack>
          </DetailPage.Body>

          <DetailPage.RightPanel aria-label="Related articles">
            <Stack direction="column" gap="md">
              <Surface level="panel" padding="md" radius="md">
                <Stack direction="column" gap="sm">
                  <Text size="sm" weight="semibold" tone="muted">
                    Related
                  </Text>
                  {related.length === 0 ? (
                    <Text size="sm" tone="muted">
                      No related articles yet.
                    </Text>
                  ) : (
                    related.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => onNavigate({ name: 'article', articleId: r.id })}
                        style={{
                          all: 'unset',
                          cursor: 'pointer',
                          display: 'block',
                        }}
                      >
                        <Stack direction="column" gap="none">
                          <Text size="sm" weight="medium">
                            {r.title}
                          </Text>
                          <Text size="xs" tone="muted">
                            {categoryById(r.categoryId)?.name} · {formatRelative(r.updatedAt)}
                          </Text>
                        </Stack>
                      </button>
                    ))
                  )}
                </Stack>
              </Surface>
              <Surface level="panel" padding="md" radius="md">
                <Stack direction="column" gap="sm">
                  <Text size="sm" weight="semibold" tone="muted">
                    Need more help?
                  </Text>
                  <Text size="sm" tone="muted">
                    {"If this didn't answer your question, search the docs or open a ticket."}
                  </Text>
                  <Button
                    intent="secondary"
                    size="sm"
                    onClick={() => onNavigate({ name: 'search' })}
                  >
                    Search again
                  </Button>
                </Stack>
              </Surface>
            </Stack>
          </DetailPage.RightPanel>
        </DetailPage>
      </Stack>
    </Container>
  );
}
