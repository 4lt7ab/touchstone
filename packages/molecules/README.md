# @touchstone/molecules

Atomic-design "molecules" — small compositions of atoms that own their own a11y wiring.

| Component          | Composes / behavior                                                                                                                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Field`            | `Text` (label) + `Input` + hint + error, with `aria-describedby` and `aria-invalid` wired automatically.                                                                                              |
| `SegmentedControl` | One-of-N selector following the WAI-ARIA radiogroup pattern. Uses `useRovingFocus` for arrow-key navigation. Active segment uses `actionPrimary` to match the primary `Button`.                       |
| `AlertBanner`      | Inline status panel rendering the feedback fg/bg pairs (success / warning / danger / info). Optional dismiss button. Defaults to `role="alert"` for danger/warning, `role="status"` for success/info. |

```tsx
import { Field, SegmentedControl, AlertBanner } from '@touchstone/molecules';

<Field label="maker's mark" hint="the ledger keeps it." />

<SegmentedControl
  aria-label="the forging phase"
  options={[
    { value: 'stoke', label: 'stoke' },
    { value: 'hammer', label: 'hammer' },
    { value: 'cool', label: 'cool' },
  ]}
/>

<AlertBanner tone="warning" title="look once more">
  the metal cools faster than the apprentice expects.
</AlertBanner>
```
