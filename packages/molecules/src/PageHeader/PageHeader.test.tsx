import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge, Button } from '@touchstone/atoms';
import { PageHeader } from './PageHeader.js';

describe('PageHeader', () => {
  it('renders the title as an h1 by default', () => {
    render(<PageHeader title="orders for today" />);
    const heading = screen.getByRole('heading', { name: 'orders for today' });
    expect(heading.tagName).toBe('H1');
  });

  it('renders the title at the heading level set by `as`', () => {
    render(<PageHeader as="h2" title="ledger entries" />);
    const heading = screen.getByRole('heading', { name: 'ledger entries' });
    expect(heading.tagName).toBe('H2');
  });

  it('renders description text when provided', () => {
    render(
      <PageHeader
        title="orders"
        description="every strike, in the order it was made."
      />,
    );
    expect(
      screen.getByText('every strike, in the order it was made.'),
    ).toBeInTheDocument();
  });

  it('renders the actions slot', () => {
    render(
      <PageHeader
        title="orders"
        actions={<Button intent="primary">strike</Button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'strike' })).toBeInTheDocument();
  });

  it('renders the meta slot inline with the title', () => {
    render(<PageHeader title="orders" meta={<Badge tone="accent">14</Badge>} />);
    expect(screen.getByText('14')).toBeInTheDocument();
  });

  it('renders the breadcrumbs slot', () => {
    render(
      <PageHeader
        title="orders"
        breadcrumbs={
          <nav aria-label="breadcrumb">
            <a href="/">workshop</a>
          </nav>
        }
      />,
    );
    expect(
      screen.getByRole('navigation', { name: 'breadcrumb' }),
    ).toBeInTheDocument();
  });

  it('wraps the heading in a <header> element', () => {
    const { container } = render(<PageHeader title="orders" />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });
});
