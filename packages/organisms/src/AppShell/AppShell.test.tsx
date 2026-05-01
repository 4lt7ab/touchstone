import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppShell } from './AppShell.js';

describe('AppShell', () => {
  it('renders the main landmark with children', () => {
    render(
      <AppShell>
        <p>page content</p>
      </AppShell>,
    );
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveTextContent('page content');
  });

  it('renders the header and sidebar slots when provided', () => {
    render(
      <AppShell
        header={<header data-testid="bar">bar</header>}
        sidebar={<aside data-testid="rail">rail</aside>}
      >
        <p>page</p>
      </AppShell>,
    );
    expect(screen.getByTestId('bar')).toBeInTheDocument();
    expect(screen.getByTestId('rail')).toBeInTheDocument();
  });

  it('omits header and sidebar slot wrappers when not provided', () => {
    const { container } = render(
      <AppShell>
        <p>page</p>
      </AppShell>,
    );
    // Only the body row + main should render; no header/sidebar wrappers
    expect(container.querySelector('main')).toBeInTheDocument();
    expect(container.querySelectorAll('header')).toHaveLength(0);
  });
});
