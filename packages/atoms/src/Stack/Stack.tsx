import { forwardRef } from 'react';
import type { ElementType, ReactNode, Ref } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { BaseComponentProps } from '../types.js';
import { stack } from './Stack.css.js';

type StackVariants = NonNullable<RecipeVariants<typeof stack>>;

/**
 * Flex layout primitive. `direction` × `gap` × `align` × `justify` × `wrap`
 * cover almost every consumer flex case without forcing them to reach for
 * `<Surface style={{ display: 'flex' }}>`. Use `Surface` when you also need
 * a background tier; use `Stack` when you only need the layout.
 */
export interface StackProps extends BaseComponentProps, StackVariants {
  /** Element to render. @default 'div' */
  as?: ElementType;
  /** Stack content. */
  children?: ReactNode;
  /** Additional class names. */
  className?: string;
}

export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  {
    as: Component = 'div',
    direction,
    gap,
    align,
    justify,
    wrap,
    className,
    children,
    id,
    'data-testid': dataTestId,
  },
  ref,
) {
  const recipeClass = stack({ direction, gap, align, justify, wrap });
  return (
    <Component
      ref={ref as Ref<HTMLElement>}
      id={id}
      data-testid={dataTestId}
      className={[recipeClass, className].filter(Boolean).join(' ')}
    >
      {children}
    </Component>
  );
});
