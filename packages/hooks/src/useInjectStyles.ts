import { useEffect } from 'react';

/**
 * Inject a `<style id={id}>` tag into `<head>` once. If a tag with the same
 * id already exists, only its text content is updated (and only if the CSS
 * actually changed). Used for runtime-generated styles that recipes can't
 * host inline — e.g. component-scoped `@keyframes`.
 *
 * SSR-safe: bails out when `document` is undefined.
 */
export function useInjectStyles(id: string, css: string): void {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    let el = document.getElementById(id) as HTMLStyleElement | null;
    if (el) {
      if (el.textContent !== css) el.textContent = css;
      return;
    }
    el = document.createElement('style');
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }, [id, css]);
}
