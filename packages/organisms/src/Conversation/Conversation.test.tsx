import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Conversation } from './Conversation.js';

describe('Conversation', () => {
  it('renders the empty state when no children are passed', () => {
    render(<Conversation emptyState={<div>nothing yet</div>} />);
    expect(screen.getByText('nothing yet')).toBeInTheDocument();
  });

  it('exposes a live log when messages are present', () => {
    render(
      <Conversation>
        <div>first message</div>
      </Conversation>,
    );
    const log = screen.getByRole('log');
    expect(log).toHaveAttribute('aria-live', 'polite');
    expect(log).toHaveTextContent('first message');
  });

  it('renders the composer slot at the foot', () => {
    render(
      <Conversation composer={<button type="button">send</button>}>
        <div>m</div>
      </Conversation>,
    );
    expect(screen.getByRole('button', { name: 'send' })).toBeInTheDocument();
  });

  it('renders the typing slot beneath messages', () => {
    render(
      <Conversation typing={<span>typing…</span>}>
        <div>m</div>
      </Conversation>,
    );
    expect(screen.getByText('typing…')).toBeInTheDocument();
  });
});
