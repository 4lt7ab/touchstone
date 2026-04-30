import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { useEscapeKey } from './useEscapeKey.js';

function Probe({
  handler,
  enabled,
}: {
  handler: (event: KeyboardEvent) => void;
  enabled: boolean;
}) {
  useEscapeKey(handler, enabled);
  return null;
}

describe('useEscapeKey', () => {
  it('fires the handler on Escape when enabled', () => {
    const handler = vi.fn();
    render(<Probe handler={handler} enabled />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('ignores other keys', () => {
    const handler = vi.fn();
    render(<Probe handler={handler} enabled />);
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(handler).not.toHaveBeenCalled();
  });

  it('does not attach when disabled', () => {
    const handler = vi.fn();
    render(<Probe handler={handler} enabled={false} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handler).not.toHaveBeenCalled();
  });
});
