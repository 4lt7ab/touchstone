import { forwardRef } from 'react';
import type { CSSProperties, ElementType, ReactNode, Ref } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { BaseComponentProps } from '../types.js';
import { grid } from './Grid.css.js';

type GridVariants = NonNullable<RecipeVariants<typeof grid>>;

export type GridMin = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const MIN_TOKENS: Record<GridMin, string> = {
  xs: '8rem',
  sm: '12rem',
  md: '16rem',
  lg: '20rem',
  xl: '24rem',
};

export type GridColumns = number | { min: GridMin };

/**
 * CSS-Grid layout primitive — sibling to `Stack`. Pass `columns` as a fixed
 * count (`columns={3}`) for forms and dashboards, or `{ min: 'md' }` for an
 * auto-fit responsive card grid. The `gap` / `align` / `justify` vocabulary
 * matches `Stack` so the two layout primitives read as one family.
 *
 * Closes the `Surface style={{ display: 'grid' }}` escape hatch — visual
 * tokens and layout structure both come through the prop API, not inline
 * `style`.
 */
export interface GridProps extends BaseComponentProps, GridVariants {
  /** Element to render. @default 'div' */
  as?: ElementType;
  /**
   * Column layout. A number renders that many equal-width tracks; `{ min }`
   * renders a responsive `auto-fit` grid where each column is at least the
   * named min width. Omit for a single-column grid.
   */
  columns?: GridColumns;
  /** Grid content. */
  children?: ReactNode;
  /** Additional class names. */
  className?: string;
}

function resolveTemplate(columns: GridColumns | undefined): string | undefined {
  if (columns === undefined) return undefined;
  if (typeof columns === 'number') {
    return `repeat(${columns}, minmax(0, 1fr))`;
  }
  return `repeat(auto-fit, minmax(${MIN_TOKENS[columns.min]}, 1fr))`;
}

export const Grid = forwardRef<HTMLElement, GridProps>(function Grid(
  {
    as: Component = 'div',
    columns,
    gap,
    align,
    justify,
    className,
    children,
    id,
    'data-testid': dataTestId,
  },
  ref,
) {
  const recipeClass = grid({ gap, align, justify });
  const template = resolveTemplate(columns);
  const style: CSSProperties | undefined = template ? { gridTemplateColumns: template } : undefined;
  return (
    <Component
      ref={ref as Ref<HTMLElement>}
      id={id}
      data-testid={dataTestId}
      className={[recipeClass, className].filter(Boolean).join(' ')}
      style={style}
    >
      {children}
    </Component>
  );
});
