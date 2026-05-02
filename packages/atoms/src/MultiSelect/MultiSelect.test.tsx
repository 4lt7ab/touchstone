import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultiSelect } from './MultiSelect.js';

const FRUITS = [
  { value: 'apple', label: 'apple' },
  { value: 'banana', label: 'banana' },
  { value: 'cherry', label: 'cherry' },
];

describe('MultiSelect', () => {
  it('renders with placeholder when no values selected', () => {
    render(<MultiSelect options={FRUITS} aria-label="fruits" placeholder="pick some" />);
    const trigger = screen.getByRole('combobox', { name: 'fruits' });
    expect(trigger).toHaveTextContent('pick some');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens listbox with aria-multiselectable on click', async () => {
    render(<MultiSelect options={FRUITS} aria-label="fruits" />);
    await userEvent.click(screen.getByRole('combobox', { name: 'fruits' }));
    const listbox = await screen.findByRole('listbox');
    expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
  });

  it('selecting toggles value and stays open', async () => {
    const onChange = vi.fn();
    render(<MultiSelect options={FRUITS} aria-label="fruits" onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox', { name: 'fruits' }));
    await userEvent.click(screen.getByRole('option', { name: 'apple' }));
    expect(onChange).toHaveBeenLastCalledWith(['apple']);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('option', { name: 'banana' }));
    expect(onChange).toHaveBeenLastCalledWith(['apple', 'banana']);
    await userEvent.click(screen.getByRole('option', { name: 'apple' }));
    expect(onChange).toHaveBeenLastCalledWith(['banana']);
  });

  it('renders one chip per selected value with a remove button', async () => {
    render(
      <MultiSelect
        options={FRUITS}
        aria-label="fruits"
        defaultValue={['apple', 'banana', 'cherry']}
      />,
    );
    expect(screen.getByRole('button', { name: 'remove apple' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'remove banana' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'remove cherry' })).toBeInTheDocument();
  });

  it('clicking a chip remove button removes only that value and does not toggle the listbox', async () => {
    const onChange = vi.fn();
    render(
      <MultiSelect
        options={FRUITS}
        aria-label="fruits"
        defaultValue={['apple', 'banana', 'cherry']}
        onChange={onChange}
      />,
    );
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'remove banana' }));
    expect(onChange).toHaveBeenCalledWith(['apple', 'cherry']);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('Backspace on a closed trigger removes the most recent value', async () => {
    const onChange = vi.fn();
    render(
      <MultiSelect
        options={FRUITS}
        aria-label="fruits"
        defaultValue={['apple', 'banana']}
        onChange={onChange}
      />,
    );
    const trigger = screen.getByRole('combobox', { name: 'fruits' });
    trigger.focus();
    await userEvent.keyboard('{Backspace}');
    expect(onChange).toHaveBeenCalledWith(['apple']);
  });

  it('Escape closes the listbox', async () => {
    render(<MultiSelect options={FRUITS} aria-label="fruits" />);
    await userEvent.click(screen.getByRole('combobox', { name: 'fruits' }));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  });

  it('renders one hidden input per selected value when name is set', () => {
    const { container } = render(
      <MultiSelect
        options={FRUITS}
        aria-label="fruits"
        name="fruits"
        defaultValue={['apple', 'cherry']}
      />,
    );
    const hiddens = container.querySelectorAll('input[type="hidden"][name="fruits"]');
    expect(hiddens).toHaveLength(2);
    expect((hiddens[0] as HTMLInputElement).value).toBe('apple');
    expect((hiddens[1] as HTMLInputElement).value).toBe('cherry');
  });

  it('disabled trigger does not open', async () => {
    render(<MultiSelect options={FRUITS} aria-label="fruits" disabled />);
    await userEvent.click(screen.getByRole('combobox', { name: 'fruits' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('sets aria-invalid', () => {
    render(<MultiSelect options={FRUITS} aria-label="fruits" invalid />);
    expect(screen.getByRole('combobox', { name: 'fruits' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('arrow keys + Enter toggle the active option without closing', async () => {
    const onChange = vi.fn();
    render(<MultiSelect options={FRUITS} aria-label="fruits" onChange={onChange} />);
    const trigger = screen.getByRole('combobox', { name: 'fruits' });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(['apple']);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(['apple', 'banana']);
  });

  it('renders grouped options and their values can be toggled', async () => {
    const onChange = vi.fn();
    render(
      <MultiSelect
        aria-label="fruits"
        onChange={onChange}
        options={[
          { label: 'Pome', options: [{ value: 'apple', label: 'apple' }] },
          {
            label: 'Stone',
            options: [
              { value: 'cherry', label: 'cherry' },
              { value: 'plum', label: 'plum' },
            ],
          },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole('combobox', { name: 'fruits' }));
    expect(screen.getByText('Pome')).toBeInTheDocument();
    expect(screen.getByText('Stone')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('option', { name: 'plum' }));
    expect(onChange).toHaveBeenLastCalledWith(['plum']);
  });

  it('selectAll renders a tristate row that selects all then clears all', async () => {
    const onChange = vi.fn();
    render(
      <MultiSelect options={FRUITS} aria-label="fruits" selectAll onChange={onChange} />,
    );
    await userEvent.click(screen.getByRole('combobox', { name: 'fruits' }));
    const selectAllRow = screen.getByRole('option', { name: 'Select all' });
    expect(selectAllRow).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(selectAllRow);
    expect(onChange).toHaveBeenLastCalledWith(['apple', 'banana', 'cherry']);
    expect(screen.getByRole('option', { name: 'Select all' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await userEvent.click(screen.getByRole('option', { name: 'Select all' }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('selectAll row reads as mixed when only some are selected', async () => {
    render(
      <MultiSelect
        options={FRUITS}
        aria-label="fruits"
        selectAll
        defaultValue={['apple']}
      />,
    );
    await userEvent.click(screen.getByRole('combobox', { name: 'fruits' }));
    expect(screen.getByRole('option', { name: 'Select all' })).toHaveAttribute(
      'aria-checked',
      'mixed',
    );
  });

  it('typeahead-jumps to the next matching option', async () => {
    const onChange = vi.fn();
    render(<MultiSelect options={FRUITS} aria-label="fruits" onChange={onChange} />);
    const trigger = screen.getByRole('combobox', { name: 'fruits' });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('c');
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(['cherry']);
  });
});
