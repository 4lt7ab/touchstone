import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DetailPage } from './DetailPage.js';

describe('DetailPage', () => {
  it('renders the title as h1 by default', () => {
    render(
      <DetailPage>
        <DetailPage.Header title="Invoice INV-001" />
      </DetailPage>,
    );
    const heading = screen.getByRole('heading', { name: 'Invoice INV-001' });
    expect(heading.tagName).toBe('H1');
  });

  it('renders the subtitle when provided', () => {
    render(
      <DetailPage>
        <DetailPage.Header title="Invoice" subtitle="Acme Corp" />
      </DetailPage>,
    );
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });

  it('renders Meta as a description list', () => {
    render(
      <DetailPage>
        <DetailPage.Header title="Invoice" />
        <DetailPage.Meta>
          <DetailPage.MetaItem label="Status">Paid</DetailPage.MetaItem>
          <DetailPage.MetaItem label="Amount">$420</DetailPage.MetaItem>
        </DetailPage.Meta>
      </DetailPage>,
    );
    const dl = screen.getByText('Paid').closest('dl');
    expect(dl).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('$420')).toBeInTheDocument();
  });

  it('portals Actions into the Header trailing slot', () => {
    render(
      <DetailPage>
        <DetailPage.Header title="Invoice" />
        <DetailPage.Body>body</DetailPage.Body>
        <DetailPage.Actions>
          <button type="button">edit</button>
        </DetailPage.Actions>
      </DetailPage>,
    );
    const button = screen.getByRole('button', { name: 'edit' });
    const slot = button.closest('[data-detailpage-actions-slot]');
    expect(slot).not.toBeNull();
  });

  it('renders the right panel when provided', () => {
    render(
      <DetailPage>
        <DetailPage.Header title="Invoice" />
        <DetailPage.Body>body</DetailPage.Body>
        <DetailPage.RightPanel aria-label="related">
          <span>related entries</span>
        </DetailPage.RightPanel>
      </DetailPage>,
    );
    expect(screen.getByRole('complementary', { name: 'related' })).toBeInTheDocument();
    expect(screen.getByText('related entries')).toBeInTheDocument();
  });

  it('throws when a part is rendered outside DetailPage', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<DetailPage.Header title="orphan" />)).toThrow(
      /must be rendered inside <DetailPage>/,
    );
    error.mockRestore();
  });
});
