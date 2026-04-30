import { afterEach, describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { useInjectStyles } from './useInjectStyles.js';

function Probe({ id, css }: { id: string; css: string }) {
  useInjectStyles(id, css);
  return null;
}

afterEach(() => {
  document.head.querySelectorAll('style[id^="ts-test-"]').forEach((el) => {
    el.remove();
  });
});

describe('useInjectStyles', () => {
  it('injects a style tag once per id', () => {
    render(
      <>
        <Probe id="ts-test-a" css=".x { color: red }" />
        <Probe id="ts-test-a" css=".x { color: red }" />
      </>,
    );
    expect(document.querySelectorAll('style#ts-test-a')).toHaveLength(1);
  });

  it('updates content when css changes for the same id', () => {
    const { rerender } = render(<Probe id="ts-test-b" css=".x { color: red }" />);
    expect(document.getElementById('ts-test-b')?.textContent).toBe(
      '.x { color: red }',
    );
    rerender(<Probe id="ts-test-b" css=".x { color: blue }" />);
    expect(document.getElementById('ts-test-b')?.textContent).toBe(
      '.x { color: blue }',
    );
  });
});
