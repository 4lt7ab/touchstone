import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from './Avatar.js';

describe('Avatar', () => {
  it('renders the monogram, truncated to three characters', () => {
    render(<Avatar data-testid="a" monogram="Lovelace" />);
    expect(screen.getByTestId('a').textContent).toBe('Lov');
  });

  it('prefers children over monogram', () => {
    render(
      <Avatar data-testid="a" monogram="AL">
        <span>★</span>
      </Avatar>,
    );
    expect(screen.getByTestId('a').textContent).toBe('★');
  });

  it('hides from a11y tree by default', () => {
    render(<Avatar data-testid="a" monogram="AL" />);
    const node = screen.getByTestId('a');
    expect(node).toHaveAttribute('aria-hidden', 'true');
    expect(node).not.toHaveAttribute('role');
  });

  it('exposes role=img and aria-label when labelled', () => {
    render(<Avatar aria-label="Ada Lovelace" monogram="AL" />);
    const node = screen.getByRole('img', { name: 'Ada Lovelace' });
    expect(node).not.toHaveAttribute('aria-hidden');
  });

  it('honours an explicit aria-hidden=false on a labelled avatar', () => {
    render(<Avatar aria-label="Ada" aria-hidden={false} monogram="AL" data-testid="a" />);
    expect(screen.getByTestId('a')).not.toHaveAttribute('aria-hidden');
  });
});
