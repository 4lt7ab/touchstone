import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimeInput } from './TimeInput.js';

describe('TimeInput', () => {
  it('renders hour and minute segments by default', () => {
    render(<TimeInput aria-label="alarm time" />);
    expect(screen.getByRole('textbox', { name: 'hour' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'minute' })).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'second' })).not.toBeInTheDocument();
  });

  it('renders second segment when precision="second"', () => {
    render(<TimeInput aria-label="alarm time" precision="second" />);
    expect(screen.getByRole('textbox', { name: 'second' })).toBeInTheDocument();
  });

  it('hydrates segments from defaultValue', () => {
    render(<TimeInput aria-label="alarm time" defaultValue="14:30" />);
    expect(screen.getByRole('textbox', { name: 'hour' })).toHaveValue('14');
    expect(screen.getByRole('textbox', { name: 'minute' })).toHaveValue('30');
  });

  it('hydrates seconds when precision matches', () => {
    render(<TimeInput aria-label="alarm time" precision="second" defaultValue="14:30:45" />);
    expect(screen.getByRole('textbox', { name: 'second' })).toHaveValue('45');
  });

  it('emits HH:MM when both segments are typed', async () => {
    const onChange = vi.fn();
    render(<TimeInput aria-label="alarm time" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'hour' }), '14');
    await userEvent.type(screen.getByRole('textbox', { name: 'minute' }), '30');
    expect(onChange).toHaveBeenLastCalledWith('14:30');
  });

  it('emits HH:MM:SS at second precision', async () => {
    const onChange = vi.fn();
    render(<TimeInput aria-label="alarm time" precision="second" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'hour' }), '14');
    await userEvent.type(screen.getByRole('textbox', { name: 'minute' }), '30');
    await userEvent.type(screen.getByRole('textbox', { name: 'second' }), '45');
    expect(onChange).toHaveBeenLastCalledWith('14:30:45');
  });

  it('auto-advances on a full segment', async () => {
    render(<TimeInput aria-label="alarm time" />);
    const hour = screen.getByRole('textbox', { name: 'hour' });
    hour.focus();
    await userEvent.keyboard('14');
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'minute' }));
  });

  it('colon advances to the next segment', async () => {
    render(<TimeInput aria-label="alarm time" />);
    const hour = screen.getByRole('textbox', { name: 'hour' });
    hour.focus();
    await userEvent.keyboard('9:');
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'minute' }));
  });

  it('arrow up/down nudges the value', async () => {
    const onChange = vi.fn();
    render(<TimeInput aria-label="alarm time" defaultValue="14:30" onChange={onChange} />);
    const hour = screen.getByRole('textbox', { name: 'hour' });
    hour.focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenLastCalledWith('15:30');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith('13:30');
  });

  it('flags invalid when value is outside min/max', () => {
    render(<TimeInput aria-label="alarm time" defaultValue="08:00" min="09:00" />);
    const root = screen.getByRole('group', { name: 'alarm time' });
    expect(root).toHaveAttribute('aria-invalid', 'true');
  });

  it('hidden input carries the value when name is set', () => {
    const { container } = render(
      <TimeInput aria-label="alarm time" name="alarm" defaultValue="14:30" />,
    );
    const hidden = container.querySelector('input[type="hidden"][name="alarm"]') as HTMLInputElement | null;
    expect(hidden?.value).toBe('14:30');
  });

  it('disabled prop disables every segment', () => {
    render(<TimeInput aria-label="alarm time" defaultValue="14:30" disabled />);
    expect(screen.getByRole('textbox', { name: 'hour' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'minute' })).toBeDisabled();
  });
});
