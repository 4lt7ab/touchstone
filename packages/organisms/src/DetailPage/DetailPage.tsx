import { Children, createContext, forwardRef, isValidElement, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ElementType, ReactElement, ReactNode, Ref } from 'react';
import type { BaseComponentProps } from '@touchstone/atoms';
import * as styles from './DetailPage.css.js';

interface DetailPageContextValue {
  actionsSlotEl: HTMLElement | null;
  registerActionsSlot: (el: HTMLElement | null) => void;
  hasRightPanel: boolean;
}

const DetailPageContext = createContext<DetailPageContextValue | null>(null);
DetailPageContext.displayName = 'DetailPageContext';

function useDetailPage(consumerName: string): DetailPageContextValue {
  const ctx = useContext(DetailPageContext);
  if (ctx === null) {
    throw new Error(`<${consumerName}> must be rendered inside <DetailPage>.`);
  }
  return ctx;
}

function hasChildOfType(children: ReactNode, predicate: (el: ReactElement) => boolean): boolean {
  let found = false;
  Children.forEach(children, (child) => {
    if (isValidElement(child) && predicate(child)) found = true;
  });
  return found;
}

export interface DetailPageProps extends BaseComponentProps {
  /** Children — typically `Header`, `Meta`, `Body`, `Actions`, `RightPanel`. */
  children?: ReactNode;
}

/**
 * Entity-detail page envelope: title / subtitle / meta / body / actions /
 * optional right rail. Drops inside an `AppShell.Main` and gives the
 * consumer the layout for "show me one thing" without re-deriving the
 * spacing every time.
 *
 * `DetailPage.Actions` is portaled into the trailing slot of
 * `DetailPage.Header` — declared inline with the body, lands in the
 * header DOM. The right panel is sticky on viewports ≥960px and stacks
 * below the body on narrower screens.
 */
const DetailPageRoot = forwardRef<HTMLDivElement, DetailPageProps>(function DetailPage(
  { children, id, 'data-testid': dataTestId },
  ref,
) {
  const [actionsSlotEl, setActionsSlotEl] = useState<HTMLElement | null>(null);
  const hasRightPanel = hasChildOfType(children, (el) => el.type === DetailPageRightPanel);

  return (
    <DetailPageContext.Provider
      value={{
        actionsSlotEl,
        registerActionsSlot: setActionsSlotEl,
        hasRightPanel,
      }}
    >
      <div
        ref={ref}
        id={id}
        data-testid={dataTestId}
        className={[styles.root, hasRightPanel ? styles.rootWithPanel : '']
          .filter(Boolean)
          .join(' ')}
      >
        <div className={styles.main}>
          {Children.toArray(children).filter(
            (c) => isValidElement(c) && c.type !== DetailPageRightPanel,
          )}
        </div>
        {Children.toArray(children).filter(
          (c) => isValidElement(c) && c.type === DetailPageRightPanel,
        )}
      </div>
    </DetailPageContext.Provider>
  );
});

export interface DetailPageHeaderProps extends BaseComponentProps {
  /** Page title — becomes the page heading. */
  title: ReactNode;
  /** Optional supporting copy under the title. */
  subtitle?: ReactNode;
  /** Heading element. @default 'h1' */
  as?: 'h1' | 'h2' | 'h3';
}

const DetailPageHeader = forwardRef<HTMLElement, DetailPageHeaderProps>(function DetailPageHeader(
  { title, subtitle, as = 'h1', id, 'data-testid': dataTestId },
  ref,
) {
  const ctx = useDetailPage('DetailPage.Header');
  const Heading = as as ElementType;
  return (
    <header
      ref={ref as Ref<HTMLElement>}
      id={id}
      data-testid={dataTestId}
      className={styles.header}
    >
      <div className={styles.headingRow}>
        <div className={styles.titleBlock}>
          <Heading className={styles.title}>{title}</Heading>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </div>
        <div
          ref={ctx.registerActionsSlot}
          className={styles.actionsSlot}
          data-detailpage-actions-slot=""
        />
      </div>
    </header>
  );
});

export interface DetailPageMetaProps extends BaseComponentProps {
  children?: ReactNode;
}

const DetailPageMeta = forwardRef<HTMLDListElement, DetailPageMetaProps>(function DetailPageMeta(
  { children, id, 'data-testid': dataTestId },
  ref,
) {
  useDetailPage('DetailPage.Meta');
  return (
    <dl ref={ref} id={id} data-testid={dataTestId} className={styles.meta}>
      {children}
    </dl>
  );
});

export interface DetailPageMetaItemProps extends BaseComponentProps {
  /** Label for this meta entry. */
  label: ReactNode;
  /** The value displayed under the label. */
  children?: ReactNode;
}

const DetailPageMetaItem = forwardRef<HTMLDivElement, DetailPageMetaItemProps>(
  function DetailPageMetaItem({ label, children, id, 'data-testid': dataTestId }, ref) {
    useDetailPage('DetailPage.MetaItem');
    return (
      <div ref={ref} id={id} data-testid={dataTestId} className={styles.metaItem}>
        <dt className={styles.metaLabel}>{label}</dt>
        <dd className={styles.metaValue}>{children}</dd>
      </div>
    );
  },
);

export interface DetailPageBodyProps extends BaseComponentProps {
  children?: ReactNode;
}

const DetailPageBody = forwardRef<HTMLDivElement, DetailPageBodyProps>(function DetailPageBody(
  { children, id, 'data-testid': dataTestId },
  ref,
) {
  useDetailPage('DetailPage.Body');
  return (
    <div ref={ref} id={id} data-testid={dataTestId} className={styles.body({})}>
      {children}
    </div>
  );
});

export interface DetailPageActionsProps extends BaseComponentProps {
  children?: ReactNode;
}

function DetailPageActions({ children }: DetailPageActionsProps): React.ReactNode {
  const ctx = useDetailPage('DetailPage.Actions');
  if (!ctx.actionsSlotEl) return null;
  return createPortal(children, ctx.actionsSlotEl);
}

export interface DetailPageRightPanelProps extends BaseComponentProps {
  /** Panel content — typically a `Surface` with related metadata. */
  children?: ReactNode;
  /** Accessible label for the rail region. */
  'aria-label'?: string;
}

const DetailPageRightPanel = forwardRef<HTMLElement, DetailPageRightPanelProps>(
  function DetailPageRightPanel(
    { children, id, 'data-testid': dataTestId, 'aria-label': ariaLabel },
    ref,
  ) {
    useDetailPage('DetailPage.RightPanel');
    return (
      <aside
        ref={ref as Ref<HTMLElement>}
        id={id}
        data-testid={dataTestId}
        aria-label={ariaLabel}
        className={styles.rightPanel}
      >
        {children}
      </aside>
    );
  },
);

export const DetailPage = Object.assign(DetailPageRoot, {
  Header: DetailPageHeader,
  Meta: DetailPageMeta,
  MetaItem: DetailPageMetaItem,
  Body: DetailPageBody,
  Actions: DetailPageActions,
  RightPanel: DetailPageRightPanel,
});
