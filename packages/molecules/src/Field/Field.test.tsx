import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Field } from './Field.js';

describe('Field', () => {
  it('associates label with the input', () => {
    render(<Field label="Email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
  });

  it('shows a hint and wires aria-describedby to it', () => {
    render(<Field label="Email" hint="We never share your email." />);
    const input = screen.getByLabelText('Email');
    const hint = screen.getByText('We never share your email.');
    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
  });

  it('shows an error, marks the input invalid, and hides the hint', () => {
    render(
      <Field label="Email" hint="Helper text" error="Email is required" />,
    );
    const input = screen.getByLabelText('Email');
    const error = screen.getByRole('alert');
    expect(error).toHaveTextContent('Email is required');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')).toBe(error.id);
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });
});
