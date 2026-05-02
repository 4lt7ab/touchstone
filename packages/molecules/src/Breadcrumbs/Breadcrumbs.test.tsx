import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Breadcrumbs } from './Breadcrumbs.js';

describe('Breadcrumbs', () => {
  it('renders as a navigation landmark with the default label', () => {
    render(
      <Breadcrumbs>
        <Breadcrumbs.Item current>orders</Breadcrumbs.Item>
      </Breadcrumbs>,
    );
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument();
  });

  it('forwards a custom aria-label', () => {
    render(
      <Breadcrumbs aria-label="page hierarchy">
        <Breadcrumbs.Item current>orders</Breadcrumbs.Item>
      </Breadcrumbs>,
    );
    expect(screen.getByRole('navigation', { name: 'page hierarchy' })).toBeInTheDocument();
  });

  it('renders an ordered list of items', () => {
    render(
      <Breadcrumbs>
        <Breadcrumbs.Item asChild>
          <a href="/">workshop</a>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item asChild>
          <a href="/ledger">ledger</a>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>orders</Breadcrumbs.Item>
      </Breadcrumbs>,
    );
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(list.children).toHaveLength(3);
  });

  it('marks the current item with aria-current="page"', () => {
    render(
      <Breadcrumbs>
        <Breadcrumbs.Item asChild>
          <a href="/">workshop</a>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>orders</Breadcrumbs.Item>
      </Breadcrumbs>,
    );
    const current = screen.getByText('orders');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current.tagName).toBe('SPAN');
  });

  it('forwards links via asChild', () => {
    render(
      <Breadcrumbs>
        <Breadcrumbs.Item asChild>
          <a href="/ledger">ledger</a>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>orders</Breadcrumbs.Item>
      </Breadcrumbs>,
    );
    const link = screen.getByRole('link', { name: 'ledger' });
    expect(link).toHaveAttribute('href', '/ledger');
    expect(link.className).not.toBe('');
  });

  it('returns null for an asChild item with no element child', () => {
    const { container } = render(
      <Breadcrumbs>
        <Breadcrumbs.Item asChild>just text</Breadcrumbs.Item>
        <Breadcrumbs.Item current>orders</Breadcrumbs.Item>
      </Breadcrumbs>,
    );
    expect(container.querySelectorAll('li')).toHaveLength(1);
  });

  it('renders a non-current, non-asChild item as plain text', () => {
    render(
      <Breadcrumbs>
        <Breadcrumbs.Item>workshop</Breadcrumbs.Item>
        <Breadcrumbs.Item current>orders</Breadcrumbs.Item>
      </Breadcrumbs>,
    );
    const span = screen.getByText('workshop');
    expect(span.tagName).toBe('SPAN');
    expect(span).not.toHaveAttribute('aria-current');
  });
});
