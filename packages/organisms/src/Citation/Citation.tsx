import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { BaseComponentProps } from '@touchstone/atoms';
import { ExternalLinkIcon } from '@touchstone/icons';
import { Popover } from '../Popover/Popover.js';
import * as styles from './Citation.css.js';

type MarkerVariants = NonNullable<RecipeVariants<typeof styles.marker>>;

/**
 * Inline numbered reference. Clicking the marker opens a `Popover` with the
 * source title, a snippet, and an optional outbound link — the standard
 * pattern for grounding an assistant turn against its sources.
 *
 * Marker text defaults to the `index` ordinal; pass `children` to override
 * (e.g. an asterisk, a letter, or a custom mark). Use `<CitationList>` for
 * the footer-style sources block beneath a message.
 */
export interface CitationProps extends BaseComponentProps, MarkerVariants {
  /** Numeric ordinal shown in the marker (1-based). */
  index: number;
  /** Source title — bolded inside the popover. */
  title: ReactNode;
  /** Body snippet — the excerpt being cited. */
  snippet?: ReactNode;
  /** Outbound link. When set, the popover shows a "Open source" link. */
  href?: string;
  /** Override the marker text (defaults to the index). */
  children?: ReactNode;
  /** Accessible label for the marker button. @default `Source {index}` */
  'aria-label'?: string;
}

export const Citation = forwardRef<HTMLButtonElement, CitationProps>(function Citation(
  {
    index,
    title,
    snippet,
    href,
    tone,
    children,
    id,
    'data-testid': dataTestId,
    'aria-label': ariaLabel,
  },
  ref,
) {
  const markerLabel = ariaLabel ?? `Source ${index}`;
  return (
    <Popover>
      <Popover.Trigger>
        <button
          ref={ref}
          type="button"
          id={id}
          data-testid={dataTestId}
          aria-label={markerLabel}
          className={styles.marker({ tone })}
        >
          {children ?? index}
        </button>
      </Popover.Trigger>
      <Popover.Content side="top" align="center">
        <div className={styles.card}>
          <span className={styles.title}>{title}</span>
          {snippet ? <span className={styles.snippet}>{snippet}</span> : null}
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className={styles.link}
            >
              Open source
              <ExternalLinkIcon size={12} />
            </a>
          ) : null}
        </div>
      </Popover.Content>
    </Popover>
  );
});

export interface CitationListItem {
  /** Numeric ordinal — matches the inline marker. */
  index: number;
  /** Source title. */
  title: ReactNode;
  /** Snippet excerpt. */
  snippet?: ReactNode;
  /** Outbound link. */
  href?: string;
}

export interface CitationListProps extends BaseComponentProps {
  /** Ordered list of sources to display under a message. */
  items: ReadonlyArray<CitationListItem>;
}

/**
 * Footer-style list of sources beneath a message. Mirrors the inline
 * `<Citation>` markers — each row is numbered, linked when an `href` is
 * present, and shows the snippet on the same line.
 */
export const CitationList = forwardRef<HTMLOListElement, CitationListProps>(
  function CitationList({ items, id, 'data-testid': dataTestId }, ref) {
    return (
      <ol ref={ref} id={id} data-testid={dataTestId} className={styles.list}>
        {items.map((item) => (
          <li key={item.index} className={styles.listItem}>
            <span className={styles.listIndex} aria-hidden="true">
              [{item.index}]
            </span>
            <span>
              <span className={styles.title}>{item.title}</span>
              {item.snippet ? <> — {item.snippet}</> : null}
              {item.href ? (
                <>
                  {' '}
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={styles.link}
                  >
                    open <ExternalLinkIcon size={12} />
                  </a>
                </>
              ) : null}
            </span>
          </li>
        ))}
      </ol>
    );
  },
);
