# @touchstone/tokens

Raw design tokens — color, space, font, radius, z-index — exported as plain TypeScript objects.

This package has no runtime: it's consumed by `@touchstone/themes` to build a type-safe theme contract, and that contract is what every component in the library reads from.

```ts
import { color, space, radius } from '@touchstone/tokens';
```
