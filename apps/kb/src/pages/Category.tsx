import { useState } from 'react';
import { Badge, Button, Container, Stack, Surface, Text } from '@touchstone/atoms';
import { Breadcrumbs, EmptyState, PageHeader, Pagination } from '@touchstone/molecules';
import type { Route } from '../App.js';
import { articlesByCategory, categoryById, formatRelative } from '../data/mock.js';
import { CategoryIcon } from '../shell/icons.js';

const PAGE_SIZE = 6;

interface CategoryPageProps {
  categoryId: string;
  onNavigate: (route: Route) => void;
}

export function CategoryPage({ categoryId, onNavigate }: CategoryPageProps) {
  const category = categoryById(categoryId);
  const [page, setPage] = useState(1);

  if (!category) {
    return (
      <Container width="wide" padding="lg">
        <EmptyState level="page">
          <EmptyState.Title>Category not found</EmptyState.Title>
          <EmptyState.Description>
            {"The category you were looking for doesn't exist."}
          </EmptyState.Description>
          <EmptyState.Actions>
            <Button onClick={() => onNavigate({ name: 'browse' })}>Back to browse</Button>
          </EmptyState.Actions>
        </EmptyState>
      </Container>
    );
  }

  const all = articlesByCategory(categoryId);
  const pageCount = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = all.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <Container width="wide" padding="lg">
      <Stack direction="column" gap="lg">
        <Breadcrumbs>
          <Breadcrumbs.Item asChild>
            <button
              type="button"
              onClick={() => onNavigate({ name: 'browse' })}
              style={{ all: 'unset', cursor: 'pointer' }}
            >
              Browse
            </button>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item current>{category.name}</Breadcrumbs.Item>
        </Breadcrumbs>

        <PageHeader
          title={category.name}
          description={category.description}
          meta={
            <Stack direction="row" gap="sm" align="center">
              <CategoryIcon kind={category.icon} />
              <Text size="xs" tone="muted">
                {all.length} article{all.length === 1 ? '' : 's'}
              </Text>
            </Stack>
          }
          divider
        />

        <Stack direction="column" gap="md">
          {visible.map((a) => (
            <Surface
              key={a.id}
              level="panel"
              padding="lg"
              radius="md"
              style={{ cursor: 'pointer' }}
              onClick={() => onNavigate({ name: 'article', articleId: a.id })}
            >
              <Stack direction="column" gap="sm">
                <Stack direction="row" justify="between" align="center">
                  <Text size="lg" weight="semibold">
                    {a.title}
                  </Text>
                  <Text size="xs" tone="muted">
                    {a.readMinutes} min · {formatRelative(a.updatedAt)}
                  </Text>
                </Stack>
                <Text size="sm" tone="muted">
                  {a.summary}
                </Text>
                <Stack direction="row" gap="xs" wrap>
                  {a.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} tone="neutral">
                      {tag}
                    </Badge>
                  ))}
                </Stack>
              </Stack>
            </Surface>
          ))}
        </Stack>

        {pageCount > 1 && (
          <Stack direction="row" justify="between" align="center">
            <Text size="sm" tone="muted">
              Page {safePage} of {pageCount}
            </Text>
            <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
