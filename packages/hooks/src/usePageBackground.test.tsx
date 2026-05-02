import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePageBackground } from './usePageBackground.js';

describe('usePageBackground', () => {
  it('paints body backgroundColor and color from the given values', () => {
    const { unmount } = renderHook(() =>
      usePageBackground({
        background: 'var(--bg)',
        foreground: 'var(--fg)',
      }),
    );
    expect(document.body.style.backgroundColor).toBe('var(--bg)');
    expect(document.body.style.color).toBe('var(--fg)');
    unmount();
  });

  it('paints background only when foreground is omitted', () => {
    document.body.style.color = 'rgb(50, 50, 50)';
    const { unmount } = renderHook(() => usePageBackground({ background: 'var(--bg)' }));
    expect(document.body.style.backgroundColor).toBe('var(--bg)');
    expect(document.body.style.color).toBe('rgb(50, 50, 50)');
    unmount();
    document.body.removeAttribute('style');
  });

  it('restores prior inline styles on unmount', () => {
    document.body.style.backgroundColor = 'rgb(10, 10, 10)';
    document.body.style.color = 'rgb(200, 200, 200)';
    const { unmount } = renderHook(() =>
      usePageBackground({
        background: 'var(--bg)',
        foreground: 'var(--fg)',
      }),
    );
    expect(document.body.style.backgroundColor).toBe('var(--bg)');
    expect(document.body.style.color).toBe('var(--fg)');
    unmount();
    expect(document.body.style.backgroundColor).toBe('rgb(10, 10, 10)');
    expect(document.body.style.color).toBe('rgb(200, 200, 200)');
    document.body.removeAttribute('style');
  });
});
