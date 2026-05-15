import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageActions } from './MessageActions.js';

describe('MessageActions', () => {
  it('only renders buttons for provided handlers', () => {
    render(<MessageActions onCopy={() => {}} />);
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Regenerate' })).not.toBeInTheDocument();
  });

  it('fires each handler on click', async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    const onRegenerate = vi.fn();
    const onLike = vi.fn();
    const onDislike = vi.fn();
    render(
      <MessageActions
        onCopy={onCopy}
        onRegenerate={onRegenerate}
        onLike={onLike}
        onDislike={onDislike}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    await user.click(screen.getByRole('button', { name: 'Regenerate' }));
    await user.click(screen.getByRole('button', { name: 'Good response' }));
    await user.click(screen.getByRole('button', { name: 'Bad response' }));
    expect(onCopy).toHaveBeenCalledOnce();
    expect(onRegenerate).toHaveBeenCalledOnce();
    expect(onLike).toHaveBeenCalledOnce();
    expect(onDislike).toHaveBeenCalledOnce();
  });

  it('reflects rating state via aria-pressed', () => {
    render(<MessageActions onLike={() => {}} onDislike={() => {}} liked />);
    expect(screen.getByRole('button', { name: 'Good response' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Bad response' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});
