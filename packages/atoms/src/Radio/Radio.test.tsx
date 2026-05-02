import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio, RadioGroup } from './Radio.js';

describe('RadioGroup', () => {
  it('renders a radiogroup with the given label', () => {
    render(
      <RadioGroup aria-label="plan">
        <Radio value="free">Free</Radio>
        <Radio value="pro">Pro</Radio>
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup', { name: 'plan' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('marks the matching radio as checked from defaultValue', () => {
    render(
      <RadioGroup aria-label="plan" defaultValue="pro">
        <Radio value="free">Free</Radio>
        <Radio value="pro">Pro</Radio>
      </RadioGroup>,
    );
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveAttribute('aria-checked', 'false');
  });

  it('selects on click and fires onValueChange', async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup aria-label="plan" onValueChange={onChange}>
        <Radio value="free">Free</Radio>
        <Radio value="pro">Pro</Radio>
      </RadioGroup>,
    );
    await userEvent.click(screen.getByRole('radio', { name: 'Pro' }));
    expect(onChange).toHaveBeenCalledWith('pro');
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute('aria-checked', 'true');
  });

  it('moves selection on ArrowDown / ArrowUp', async () => {
    function Host() {
      const [value, setValue] = useState('free');
      return (
        <RadioGroup aria-label="plan" value={value} onValueChange={setValue}>
          <Radio value="free">Free</Radio>
          <Radio value="pro">Pro</Radio>
          <Radio value="team">Team</Radio>
        </RadioGroup>
      );
    }
    render(<Host />);
    const free = screen.getByRole('radio', { name: 'Free' });
    free.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Team' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{ArrowUp}');
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute('aria-checked', 'true');
  });

  it('Home / End jump to first / last', async () => {
    function Host() {
      const [value, setValue] = useState('pro');
      return (
        <RadioGroup aria-label="plan" value={value} onValueChange={setValue}>
          <Radio value="free">Free</Radio>
          <Radio value="pro">Pro</Radio>
          <Radio value="team">Team</Radio>
        </RadioGroup>
      );
    }
    render(<Host />);
    const pro = screen.getByRole('radio', { name: 'Pro' });
    pro.focus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('radio', { name: 'Team' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveAttribute('aria-checked', 'true');
  });

  it('does not select disabled radios', async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup aria-label="plan" onValueChange={onChange}>
        <Radio value="free">Free</Radio>
        <Radio value="pro" disabled>
          Pro
        </Radio>
      </RadioGroup>,
    );
    await userEvent.click(screen.getByRole('radio', { name: 'Pro' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disables every radio when group is disabled', async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup aria-label="plan" disabled onValueChange={onChange}>
        <Radio value="free">Free</Radio>
        <Radio value="pro">Pro</Radio>
      </RadioGroup>,
    );
    await userEvent.click(screen.getByRole('radio', { name: 'Free' }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: 'Free' })).toBeDisabled();
  });

  it('throws if Radio is rendered outside a RadioGroup', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Radio value="x">x</Radio>)).toThrow(
      /must be rendered inside <RadioGroup>/,
    );
    error.mockRestore();
  });
});
