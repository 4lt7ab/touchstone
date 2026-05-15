import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Message } from './Message.js';

describe('Message', () => {
  it('renders the body content', () => {
    render(<Message author="assistant">hello there</Message>);
    expect(screen.getByText('hello there')).toBeInTheDocument();
  });

  it('exposes streaming state through aria-busy', () => {
    render(
      <Message author="assistant" state="streaming">
        composing
      </Message>,
    );
    expect(screen.getByRole('article')).toHaveAttribute('aria-busy', 'true');
  });

  it('omits aria-busy when complete', () => {
    render(<Message author="assistant">complete</Message>);
    expect(screen.getByRole('article')).not.toHaveAttribute('aria-busy');
  });

  it('renders author name when provided', () => {
    render(
      <Message author="user" authorName="Sam">
        hi
      </Message>,
    );
    expect(screen.getByText('Sam')).toBeInTheDocument();
  });

  it('renders a default avatar for assistant turns', () => {
    render(<Message author="assistant">x</Message>);
    expect(screen.getByLabelText('Assistant')).toBeInTheDocument();
  });

  it('suppresses the default avatar when avatar={null}', () => {
    render(
      <Message author="assistant" avatar={null}>
        x
      </Message>,
    );
    expect(screen.queryByLabelText('Assistant')).not.toBeInTheDocument();
  });
});
