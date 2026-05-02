import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Container,
  Input,
  ProgressBar,
  Stack,
  Surface,
  Text,
} from '@touchstone/atoms';
import { EmptyState, PageHeader, SegmentedControl } from '@touchstone/molecules';
import { vars } from '@touchstone/themes';
import type { Route } from '../App.js';
import {
  buildSnippet,
  categoryById,
  exactSearch,
  formatRelative,
  semanticSearch,
  type SearchHit,
} from '../data/mock.js';

type Mode = 'semantic' | 'exact';

interface SearchPageProps {
  onNavigate: (route: Route) => void;
}

export function SearchPage({ onNavigate }: SearchPageProps) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<Mode>('semantic');

  const hits = useMemo<SearchHit[]>(() => {
    if (!query.trim()) return [];
    return mode === 'semantic' ? semanticSearch(query) : exactSearch(query);
  }, [query, mode]);

  const trimmed = query.trim();
  const maxScore = hits[0]?.score ?? 1;

  return (
    <Container width="wide" padding="lg">
      <Stack direction="column" gap="lg">
        <PageHeader
          title="Knowledge base"
          description="Search the docs the way you'd ask a teammate."
        />

        <Surface level="panel" padding="lg" radius="md">
          <Stack direction="column" gap="md">
            <Stack direction="row" gap="md" align="center" wrap>
              <div style={{ flex: 1, minWidth: 280 }}>
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.currentTarget.value)}
                  placeholder='Try "billing", "lost 2fa", "rate limit"…'
                  aria-label="Search the knowledge base"
                />
              </div>
              <SegmentedControl
                aria-label="Search mode"
                value={mode}
                onValueChange={(v) => setMode(v)}
                options={[
                  { value: 'semantic', label: 'Semantic' },
                  { value: 'exact', label: 'Exact match' },
                ]}
              />
            </Stack>
            <Text size="xs" tone="muted">
              {mode === 'semantic'
                ? 'Term-frequency cosine similarity with synonym expansion.'
                : 'Substring match across title, summary, body, and tags.'}
            </Text>
          </Stack>
        </Surface>

        {!trimmed ? (
          <Stack direction="column" gap="md">
            <Text size="sm" tone="muted">
              {'Tip: try "invoices" or "single sign-on" — semantic mode picks up synonyms.'}
            </Text>
            <Stack direction="row" gap="sm" wrap>
              {['billing', 'lost 2fa', 'rate limit', 'transfer ownership', 'csv export'].map(
                (suggestion) => (
                  <Button
                    key={suggestion}
                    intent="ghost"
                    size="sm"
                    onClick={() => setQuery(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ),
              )}
            </Stack>
          </Stack>
        ) : hits.length === 0 ? (
          <EmptyState level="section">
            <EmptyState.Title>No matches</EmptyState.Title>
            <EmptyState.Description>
              Try a shorter query, switch to {mode === 'semantic' ? 'exact' : 'semantic'} mode, or
              browse by category.
            </EmptyState.Description>
            <EmptyState.Actions>
              <Button intent="secondary" onClick={() => setQuery('')}>
                Clear search
              </Button>
              <Button intent="primary" onClick={() => onNavigate({ name: 'browse' })}>
                Browse categories
              </Button>
            </EmptyState.Actions>
          </EmptyState>
        ) : (
          <Stack direction="column" gap="md">
            <Text size="sm" tone="muted">
              {`${hits.length} result${hits.length === 1 ? '' : 's'} for "${trimmed}"`}
            </Text>
            {hits.map((hit) => {
              const category = categoryById(hit.article.categoryId);
              const relevance = Math.min(100, (hit.score / maxScore) * 100);
              const snippet = buildSnippet(hit.article, trimmed);
              return (
                <Surface key={hit.article.id} level="panel" padding="lg" radius="md">
                  <Stack direction="column" gap="sm">
                    <Stack direction="row" justify="between" align="center" wrap>
                      <Stack direction="column" gap="none">
                        <button
                          type="button"
                          onClick={() =>
                            onNavigate({
                              name: 'article',
                              articleId: hit.article.id,
                            })
                          }
                          style={{
                            all: 'unset',
                            cursor: 'pointer',
                            fontSize: 18,
                            fontWeight: 600,
                            textDecoration: 'underline',
                            textUnderlineOffset: 4,
                            color: vars.color.fg,
                          }}
                        >
                          {hit.article.title}
                        </button>
                        <Text size="xs" tone="muted">
                          {category?.name ?? '—'} · {hit.article.author} · {hit.article.readMinutes}{' '}
                          min read · updated {formatRelative(hit.article.updatedAt)}
                        </Text>
                      </Stack>
                      <Stack direction="column" gap="xs" align="end">
                        <Text size="xs" tone="muted">
                          relevance
                        </Text>
                        <div style={{ minWidth: 140 }}>
                          <ProgressBar
                            size="sm"
                            value={relevance}
                            tone="accent"
                            aria-label={`Relevance ${relevance.toFixed(0)}%`}
                          />
                        </div>
                      </Stack>
                    </Stack>
                    <Text size="sm">
                      <Highlight text={snippet} terms={hit.matchedTerms} />
                    </Text>
                    {hit.matchedTerms.length > 0 && (
                      <Stack direction="row" gap="xs" wrap>
                        {hit.matchedTerms.slice(0, 6).map((term) => (
                          <Badge key={term} tone="accent">
                            {term}
                          </Badge>
                        ))}
                      </Stack>
                    )}
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

interface HighlightProps {
  text: string;
  terms: string[];
}

function Highlight({ text, terms }: HighlightProps) {
  if (terms.length === 0) return <>{text}</>;
  const escaped = terms
    .filter((t) => t.length > 1)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (escaped.length === 0) return <>{text}</>;
  const re = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(re);
  return (
    <>
      {parts.map((part, i) =>
        re.test(part) && i % 2 === 1 ? (
          <mark
            key={i}
            style={{
              background: vars.color.accent,
              color: vars.color.accentFg,
              padding: '0 2px',
              borderRadius: 2,
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
