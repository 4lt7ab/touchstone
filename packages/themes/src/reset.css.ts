import { globalStyle } from '@vanilla-extract/css';

/**
 * Single, deliberate global Touchstone ships: every element computes its
 * width and height with `border-box` so a `width: 100%` field with padding
 * and a border still fits its parent. The browser default `content-box` is
 * a 1996-vintage mistake the rest of the ecosystem has long since
 * overridden — Touchstone follows suit so its own form fields actually
 * work and so a consumer's plain element next to a Touchstone component
 * computes the same way.
 *
 * This is the only `globalStyle` in the library that intentionally
 * targets unscoped selectors; theme-specific rules in the sibling files
 * stay scoped to `.${themeClass}`.
 */
globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
});
