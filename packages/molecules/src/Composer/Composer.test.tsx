import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Composer } from './Composer.js';

describe('Composer', () => {
  it('renders a textarea with the placeholder', () => {
    render(<Composer onSubmit={() => {}} placeholder="Say something" />);
    expect(screen.getByPlaceholderText('Say something')).toBeInTheDocument();
  });

  it('submits on Enter when the draft is non-empty', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Composer onSubmit={onSubmit} />);
    const ta = screen.getByRole('textbox');
    await user.type(ta, 'hello{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('hello');
  });

  it('does not submit on empty Enter', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Composer onSubmit={onSubmit} />);
    const ta = screen.getByRole('textbox');
    await user.type(ta, '{Enter}');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('inserts a newline on Shift+Enter without submitting', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Composer onSubmit={onSubmit} />);
    const ta = screen.getByRole('textbox') as HTMLTextAreaElement;
    await user.type(ta, 'a{Shift>}{Enter}{/Shift}b');
    expect(onSubmit).not.toHaveBeenCalled();
    expect(ta.value).toBe('a\nb');
  });

  it('clears on Escape', async () => {
    const user = userEvent.setup();
    render(<Composer onSubmit={() => {}} />);
    const ta = screen.getByRole('textbox') as HTMLTextAreaElement;
    await user.type(ta, 'half-typed');
    await user.keyboard('{Escape}');
    expect(ta.value).toBe('');
  });

  it('locks the input while sending', () => {
    render(<Composer onSubmit={() => {}} state="sending" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });
});
