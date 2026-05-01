import { forwardRef } from 'react';
import type { ElementType, ReactNode, Ref } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { BaseComponentProps } from '@touchstone/atoms';
import * as styles from './PageHeader.css.js';

type PageHeaderVariants = NonNullable<RecipeVariants<typeof styles.pageHeader>>;

/**
 * Section heading for the top of a page or major sub-region: a typographically-
 * weighted `title`, an optional muted `description`, an optional `breadcrumbs`
 * row above, optional inline `meta` (badges, status, counts) next to the
 * title, and optional `actions` aligned to the trailing edge.
 *
 * The default heading level is `h1`; pass `as="h2"` (or lower) when the
 * PageHeader is nested inside a parent heading region. Set `divider` for a
 * bottom border that separates the header from the page body.
 */
export interface PageHeaderProps extends BaseComponentProps, PageHeaderVariants {
  /** Page title. Becomes the heading. */
  title: string;
  /** Optional supporting copy beneath the title. */
  description?: string;
  /** Inline status next to the title — typically Badge(s). */
  meta?: ReactNode;
  /** Trailing-edge actions — typically Button(s). Wraps on narrow viewports. */
  actions?: ReactNode;
  /** Breadcrumbs row above the title — typically a `<nav>` of links. */
  breadcrumbs?: ReactNode;
  /** Heading element. @default 'h1' */
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

export const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(
  function PageHeader(
    {
      title,
      description,
      meta,
      actions,
      breadcrumbs,
      as = 'h1',
      divider,
      id,
      'data-testid': dataTestId,
    },
    ref,
  ) {
    const Heading = as as ElementType;
    return (
      <header
        ref={ref as Ref<HTMLElement>}
        id={id}
        data-testid={dataTestId}
        className={styles.pageHeader({ divider })}
      >
        {breadcrumbs ? (
          <div className={styles.breadcrumbs}>{breadcrumbs}</div>
        ) : null}
        <div className={styles.headingRow}>
          <div className={styles.titleBlock}>
            <div className={styles.titleRow}>
              <Heading className={styles.title}>{title}</Heading>
              {meta ? <span className={styles.meta}>{meta}</span> : null}
            </div>
            {description ? (
              <p className={styles.description}>{description}</p>
            ) : null}
          </div>
          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </div>
      </header>
    );
  },
);
