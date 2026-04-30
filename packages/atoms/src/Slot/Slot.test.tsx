import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slot } from './Slot.js';

describe('Slot', () => {
  it('clones the single child and forwards plain props', () => {
    const { getByRole } = render(
      <Slot data-testid="slot">
        <a href="/somewhere">linked</a>
      </Slot>,
    );
    const link = getByRole('link', { name: 'linked' });
    expect(link).toHaveAttribute('href', '/somewhere');
    expect(link).toHaveAttribute('data-testid', 'slot');
  });

  it('concatenates className from parent and child', () => {
    const { getByRole } = render(
      <Slot className="parent">
        <button className="child">x</button>
      </Slot>,
    );
    expect(getByRole('button').className).toBe('parent child');
  });

  it('lets the child win on conflicting plain props', () => {
    const { getByRole } = render(
      <Slot title="parent">
        <a href="/x" title="child">
          x
        </a>
      </Slot>,
    );
    expect(getByRole('link')).toHaveAttribute('title', 'child');
  });

  it('forwards a ref to the child element', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Slot ref={ref}>
        <a href="/x">x</a>
      </Slot>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('runs both handlers on a composed event (parent first, then child)', async () => {
    const calls: string[] = [];
    const parent = vi.fn(() => calls.push('parent'));
    const child = vi.fn(() => calls.push('child'));
    const { getByRole } = render(
      <Slot onClick={parent}>
        <button onClick={child}>x</button>
      </Slot>,
    );
    await userEvent.click(getByRole('button'));
    expect(calls).toEqual(['parent', 'child']);
  });

  it('renders nothing when children is not a valid element', () => {
    const { container } = render(<Slot>{null}</Slot>);
    expect(container.firstChild).toBeNull();
  });
});
