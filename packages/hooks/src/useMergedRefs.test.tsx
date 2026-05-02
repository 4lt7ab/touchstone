import { describe, expect, it } from 'vitest';
import { createRef, useRef } from 'react';
import { render } from '@testing-library/react';
import { useMergedRefs } from './useMergedRefs.js';

function Probe({ outer }: { outer: ReturnType<typeof createRef<HTMLDivElement>> }) {
  const inner = useRef<HTMLDivElement | null>(null);
  const merged = useMergedRefs(outer, inner);
  return <div ref={merged} data-testid="probe" data-inner={inner.current?.tagName ?? ''} />;
}

describe('useMergedRefs', () => {
  it('forwards the same node to multiple refs', () => {
    const outer = createRef<HTMLDivElement>();
    const { getByTestId } = render(<Probe outer={outer} />);
    const node = getByTestId('probe');
    expect(outer.current).toBe(node);
  });
});
