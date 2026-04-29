# @touchstone/icons

React icon components. All icons share the same `IconProps` shape and are accessible-by-default: they are hidden from assistive tech unless you pass a `title`.

```tsx
import { CheckIcon } from '@touchstone/icons';

<CheckIcon size={20} title="Saved" />
```

The starter set is intentionally tiny. Add new icons as `<Name>Icon.tsx` next to the existing ones, then export them from `src/index.ts`.
