import { forwardRef, useRef } from 'react';
import type { ElementType, HTMLAttributes, Ref } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { useGlowPulse, useMergedRefs } from '@touchstone/hooks';
import { box } from './Box.css.js';

type BoxVariants = NonNullable<RecipeVariants<typeof box>>;

export interface BoxProps extends HTMLAttributes<HTMLElement>, BoxVariants {
  /**
   * The element to render. Defaults to `<div>`.
   */
  as?: ElementType;
}

export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
  { as: Component = 'div', padding, radius, surface, glow, className, ...rest },
  ref,
) {
  const internalRef = useRef<HTMLElement>(null);
  const mergedRef = useMergedRefs<HTMLElement>(internalRef, ref);
  useGlowPulse(glow === 'pulse' ? internalRef : NOOP_REF);

  const recipeClass = box({ padding, radius, surface, glow });
  return (
    <Component
      ref={mergedRef as Ref<HTMLElement>}
      className={[recipeClass, className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
});

const NOOP_REF = { current: null } as const;
