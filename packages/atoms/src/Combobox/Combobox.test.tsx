import { describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Combobox } from './Combobox.js';

const FRUITS = [
  { value: 'apple', label: 'apple' },
  { value: 'apricot', label: 'apricot' },
  { value: 'banana', label: 'banana' },
  { value: 'cherry', label: 'cherry' },
];

describe('Combobox', () => {
  it('renders an input with role=combobox', () => {
    render(<Combobox options={FRUITS} aria-label="fruit" placeholder="search" />);
    const input = screen.getByRole('combobox', { name: 'fruit' });
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-haspopup', 'listbox');
  });

  it('opens listbox on focus and shows all options', async () => {
    render(<Combobox options={FRUITS} aria-label="fruit" />);
    const input = screen.getByRole('combobox', { name: 'fruit' });
    await userEvent.click(input);
    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(4);
  });

  it('typing filters by substring (case-insensitive)', async () => {
    render(<Combobox options={FRUITS} aria-label="fruit" />);
    const input = screen.getByRole('combobox', { name: 'fruit' });
    await userEvent.click(input);
    await userEvent.type(input, 'AP');
    const opts = screen.getAllByRole('option');
    expect(opts.map((o) => o.textContent)).toEqual(['apple', 'apricot']);
  });

  it('selecting an option fills the input and fires onChange', async () => {
    const onChange = vi.fn();
    render(<Combobox options={FRUITS} aria-label="fruit" onChange={onChange} />);
    const input = screen.getByRole('combobox', { name: 'fruit' });
    await userEvent.click(input);
    await userEvent.click(screen.getByRole('option', { name: 'banana' }));
    expect(onChange).toHaveBeenCalledWith('banana');
    expect((input as HTMLInputElement).value).toBe('banana');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  });

  it('Enter selects the active option', async () => {
    const onChange = vi.fn();
    render(<Combobox options={FRUITS} aria-label="fruit" onChange={onChange} />);
    const input = screen.getByRole('combobox', { name: 'fruit' });
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('apricot');
  });

  it('Escape closes the listbox without selecting', async () => {
    render(<Combobox options={FRUITS} aria-label="fruit" />);
    const input = screen.getByRole('combobox', { name: 'fruit' });
    await userEvent.click(input);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  });

  it('on blur with no selection, input clears', async () => {
    render(<Combobox options={FRUITS} aria-label="fruit" />);
    const input = screen.getByRole('combobox', { name: 'fruit' });
    await userEvent.click(input);
    await userEvent.type(input, 'xyz');
    await act(async () => {
      input.blur();
    });
    await waitFor(() => expect((input as HTMLInputElement).value).toBe(''));
  });

  it('on blur after selection, input reverts to selected label', async () => {
    render(<Combobox options={FRUITS} aria-label="fruit" defaultValue="banana" />);
    const input = screen.getByRole('combobox', { name: 'fruit' });
    expect((input as HTMLInputElement).value).toBe('banana');
    await userEvent.click(input);
    await userEvent.clear(input);
    await userEvent.type(input, 'che');
    await act(async () => {
      input.blur();
    });
    await waitFor(() => expect((input as HTMLInputElement).value).toBe('banana'));
  });

  it('renders empty message when no options match', async () => {
    render(<Combobox options={FRUITS} aria-label="fruit" emptyMessage="nothing here" />);
    const input = screen.getByRole('combobox', { name: 'fruit' });
    await userEvent.click(input);
    await userEvent.type(input, 'zzz');
    expect(await screen.findByText('nothing here')).toBeInTheDocument();
  });

  it('respects disabled', async () => {
    render(<Combobox options={FRUITS} aria-label="fruit" disabled />);
    const input = screen.getByRole('combobox', { name: 'fruit' });
    expect(input).toBeDisabled();
    await userEvent.click(input);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('sets aria-invalid', () => {
    render(<Combobox options={FRUITS} aria-label="fruit" invalid />);
    expect(screen.getByRole('combobox', { name: 'fruit' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('renders grouped options with labels and filters within groups', async () => {
    render(
      <Combobox
        aria-label="fruit"
        options={[
          {
            label: 'Citrus',
            options: [
              { value: 'lemon', label: 'lemon' },
              { value: 'lime', label: 'lime' },
            ],
          },
          {
            label: 'Stone',
            options: [
              { value: 'plum', label: 'plum' },
              { value: 'peach', label: 'peach' },
            ],
          },
        ]}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'fruit' });
    await userEvent.click(input);
    expect(screen.getByText('Citrus')).toBeInTheDocument();
    expect(screen.getByText('Stone')).toBeInTheDocument();
    await userEvent.type(input, 'p');
    // 'plum' and 'peach' both contain 'p'; Stone group remains, Citrus drops out
    expect(screen.queryByText('Citrus')).not.toBeInTheDocument();
    expect(screen.getByText('Stone')).toBeInTheDocument();
    const opts = screen.getAllByRole('option');
    expect(opts.map((o) => o.textContent)).toEqual(['plum', 'peach']);
  });
});
