import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Grid } from './Grid.js';

describe('Grid', () => {
  it('renders a div by default with display:grid', () => {
    render(
      <Grid data-testid="g">
        <span>one</span>
      </Grid>,
    );
    const el = screen.getByTestId('g');
    expect(el.tagName).toBe('DIV');
  });

  it('renders fixed integer columns as repeat(n, minmax(0, 1fr))', () => {
    render(<Grid columns={3} data-testid="g" />);
    const el = screen.getByTestId('g');
    expect(el.style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))');
  });

  it('renders { min } as auto-fit responsive grid', () => {
    render(<Grid columns={{ min: 'md' }} data-testid="g" />);
    const el = screen.getByTestId('g');
    expect(el.style.gridTemplateColumns).toBe('repeat(auto-fit, minmax(16rem, 1fr))');
  });

  it('omits gridTemplateColumns style when columns is unset', () => {
    render(<Grid data-testid="g" />);
    const el = screen.getByTestId('g');
    expect(el.style.gridTemplateColumns).toBe('');
  });

  it('honors `as` to render a different element', () => {
    render(<Grid as="section" data-testid="g" />);
    expect(screen.getByTestId('g').tagName).toBe('SECTION');
  });
});
