import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Background } from './Background.js';

describe('Background', () => {
  it('renders aria-hidden so screen readers skip it', () => {
    const { container } = render(<Background data-testid="bg" />);
    const root = container.querySelector('[data-testid="bg"]');
    expect(root).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a layer for each pattern variant', () => {
    for (const pattern of ['none', 'grid', 'dots', 'mesh'] as const) {
      const { container, unmount } = render(<Background pattern={pattern} />);
      expect(container.firstChild).toBeTruthy();
      unmount();
    }
  });

  it('omits the canvas when no scene is set', () => {
    const { container } = render(<Background data-testid="bg" />);
    expect(container.querySelector('canvas')).toBeNull();
  });

  it('mounts a canvas and runs the scene fn when scene is provided', () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({}) as never);
    const cleanup = vi.fn();
    const sceneFn = vi.fn(() => cleanup);

    const { container, unmount } = render(<Background scene={sceneFn} />);
    expect(container.querySelector('canvas')).not.toBeNull();
    expect(sceneFn).toHaveBeenCalledTimes(1);

    unmount();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('skips the scene fn when prefers-reduced-motion is set', () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({}) as never);
    const original = window.matchMedia;
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }) as never;

    const sceneFn = vi.fn(() => () => {});
    render(<Background scene={sceneFn} />);
    expect(sceneFn).not.toHaveBeenCalled();

    window.matchMedia = original;
  });
});
