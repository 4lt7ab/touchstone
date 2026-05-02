import { forwardRef } from 'react';
import type { ElementType, ReactNode, Ref } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { BaseComponentProps } from '../types.js';
import { container } from './Container.css.js';

type ContainerVariants = NonNullable<RecipeVariants<typeof container>>;

/**
 * Centred, max-width content wrapper. The widths are named so consumers
 * stop guessing pixel values: `prose` is the readable-body measure (~65ch),
 * `narrow` for forms and aside columns, `wide` for the typical app body,
 * `full` to opt out of the max while keeping the centring no-op.
 *
 * Use inside an `AppShell.Main`, a `Dialog.Content`, or any standalone
 * page where the body should not stretch edge-to-edge.
 */
export interface ContainerProps extends BaseComponentProps, ContainerVariants {
  /** Element to render. @default 'div' */
  as?: ElementType;
  /** Container content. */
  children?: ReactNode;
}

export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(
  { as: Component = 'div', width, padding, children, id, 'data-testid': dataTestId },
  ref,
) {
  return (
    <Component
      ref={ref as Ref<HTMLElement>}
      id={id}
      data-testid={dataTestId}
      className={container({ width, padding })}
    >
      {children}
    </Component>
  );
});
