import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TypingIndicator } from './TypingIndicator.js';

describe('TypingIndicator', () => {
  it('exposes a polite live region with the default label', () => {
    render(<TypingIndicator />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveTextContent('Assistant is typing');
  });

  it('honours a custom label', () => {
    render(<TypingIndicator label="Composing reply" />);
    expect(screen.getByRole('status')).toHaveTextContent('Composing reply');
  });
});
