import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeSwitcher } from './ThemeSwitcher.js';

const OPTIONS = [
  { key: 'warm-sand', label: 'Warm sand' },
  { key: 'slate', label: 'Slate' },
  { key: 'synthwave', label: 'Synthwave' },
];

describe('ThemeSwitcher', () => {
  it('renders the selected label in the trigger', () => {
    render(<ThemeSwitcher options={OPTIONS} value="slate" onChange={() => {}} />);
    expect(screen.getByRole('button')).toHaveTextContent('Slate');
  });

  it('falls back to "Theme" when value matches no option', () => {
    render(<ThemeSwitcher options={OPTIONS} value="missing" onChange={() => {}} />);
    expect(screen.getByRole('button')).toHaveTextContent('Theme');
  });

  it('opens the menu and lists every option as a menuitem', async () => {
    render(<ThemeSwitcher options={OPTIONS} value="warm-sand" onChange={() => {}} />);
    await userEvent.click(screen.getByRole('button'));
    const menu = await screen.findByRole('menu');
    expect(menu).toHaveAccessibleName('Theme');
    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(3);
    expect(items.map((i) => i.textContent)).toEqual([
      expect.stringContaining('Warm sand'),
      expect.stringContaining('Slate'),
      expect.stringContaining('Synthwave'),
    ]);
  });

  it('fires onChange with the chosen key and closes', async () => {
    const onChange = vi.fn();
    function Host(): React.JSX.Element {
      const [value, setValue] = useState('warm-sand');
      return (
        <ThemeSwitcher
          options={OPTIONS}
          value={value}
          onChange={(k) => {
            onChange(k);
            setValue(k);
          }}
        />
      );
    }
    render(<Host />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(await screen.findByRole('menuitem', { name: /Synthwave/ }));
    expect(onChange).toHaveBeenCalledWith('synthwave');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(screen.getByRole('button')).toHaveTextContent('Synthwave');
  });

  it('honours a custom aria-label on the menu surface', async () => {
    render(
      <ThemeSwitcher
        options={OPTIONS}
        value="warm-sand"
        onChange={() => {}}
        aria-label="Choose palette"
      />,
    );
    await userEvent.click(screen.getByRole('button'));
    const menu = await screen.findByRole('menu');
    expect(menu).toHaveAccessibleName('Choose palette');
  });
});
