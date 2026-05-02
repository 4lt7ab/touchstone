import { forwardRef, useRef } from 'react';
import type {
  AriaAttributes,
  CSSProperties,
  ElementType,
  MouseEventHandler,
  ReactNode,
  Ref,
} from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { useGlowPulse, useMergedRefs } from '@touchstone/hooks';
import type { BaseComponentProps } from '../types.js';
import { surface } from './Surface.css.js';

type SurfaceVariants = NonNullable<RecipeVariants<typeof surface>>;

/**
 * The library's foundational layout + surface primitive. `level` chooses one
 * of the semantic background tiers from the theme contract; `padding` /
 * `radius` / `glow` map to the same tokens at fixed scales. Pair with `as` to
 * render any HTML element while keeping the visual treatment.
 *
 * `style` and `className` are intentional escape hatches for layout work
 * (flex, grid, gap) that the recipe doesn't express. Visual tokens — colors,
 * shadows, radii — must come through the variant API, not through `style`.
 */
export interface SurfaceProps extends BaseComponentProps, SurfaceVariants {
  /** Element to render. @default 'div' */
  as?: ElementType;
  /** Surface content. */
  children?: ReactNode;
  /** Additional class names — typically a vanilla-extract layout class. */
  className?: string;
  /** Inline styles for layout-only properties (display, flex, grid, gap). */
  style?: CSSProperties;
  /** Click handler for interactive surfaces. */
  onClick?: MouseEventHandler<HTMLElement>;
  /** ARIA role override. */
  role?: string;
  'aria-label'?: AriaAttributes['aria-label'];
  'aria-labelledby'?: AriaAttributes['aria-labelledby'];
  'aria-describedby'?: AriaAttributes['aria-describedby'];
  'aria-hidden'?: AriaAttributes['aria-hidden'];
}

export const Surface = forwardRef<HTMLElement, SurfaceProps>(function Surface(
  { as: Component = 'div', padding, radius, level, glow, className, children, ...rest },
  ref,
) {
  const internalRef = useRef<HTMLElement>(null);
  const mergedRef = useMergedRefs<HTMLElement>(internalRef, ref);
  useGlowPulse(glow === 'pulse' ? internalRef : NOOP_REF);

  const recipeClass = surface({ padding, radius, level, glow });
  return (
    <Component
      ref={mergedRef as Ref<HTMLElement>}
      className={[recipeClass, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </Component>
  );
});

const NOOP_REF = { current: null } as const;
