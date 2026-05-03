import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { useHotkey } from './useHotkey.js';

const isMac = (): boolean =>
  typeof navigator !== 'undefined' && /mac|iphone|ipad|ipod/i.test(navigator.platform);
const modKey = (): { metaKey: boolean; ctrlKey: boolean } =>
  isMac() ? { metaKey: true, ctrlKey: false } : { metaKey: false, ctrlKey: true };

function Bind({
  combo,
  handler,
  enabled,
  preventDefault,
  ignoreWhenTyping,
  withInput = false,
}: {
  combo: string;
  handler: (event: KeyboardEvent) => void;
  enabled?: boolean;
  preventDefault?: boolean;
  ignoreWhenTyping?: boolean;
  withInput?: boolean;
}): React.JSX.Element {
  useHotkey(combo, handler, {
    ...(enabled !== undefined ? { enabled } : {}),
    ...(preventDefault !== undefined ? { preventDefault } : {}),
    ...(ignoreWhenTyping !== undefined ? { ignoreWhenTyping } : {}),
  });
  return withInput ? <input data-testid="field" /> : <div data-testid="anchor" />;
}

describe('useHotkey', () => {
  it('fires on a matching mod-key combo', () => {
    const handler = vi.fn();
    render(<Bind combo="mod+b" handler={handler} />);
    fireEvent.keyDown(document, { key: 'b', ...modKey() });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not fire without the modifier', () => {
    const handler = vi.fn();
    render(<Bind combo="mod+b" handler={handler} />);
    fireEvent.keyDown(document, { key: 'b' });
    expect(handler).not.toHaveBeenCalled();
  });

  it('does not fire on the wrong key', () => {
    const handler = vi.fn();
    render(<Bind combo="mod+b" handler={handler} />);
    fireEvent.keyDown(document, { key: 'k', ...modKey() });
    expect(handler).not.toHaveBeenCalled();
  });

  it('matches modifiers exactly — extra modifier blocks the match', () => {
    const handler = vi.fn();
    render(<Bind combo="mod+b" handler={handler} />);
    fireEvent.keyDown(document, { key: 'b', ...modKey(), shiftKey: true });
    expect(handler).not.toHaveBeenCalled();
  });

  it('matches a shift-required combo only when shift is held', () => {
    const handler = vi.fn();
    render(<Bind combo="mod+shift+k" handler={handler} />);
    fireEvent.keyDown(document, { key: 'k', ...modKey() });
    expect(handler).not.toHaveBeenCalled();
    fireEvent.keyDown(document, { key: 'k', ...modKey(), shiftKey: true });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('is case-insensitive on the key token', () => {
    const handler = vi.fn();
    render(<Bind combo="mod+B" handler={handler} />);
    fireEvent.keyDown(document, { key: 'b', ...modKey() });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not fire when enabled is false', () => {
    const handler = vi.fn();
    render(<Bind combo="mod+b" handler={handler} enabled={false} />);
    fireEvent.keyDown(document, { key: 'b', ...modKey() });
    expect(handler).not.toHaveBeenCalled();
  });

  it('preventDefault is called by default', () => {
    const handler = vi.fn();
    render(<Bind combo="mod+b" handler={handler} />);
    const event = new KeyboardEvent('keydown', { key: 'b', ...modKey(), cancelable: true });
    document.dispatchEvent(event);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it('preventDefault can be disabled', () => {
    const handler = vi.fn();
    render(<Bind combo="mod+b" handler={handler} preventDefault={false} />);
    const event = new KeyboardEvent('keydown', { key: 'b', ...modKey(), cancelable: true });
    document.dispatchEvent(event);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(false);
  });

  it('fires when typing in an input by default (modifier combos are global)', () => {
    const handler = vi.fn();
    const { getByTestId } = render(<Bind combo="mod+b" handler={handler} withInput />);
    fireEvent.keyDown(getByTestId('field'), { key: 'b', ...modKey() });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('ignoreWhenTyping suppresses the hotkey while focus is in an input', () => {
    const handler = vi.fn();
    const { getByTestId } = render(
      <Bind combo="mod+b" handler={handler} ignoreWhenTyping withInput />,
    );
    fireEvent.keyDown(getByTestId('field'), { key: 'b', ...modKey() });
    expect(handler).not.toHaveBeenCalled();
  });

  it('uses the latest handler closure without rebinding', () => {
    function Host(): React.JSX.Element {
      const [count, setCount] = useState(0);
      useHotkey('mod+b', () => setCount((c) => c + 1));
      return <div data-testid="count">{count}</div>;
    }
    const { getByTestId } = render(<Host />);
    fireEvent.keyDown(document, { key: 'b', ...modKey() });
    fireEvent.keyDown(document, { key: 'b', ...modKey() });
    expect(getByTestId('count').textContent).toBe('2');
  });
});
