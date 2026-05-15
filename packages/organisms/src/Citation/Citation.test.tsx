import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Citation, CitationList } from './Citation.js';

describe('Citation', () => {
  it('renders the marker with the index by default', () => {
    render(<Citation index={3} title="A source" />);
    expect(screen.getByRole('button', { name: 'Source 3' })).toHaveTextContent('3');
  });

  it('opens the popover on click', async () => {
    const user = userEvent.setup();
    render(<Citation index={1} title="docs/architecture.md" snippet="layer rules" />);
    await user.click(screen.getByRole('button', { name: 'Source 1' }));
    expect(screen.getByText('docs/architecture.md')).toBeInTheDocument();
    expect(screen.getByText('layer rules')).toBeInTheDocument();
  });
});

describe('CitationList', () => {
  it('renders each item with its index', () => {
    render(
      <CitationList
        items={[
          { index: 1, title: 'a.md' },
          { index: 2, title: 'b.md', snippet: 'second one' },
        ]}
      />,
    );
    expect(screen.getByText('a.md')).toBeInTheDocument();
    expect(screen.getByText('b.md')).toBeInTheDocument();
    expect(screen.getByText('[1]')).toBeInTheDocument();
    expect(screen.getByText('[2]')).toBeInTheDocument();
  });
});
