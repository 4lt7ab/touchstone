import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SuggestionChip } from './SuggestionChip.js';

describe('SuggestionChip', () => {
  it('renders the label as the accessible name', () => {
    render(<SuggestionChip>draft a reply</SuggestionChip>);
    expect(screen.getByRole('button', { name: 'draft a reply' })).toBeInTheDocument();
  });

  it('fires onClick when activated', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SuggestionChip onClick={onClick}>tap</SuggestionChip>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('blocks clicks when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SuggestionChip onClick={onClick} disabled>
        tap
      </SuggestionChip>,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
