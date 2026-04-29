# @touchstone/molecules

Atomic-design "molecules" — small compositions of atoms that own their own a11y wiring.

| Component | Composes                                  |
| --------- | ----------------------------------------- |
| `Field`   | `Text` (label) + `Input` + hint + error   |

```tsx
import { Field } from '@touchstone/molecules';

<Field label="Email" hint="We never share your email." />
<Field label="Email" error="Email is required" />
```
