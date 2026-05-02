# @touchstone/react

The umbrella package most consumers should install. Re-exports every Touchstone atomic layer plus theme contract and presets.

```tsx
import { Button, Field, CheckIcon, vars, warmSandTheme } from '@touchstone/react';
import '@touchstone/react/styles.css';

export function App() {
  return (
    <body className={warmSandTheme}>
      <Field label="Email" hint="We never share your email." />
      <Button intent="primary">Save</Button>
    </body>
  );
}
```
