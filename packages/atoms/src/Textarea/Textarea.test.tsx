import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea.js';

describe('Textarea', () => {
  it('renders as a textarea with the given label', () => {
    render(<Textarea aria-label="notes for the apprentice" />);
    expect(screen.getByRole('textbox', { name: 'notes for the apprentice' })).toBeInstanceOf(
      HTMLTextAreaElement,
    );
  });

  it('honours rows', () => {
    render(<Textarea aria-label="notes" rows={6} />);
    expect(screen.getByRole('textbox', { name: 'notes' })).toHaveAttribute('rows', '6');
  });

  it('reports aria-invalid when invalid', () => {
    render(<Textarea aria-label="notes" invalid />);
    expect(screen.getByRole('textbox', { name: 'notes' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('fires onChange as the user types', async () => {
    const onChange = vi.fn();
    render(<Textarea aria-label="notes" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'notes' }), 'hello');
    expect(onChange).toHaveBeenCalled();
  });

  it('does not accept input when disabled', async () => {
    render(<Textarea aria-label="notes" disabled />);
    const tx = screen.getByRole('textbox', { name: 'notes' });
    await userEvent.type(tx, 'x');
    expect((tx as HTMLTextAreaElement).value).toBe('');
  });
});
