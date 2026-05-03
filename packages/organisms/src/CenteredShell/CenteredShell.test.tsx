import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CenteredShell } from './CenteredShell.js';

describe('CenteredShell', () => {
  it('renders the Card slot inside a labelled <main> landmark', () => {
    render(
      <CenteredShell>
        <CenteredShell.Card aria-label="sign in">
          <p>card content</p>
        </CenteredShell.Card>
      </CenteredShell>,
    );
    const main = screen.getByRole('main', { name: 'sign in' });
    expect(main).toBeInTheDocument();
    expect(main).toHaveTextContent('card content');
  });

  it('renders the Brand slot above the card when provided', () => {
    render(
      <CenteredShell>
        <CenteredShell.Brand>Acme</CenteredShell.Brand>
        <CenteredShell.Card aria-label="sign in">card</CenteredShell.Card>
      </CenteredShell>,
    );
    expect(screen.getByText('Acme')).toBeInTheDocument();
  });

  it('renders the Footer slot inside a contentinfo landmark when provided', () => {
    render(
      <CenteredShell>
        <CenteredShell.Card aria-label="sign in">card</CenteredShell.Card>
        <CenteredShell.Footer>v1.2.3</CenteredShell.Footer>
      </CenteredShell>,
    );
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveTextContent('v1.2.3');
  });

  it('omits Brand and Footer wrappers when not provided', () => {
    const { container } = render(
      <CenteredShell>
        <CenteredShell.Card aria-label="sign in">card</CenteredShell.Card>
      </CenteredShell>,
    );
    expect(container.querySelector('footer')).toBeNull();
    expect(screen.queryByRole('contentinfo')).toBeNull();
  });
});
