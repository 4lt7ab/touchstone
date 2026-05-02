import { useEffect } from 'react';

export interface UsePageBackgroundOptions {
  /**
   * CSS value to write to `document.body.style.backgroundColor`. Typically
   * the resolved theme token, e.g. `vars.color.bgPage` from
   * `@touchstone/themes` — which already encodes a `var(--…)` reference, so
   * the body picks up whichever theme class is on the document.
   */
  background: string;
  /**
   * CSS value for `document.body.style.color`. Optional; pass when the
   * theme's foreground should follow the page background.
   */
  foreground?: string;
}

/**
 * Paint a theme background and foreground onto `document.body` for the
 * lifetime of the calling component, restoring whatever was inline on
 * `body.style` on unmount. The bridge between "Touchstone has a theme"
 * and "the consumer's `<body>` knows it" — without this, the zero-config
 * render leaves a white viewport behind any non-full-bleed layout.
 *
 * SSR-safe: bails out when `document` is undefined.
 *
 * Usage:
 * ```tsx
 * import { vars } from '@4lt7ab/touchstone';
 * import { usePageBackground } from '@4lt7ab/touchstone';
 *
 * function App() {
 *   usePageBackground({
 *     background: vars.color.bgPage,
 *     foreground: vars.color.fg,
 *   });
 *   return <AppShell>...</AppShell>;
 * }
 * ```
 */
export function usePageBackground(options: UsePageBackgroundOptions): void {
  const { background, foreground } = options;
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const body = document.body;
    const prevBackground = body.style.backgroundColor;
    const prevColor = body.style.color;
    body.style.backgroundColor = background;
    if (foreground !== undefined) body.style.color = foreground;
    return () => {
      body.style.backgroundColor = prevBackground;
      if (foreground !== undefined) body.style.color = prevColor;
    };
  }, [background, foreground]);
}
