# @touchstone/themes

The type-safe theme contract that every Touchstone component reads from, plus the `lightTheme` and `darkTheme` presets.

```tsx
import { vars, lightTheme, darkTheme } from '@touchstone/themes';

// Apply a theme
<body className={lightTheme}>...</body>

// Read a token from a component's vanilla-extract style
import { style } from '@vanilla-extract/css';
import { vars } from '@touchstone/themes';

export const card = style({
  background: vars.color.bgRaised,
  padding: vars.space[4],
  borderRadius: vars.radius.md,
});
```

To add a new theme, call `createTheme(vars, { ... })` with a value for every contract slot — TypeScript will refuse anything else.
