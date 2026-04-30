import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { useScrollLock } from './useScrollLock.js';

function Probe({ enabled }: { enabled: boolean }) {
  useScrollLock(enabled);
  return null;
}

describe('useScrollLock', () => {
  it('locks body overflow while enabled and restores on unmount', () => {
    document.body.style.overflow = 'auto';
    const { unmount } = render(<Probe enabled />);
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('auto');
  });

  it('does not touch overflow when disabled', () => {
    document.body.style.overflow = 'auto';
    const { unmount } = render(<Probe enabled={false} />);
    expect(document.body.style.overflow).toBe('auto');
    unmount();
  });

  it('reference-counts overlapping locks', () => {
    document.body.style.overflow = 'auto';
    const a = render(<Probe enabled />);
    const b = render(<Probe enabled />);
    expect(document.body.style.overflow).toBe('hidden');
    a.unmount();
    expect(document.body.style.overflow).toBe('hidden');
    b.unmount();
    expect(document.body.style.overflow).toBe('auto');
  });
});
