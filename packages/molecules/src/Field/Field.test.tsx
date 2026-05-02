import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dropdown, Switch } from '@touchstone/atoms';
import { Field } from './Field.js';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl.js';

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
    render(<Field label="Email" hint="Helper text" error="Email is required" />);
    const input = screen.getByLabelText('Email');
    const error = screen.getByRole('alert');
    expect(error).toHaveTextContent('Email is required');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')).toBe(error.id);
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('wraps a Switch child with id + aria-describedby', () => {
    render(
      <Field label="Verbose mode" hint="Print extra debug output">
        <Switch defaultChecked />
      </Field>,
    );
    const sw = screen.getByRole('switch', { name: 'Verbose mode' });
    const hint = screen.getByText('Print extra debug output');
    expect(sw.getAttribute('aria-describedby')).toBe(hint.id);
  });

  it('wraps a SegmentedControl child and points aria-describedby at the error', () => {
    render(
      <Field label="Mode" error="pick one">
        <SegmentedControl
          options={[
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ]}
        />
      </Field>,
    );
    const group = screen.getByRole('radiogroup', { name: 'Mode' });
    const error = screen.getByRole('alert');
    expect(group.getAttribute('aria-describedby')).toBe(error.id);
  });

  it('propagates aria-invalid to wrapped child when error is set', () => {
    render(
      <Field label="Fruit" error="pick one">
        <Dropdown options={[{ value: 'a', label: 'a' }]} />
      </Field>,
    );
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not propagate aria-invalid when there is no error', () => {
    render(
      <Field label="Fruit">
        <Dropdown options={[{ value: 'a', label: 'a' }]} />
      </Field>,
    );
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    expect(trigger).not.toHaveAttribute('aria-invalid');
  });
});
