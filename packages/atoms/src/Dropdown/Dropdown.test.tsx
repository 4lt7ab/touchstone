import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown } from './Dropdown.js';

const OPTIONS = [
  { value: 'apple', label: 'apple' },
  { value: 'banana', label: 'banana' },
  { value: 'cherry', label: 'cherry', disabled: true },
  { value: 'date', label: 'date' },
];

describe('Dropdown', () => {
  it('renders a combobox trigger with placeholder when no value selected', () => {
    render(<Dropdown options={OPTIONS} aria-label="fruit" placeholder="pick one" />);
    const trigger = screen.getByRole('combobox', { name: 'fruit' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveTextContent('pick one');
  });

  it('opens the listbox on click and renders options with correct ARIA roles', async () => {
    render(<Dropdown options={OPTIONS} aria-label="fruit" />);
    const trigger = screen.getByRole('combobox', { name: 'fruit' });
    await userEvent.click(trigger);
    const listbox = await screen.findByRole('listbox');
    expect(listbox).toBeInTheDocument();
    const opts = screen.getAllByRole('option');
    expect(opts).toHaveLength(4);
    expect(opts[0]).toHaveAttribute('aria-selected', 'false');
    expect(opts[2]).toHaveAttribute('aria-disabled', 'true');
  });

  it('selecting an option updates value, closes the listbox, and fires onChange', async () => {
    const onChange = vi.fn();
    render(<Dropdown options={OPTIONS} aria-label="fruit" onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox', { name: 'fruit' }));
    await userEvent.click(screen.getByRole('option', { name: 'banana' }));
    expect(onChange).toHaveBeenCalledWith('banana');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    expect(screen.getByRole('combobox', { name: 'fruit' })).toHaveTextContent('banana');
  });

  it('disabled options cannot be selected', async () => {
    const onChange = vi.fn();
    render(<Dropdown options={OPTIONS} aria-label="fruit" onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox', { name: 'fruit' }));
    await userEvent.click(screen.getByRole('option', { name: 'cherry' }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('arrow keys move active option, skipping disabled, and Enter selects', async () => {
    const onChange = vi.fn();
    render(<Dropdown options={OPTIONS} aria-label="fruit" onChange={onChange} />);
    const trigger = screen.getByRole('combobox', { name: 'fruit' });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    expect(onChange).not.toHaveBeenCalled();
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('date');
  });

  it('Escape closes the listbox without selecting', async () => {
    const onChange = vi.fn();
    render(<Dropdown options={OPTIONS} aria-label="fruit" onChange={onChange} />);
    const trigger = screen.getByRole('combobox', { name: 'fruit' });
    await userEvent.click(trigger);
    await userEvent.keyboard('{Escape}');
    expect(onChange).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  });

  it('honors controlled value (does not flip on internal click)', async () => {
    const onChange = vi.fn();
    render(
      <Dropdown options={OPTIONS} aria-label="fruit" value="apple" onChange={onChange} />,
    );
    await userEvent.click(screen.getByRole('combobox', { name: 'fruit' }));
    await userEvent.click(screen.getByRole('option', { name: 'banana' }));
    expect(onChange).toHaveBeenCalledWith('banana');
    expect(screen.getByRole('combobox', { name: 'fruit' })).toHaveTextContent('apple');
  });

  it('sets aria-invalid when invalid prop is true', () => {
    render(<Dropdown options={OPTIONS} aria-label="fruit" invalid />);
    expect(screen.getByRole('combobox', { name: 'fruit' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('disabled trigger does not open on click', async () => {
    render(<Dropdown options={OPTIONS} aria-label="fruit" disabled />);
    await userEvent.click(screen.getByRole('combobox', { name: 'fruit' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('renders a hidden input when name is set', () => {
    const { container } = render(
      <Dropdown options={OPTIONS} aria-label="fruit" name="fruit" defaultValue="apple" />,
    );
    const hidden = container.querySelector('input[type="hidden"]');
    expect(hidden).toHaveAttribute('name', 'fruit');
    expect(hidden).toHaveValue('apple');
  });

  it('controlled open/onOpenChange', async () => {
    const onOpenChange = vi.fn();
    function Host(): React.JSX.Element {
      const [o, setO] = useState(false);
      return (
        <Dropdown
          options={OPTIONS}
          aria-label="fruit"
          open={o}
          onOpenChange={(next) => {
            onOpenChange(next);
            setO(next);
          }}
        />
      );
    }
    render(<Host />);
    await userEvent.click(screen.getByRole('combobox', { name: 'fruit' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('renders empty message when options is empty', async () => {
    render(<Dropdown options={[]} aria-label="fruit" emptyMessage="nothing here" />);
    await userEvent.click(screen.getByRole('combobox', { name: 'fruit' }));
    expect(await screen.findByText('nothing here')).toBeInTheDocument();
  });

  it('renders grouped options with group labels and treats them as one flat list for keyboard nav', async () => {
    const onChange = vi.fn();
    render(
      <Dropdown
        aria-label="fruit"
        onChange={onChange}
        options={[
          { label: 'Citrus', options: [{ value: 'lemon', label: 'lemon' }] },
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
    const trigger = screen.getByRole('combobox', { name: 'fruit' });
    await userEvent.click(trigger);
    expect(screen.getByText('Citrus')).toBeInTheDocument();
    expect(screen.getByText('Stone')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
    // After click, listbox is open and active=0 (lemon). One ArrowDown moves
    // across the group boundary into Stone -> cherry.
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('cherry');
  });

  it('typeahead-jumps to the next option starting with the typed letter', async () => {
    const onChange = vi.fn();
    render(<Dropdown options={OPTIONS} aria-label="fruit" onChange={onChange} />);
    const trigger = screen.getByRole('combobox', { name: 'fruit' });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('d');
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('date');
  });

  it('badge shape keeps combobox semantics and selects through the listbox', async () => {
    const onChange = vi.fn();
    render(
      <Dropdown
        options={OPTIONS}
        aria-label="fruit"
        shape="badge"
        tone="success"
        defaultValue="apple"
        onChange={onChange}
      />,
    );
    const trigger = screen.getByRole('combobox', { name: 'fruit' });
    expect(trigger).toHaveTextContent('apple');
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('option', { name: 'banana' }));
    expect(onChange).toHaveBeenCalledWith('banana');
    expect(screen.getByRole('combobox', { name: 'fruit' })).toHaveTextContent('banana');
  });

  it('typeahead skips disabled options', async () => {
    const onChange = vi.fn();
    render(
      <Dropdown
        options={[
          { value: 'apple', label: 'apple' },
          { value: 'apricot', label: 'apricot', disabled: true },
          { value: 'avocado', label: 'avocado' },
        ]}
        aria-label="fruit"
        onChange={onChange}
      />,
    );
    const trigger = screen.getByRole('combobox', { name: 'fruit' });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('a');
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('avocado');
  });
});
