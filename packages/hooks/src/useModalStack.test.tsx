import { describe, expect, it } from 'vitest';
import { act, render } from '@testing-library/react';
import { useModalStackEntry } from './useModalStack.js';
import type { UseModalStackEntryReturn } from './useModalStack.js';

function Probe({
  active,
  out,
}: {
  active: boolean;
  out: { current: UseModalStackEntryReturn | null };
}): null {
  out.current = useModalStackEntry(active);
  return null;
}

describe('useModalStackEntry', () => {
  it('reports a single entry as topmost', () => {
    const out = { current: null as UseModalStackEntryReturn | null };
    render(<Probe active out={out} />);
    expect(out.current?.index).toBe(0);
    expect(out.current?.isTop).toBe(true);
    expect(out.current?.size).toBe(1);
  });

  it('only the deepest entry reports isTop', () => {
    const a = { current: null as UseModalStackEntryReturn | null };
    const b = { current: null as UseModalStackEntryReturn | null };
    render(
      <>
        <Probe active out={a} />
        <Probe active out={b} />
      </>,
    );
    expect(a.current?.isTop).toBe(false);
    expect(b.current?.isTop).toBe(true);
    expect(a.current?.size).toBe(2);
    expect(b.current?.index).toBe(1);
  });

  it('unregisters on unmount and the previous entry becomes topmost', () => {
    const a = { current: null as UseModalStackEntryReturn | null };
    const b = { current: null as UseModalStackEntryReturn | null };
    const result = render(
      <>
        <Probe active out={a} />
        <Probe active out={b} />
      </>,
    );
    expect(b.current?.isTop).toBe(true);

    act(() => {
      result.rerender(
        <>
          <Probe active out={a} />
        </>,
      );
    });

    expect(a.current?.isTop).toBe(true);
    expect(a.current?.size).toBe(1);
  });

  it('does not register when inactive', () => {
    const out = { current: null as UseModalStackEntryReturn | null };
    render(<Probe active={false} out={out} />);
    expect(out.current?.size).toBe(0);
    expect(out.current?.isTop).toBe(false);
  });
});
