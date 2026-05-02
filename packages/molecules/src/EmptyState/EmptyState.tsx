import { createContext, forwardRef, useContext, useId } from 'react';
import type { ElementType, ReactNode, Ref } from 'react';
import type { BaseComponentProps } from '@touchstone/atoms';
import * as styles from './EmptyState.css.js';

type Level = 'section' | 'page';

interface EmptyStateContextValue {
  level: Level;
  titleId: string;
}

const EmptyStateContext = createContext<EmptyStateContextValue | null>(null);
EmptyStateContext.displayName = 'EmptyStateContext';

function useEmptyState(consumerName: string): EmptyStateContextValue {
  const ctx = useContext(EmptyStateContext);
  if (ctx === null) {
    throw new Error(`<${consumerName}> must be rendered inside <EmptyState>.`);
  }
  return ctx;
}

export interface EmptyStateProps extends BaseComponentProps {
  /**
   * `section` (default) renders inline — for empty list bodies, empty
   * tables, empty drawers. `page` renders as a vh-tall takeover with a
   * larger heading — for first-run screens or "no results" full pages.
   * @default 'section'
   */
  level?: Level;
  /** Children — typically `EmptyState.Icon`, `.Title`, `.Description`, `.Actions`. */
  children?: ReactNode;
}

/**
 * The zero-results / first-run / empty-list placeholder. Sits inside a
 * list, an empty table, or a freshly-created workspace and tells the user
 * what to do next. Compose `EmptyState.Icon`, `.Title`, `.Description`,
 * and `.Actions` — every part is optional, so a bare title is valid.
 *
 * The root renders as a `<section>` with `aria-labelledby` wired to the
 * Title — assistive tech announces the heading when the empty region
 * receives focus.
 */
const EmptyStateRoot = forwardRef<HTMLElement, EmptyStateProps>(function EmptyState(
  { level = 'section', children, id, 'data-testid': dataTestId },
  ref,
) {
  const titleId = useId();
  return (
    <EmptyStateContext.Provider value={{ level, titleId }}>
      <section
        ref={ref as Ref<HTMLElement>}
        id={id}
        data-testid={dataTestId}
        aria-labelledby={titleId}
        className={styles.root({ level })}
      >
        {children}
      </section>
    </EmptyStateContext.Provider>
  );
});

export interface EmptyStateIconProps extends BaseComponentProps {
  children: ReactNode;
}

const EmptyStateIcon = forwardRef<HTMLSpanElement, EmptyStateIconProps>(function EmptyStateIcon(
  { children, id, 'data-testid': dataTestId },
  ref,
) {
  const { level } = useEmptyState('EmptyState.Icon');
  return (
    <span
      ref={ref}
      id={id}
      data-testid={dataTestId}
      aria-hidden="true"
      className={styles.icon({ level })}
    >
      {children}
    </span>
  );
});

export interface EmptyStateTitleProps extends BaseComponentProps {
  /** Heading element. @default 'h2' */
  as?: ElementType;
  children?: ReactNode;
}

const EmptyStateTitle = forwardRef<HTMLHeadingElement, EmptyStateTitleProps>(
  function EmptyStateTitle({ as: Component = 'h2', children, id, 'data-testid': dataTestId }, ref) {
    const { level, titleId } = useEmptyState('EmptyState.Title');
    return (
      <Component
        ref={ref as Ref<HTMLHeadingElement>}
        id={id ?? titleId}
        data-testid={dataTestId}
        className={styles.title({ level })}
      >
        {children}
      </Component>
    );
  },
);

export interface EmptyStateDescriptionProps extends BaseComponentProps {
  children?: ReactNode;
}

const EmptyStateDescription = forwardRef<HTMLParagraphElement, EmptyStateDescriptionProps>(
  function EmptyStateDescription({ children, id, 'data-testid': dataTestId }, ref) {
    // call to ensure scope
    useEmptyState('EmptyState.Description');
    return (
      <p ref={ref} id={id} data-testid={dataTestId} className={styles.description}>
        {children}
      </p>
    );
  },
);

export interface EmptyStateActionsProps extends BaseComponentProps {
  children?: ReactNode;
}

const EmptyStateActions = forwardRef<HTMLDivElement, EmptyStateActionsProps>(
  function EmptyStateActions({ children, id, 'data-testid': dataTestId }, ref) {
    useEmptyState('EmptyState.Actions');
    return (
      <div ref={ref} id={id} data-testid={dataTestId} className={styles.actions}>
        {children}
      </div>
    );
  },
);

export const EmptyState = Object.assign(EmptyStateRoot, {
  Icon: EmptyStateIcon,
  Title: EmptyStateTitle,
  Description: EmptyStateDescription,
  Actions: EmptyStateActions,
});
