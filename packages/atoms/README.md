# @touchstone/atoms

Atomic-design "atoms" — the smallest composable building blocks. Every atom reads from `@touchstone/themes` so theming is consistent across the library.

| Component | Purpose                                                       |
| --------- | ------------------------------------------------------------- |
| `Box`     | Layout primitive with `padding`, `radius`, `surface` variants |
| `Text`    | Typographic atom mapped to the type scale                     |
| `Button`  | Variants × sizes; supports `asChild` via Radix `Slot`         |
| `Input`   | Bare input with `invalid` styling; pair with `Field` for a11y |

```tsx
import { Button } from '@touchstone/atoms';

<Button intent="primary" size="md">Save</Button>
```
