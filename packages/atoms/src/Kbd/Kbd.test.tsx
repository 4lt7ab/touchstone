import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Kbd } from './Kbd.js';

describe('Kbd', () => {
  it('renders a <kbd> element with the given content', () => {
    render(<Kbd data-testid="hint">⌘K</Kbd>);
    const el = screen.getByTestId('hint');
    expect(el.tagName).toBe('KBD');
    expect(el).toHaveTextContent('⌘K');
  });

  it('renders multiple keys when composed in sequence', () => {
    render(
      <span>
        <Kbd>⇧</Kbd>
        <Kbd>⌘</Kbd>
        <Kbd>P</Kbd>
      </span>,
    );
    expect(screen.getByText('⇧').tagName).toBe('KBD');
    expect(screen.getByText('⌘').tagName).toBe('KBD');
    expect(screen.getByText('P').tagName).toBe('KBD');
  });

  it('forwards id', () => {
    render(<Kbd id="hint-1">A</Kbd>);
    expect(screen.getByText('A')).toHaveAttribute('id', 'hint-1');
  });
});
