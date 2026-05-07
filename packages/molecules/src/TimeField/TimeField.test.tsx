import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimeField } from './TimeField.js';

describe('TimeField', () => {
  it('renders the label and connects it to the segments', () => {
    render(<TimeField label="Alarm" defaultValue="14:30" />);
    expect(screen.getByText('Alarm')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Alarm' })).toBeInTheDocument();
  });

  it('shows hint when no error', () => {
    render(<TimeField label="Alarm" hint="HH:MM, 24-hour" />);
    expect(screen.getByText('HH:MM, 24-hour')).toBeInTheDocument();
  });

  it('replaces hint with error when both are provided', () => {
    render(<TimeField label="Alarm" hint="HH:MM, 24-hour" error="Required." />);
    expect(screen.queryByText('HH:MM, 24-hour')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Required.');
  });

  it('marks the input invalid when error is present', () => {
    render(<TimeField label="Alarm" error="Required." defaultValue="14:30" />);
    expect(screen.getByRole('group', { name: 'Alarm' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards onChange from TimeInput', async () => {
    const onChange = vi.fn();
    render(<TimeField label="Alarm" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'hour' }), '14');
    await userEvent.type(screen.getByRole('textbox', { name: 'minute' }), '30');
    expect(onChange).toHaveBeenLastCalledWith('14:30');
  });
});
