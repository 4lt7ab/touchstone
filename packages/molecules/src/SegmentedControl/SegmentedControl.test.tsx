import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SegmentedControl } from './SegmentedControl.js';

const OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
] as const;

describe('SegmentedControl', () => {
  it('renders a radiogroup with one radio per option, first option checked by default', () => {
    render(<SegmentedControl options={OPTIONS} aria-label="View" />);
    const group = screen.getByRole('radiogroup', { name: 'View' });
    expect(group).toBeInTheDocument();
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
    expect(radios[0]).toHaveAttribute('aria-checked', 'true');
    expect(radios[1]).toHaveAttribute('aria-checked', 'false');
  });

  it('honors defaultValue', () => {
    render(<SegmentedControl options={OPTIONS} defaultValue="week" aria-label="View" />);
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute('aria-checked', 'true');
  });

  it('selects on click and fires onValueChange', async () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl options={OPTIONS} onValueChange={onValueChange} aria-label="View" />);
    await userEvent.click(screen.getByRole('radio', { name: 'Month' }));
    expect(onValueChange).toHaveBeenCalledWith('month');
    expect(screen.getByRole('radio', { name: 'Month' })).toHaveAttribute('aria-checked', 'true');
  });

  it('arrow keys move selection in radiogroup style (focus + select)', async () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl options={OPTIONS} onValueChange={onValueChange} aria-label="View" />);
    const first = screen.getByRole('radio', { name: 'Day' });
    first.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenLastCalledWith('week');
    await userEvent.keyboard('{End}');
    expect(onValueChange).toHaveBeenLastCalledWith('month');
  });

  it('skips disabled options for click selection', async () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        options={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week', disabled: true },
        ]}
        onValueChange={onValueChange}
        aria-label="View"
      />,
    );
    const week = screen.getByRole('radio', { name: 'Week' });
    expect(week).toBeDisabled();
    await userEvent.click(week);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('does not change value when fully disabled', async () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        options={OPTIONS}
        disabled
        onValueChange={onValueChange}
        aria-label="View"
      />,
    );
    await userEvent.click(screen.getByRole('radio', { name: 'Week' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
