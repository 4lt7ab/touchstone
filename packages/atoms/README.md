# @touchstone/atoms

Atomic-design "atoms" — the smallest composable building blocks. Every atom reads from `@touchstone/themes` so theming is consistent across the library.

| Component  | Purpose                                                                                                                                                                                  |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Surface`  | Layout + background primitive. `level` chooses a bg tier from the theme contract; `padding` / `radius` / `glow` map to fixed scales. Accepts `style`/`className` for layout composition. |
| `Stack`    | Flex layout primitive. `direction` × `gap` × `align` × `justify` × `wrap`. Use when you only need layout; reach for `Surface` when you also need a background tier.                      |
| `Text`     | Typographic atom mapped to the type scale (`size` × `weight` × `tone`).                                                                                                                  |
| `Button`   | `intent` × `size` × `fullWidth` recipe; supports `asChild` via Radix `Slot`.                                                                                                             |
| `Input`    | Bare text input with `invalid` styling; pair with `Field` for a11y.                                                                                                                      |
| `Badge`    | Inline status pill — neutral / success / warning / danger / info / accent.                                                                                                               |
| `Divider`  | Semantic separator. `<hr>` for horizontal, `role="separator"` div for vertical.                                                                                                          |
| `Spinner`  | Loading indicator. Inherits `currentColor`. Suppressed under `prefers-reduced-motion`.                                                                                                   |
| `Skeleton` | Async-state placeholder. `text` / `box` / `circle` shapes; pulse animation respects `prefers-reduced-motion`.                                                                            |
| `Switch`   | Boolean toggle (`role="switch"` button). Controlled or uncontrolled via `checked` / `defaultChecked`.                                                                                    |
| `Checkbox` | Multi-select form control (`role="checkbox"` button) with indeterminate / `aria-checked="mixed"` support. Hidden native input shadows it for form submission.                            |

`Surface` and `Stack` accept `style`/`className` as layout escape hatches. The other atoms extend `BaseComponentProps` and explicitly enumerate the props they accept — no `style` or `className` overrides. Visual tokens come through the variant API.

```tsx
import { Button } from '@touchstone/atoms';

<Button intent="primary" size="md">
  Save
</Button>;
```
