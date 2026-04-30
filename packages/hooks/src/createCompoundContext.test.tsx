import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { createCompoundContext } from './createCompoundContext.js';

const [Provider, useScope] = createCompoundContext<{ label: string }>('TestRoot');

function Child() {
  const { label } = useScope('TestRoot.Child');
  return <span data-testid="child">{label}</span>;
}

describe('createCompoundContext', () => {
  it('child reads value when wrapped in provider', () => {
    const { getByTestId } = render(
      <Provider value={{ label: 'hello' }}>
        <Child />
      </Provider>,
    );
    expect(getByTestId('child').textContent).toBe('hello');
  });

  it('throws a helpful error when used outside the parent', () => {
    const original = console.error;
    console.error = () => {};
    try {
      expect(() => render(<Child />)).toThrow(
        '<TestRoot.Child> must be rendered inside <TestRoot>.',
      );
    } finally {
      console.error = original;
    }
  });
});
