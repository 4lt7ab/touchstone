import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Container } from './Container.js';

describe('Container', () => {
  it('renders children inside a div by default', () => {
    render(<Container data-testid="c">the bench</Container>);
    const el = screen.getByTestId('c');
    expect(el.tagName).toBe('DIV');
    expect(el.textContent).toBe('the bench');
  });

  it('renders the element set by `as`', () => {
    render(
      <Container as="main" data-testid="c">
        a chapter
      </Container>,
    );
    expect(screen.getByTestId('c').tagName).toBe('MAIN');
  });

  it('forwards id and data-testid', () => {
    render(
      <Container id="hold" data-testid="hold">
        held
      </Container>,
    );
    const el = screen.getByTestId('hold');
    expect(el.id).toBe('hold');
  });
});
