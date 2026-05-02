import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Prose } from './Prose.js';

describe('Prose', () => {
  it('renders children inside a div', () => {
    render(
      <Prose data-testid="prose">
        <h1>Title</h1>
        <p>Body</p>
      </Prose>,
    );
    const root = screen.getByTestId('prose');
    expect(root.tagName).toBe('DIV');
    expect(screen.getByText('Title').tagName).toBe('H1');
    expect(screen.getByText('Body').tagName).toBe('P');
  });

  it('forwards density and width as data attributes', () => {
    render(
      <Prose data-testid="prose" density="compact" width="full">
        <p>x</p>
      </Prose>,
    );
    const root = screen.getByTestId('prose');
    expect(root).toHaveAttribute('data-density', 'compact');
    expect(root).toHaveAttribute('data-width', 'full');
  });

  it('defaults to comfortable density and reading width', () => {
    render(
      <Prose data-testid="prose">
        <p>x</p>
      </Prose>,
    );
    const root = screen.getByTestId('prose');
    expect(root).toHaveAttribute('data-density', 'comfortable');
    expect(root).toHaveAttribute('data-width', 'reading');
  });
});
