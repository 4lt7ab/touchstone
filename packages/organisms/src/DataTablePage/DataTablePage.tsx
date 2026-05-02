import { createContext, forwardRef, useContext } from 'react';
import type { ReactNode, Ref } from 'react';
import { PageHeader, type PageHeaderProps } from '@touchstone/molecules';
import type { BaseComponentProps } from '@touchstone/atoms';
import * as styles from './DataTablePage.css.js';

interface DataTablePageContextValue {
  rowCount: number;
  isEmpty: boolean;
}

const DataTablePageContext = createContext<DataTablePageContextValue | null>(null);
DataTablePageContext.displayName = 'DataTablePageContext';

function useDataTablePage(consumerName: string): DataTablePageContextValue {
  const ctx = useContext(DataTablePageContext);
  if (ctx === null) {
    throw new Error(`<${consumerName}> must be rendered inside <DataTablePage>.`);
  }
  return ctx;
}

export interface DataTablePageProps extends BaseComponentProps {
  /**
   * Number of rows currently visible in the table. Drives the
   * empty / populated branch — when zero, `DataTablePage.Empty` renders
   * and `DataTablePage.Table` / `.Pagination` hide; when above zero,
   * `Empty` hides and the table appears.
   */
  rowCount: number;
  /** Children — typically `Header`, `FilterBar`, `Table`, `Pagination`, `Empty`. */
  children?: ReactNode;
}

/**
 * List / CRUD page envelope: header, filter bar, table, pagination, and
 * a built-in empty-state branch keyed on `rowCount`. The "70% of internal
 * apps" page — `useTableSelection` and `useTableSort` from
 * `@touchstone/hooks` slot in for selection and sort state.
 *
 * The envelope sets `data-state="empty"` or `data-state="populated"` on
 * the root for downstream styling and conditional rendering.
 */
const DataTablePageRoot = forwardRef<HTMLDivElement, DataTablePageProps>(function DataTablePage(
  { rowCount, children, id, 'data-testid': dataTestId },
  ref,
) {
  const isEmpty = rowCount <= 0;
  return (
    <DataTablePageContext.Provider value={{ rowCount, isEmpty }}>
      <div
        ref={ref}
        id={id}
        data-testid={dataTestId}
        data-state={isEmpty ? 'empty' : 'populated'}
        className={styles.root}
      >
        {children}
      </div>
    </DataTablePageContext.Provider>
  );
});

export type DataTablePageHeaderProps = PageHeaderProps;

const DataTablePageHeader = forwardRef<HTMLElement, DataTablePageHeaderProps>(
  function DataTablePageHeader(props, ref) {
    useDataTablePage('DataTablePage.Header');
    return <PageHeader ref={ref as Ref<HTMLElement>} {...props} />;
  },
);

export interface DataTablePageFilterBarProps extends BaseComponentProps {
  children?: ReactNode;
  /** Accessible label for the filter region. */
  'aria-label'?: string;
}

const DataTablePageFilterBar = forwardRef<HTMLDivElement, DataTablePageFilterBarProps>(
  function DataTablePageFilterBar(
    { children, id, 'data-testid': dataTestId, 'aria-label': ariaLabel = 'filters' },
    ref,
  ) {
    useDataTablePage('DataTablePage.FilterBar');
    return (
      <div
        ref={ref}
        id={id}
        data-testid={dataTestId}
        role="region"
        aria-label={ariaLabel}
        className={styles.filterBar}
      >
        {children}
      </div>
    );
  },
);

export interface DataTablePageTableProps extends BaseComponentProps {
  children?: ReactNode;
}

const DataTablePageTable = forwardRef<HTMLDivElement, DataTablePageTableProps>(
  function DataTablePageTable({ children, id, 'data-testid': dataTestId }, ref) {
    const ctx = useDataTablePage('DataTablePage.Table');
    if (ctx.isEmpty) return null;
    return (
      <div ref={ref} id={id} data-testid={dataTestId} className={styles.tableSlot}>
        {children}
      </div>
    );
  },
);

export interface DataTablePagePaginationProps extends BaseComponentProps {
  children?: ReactNode;
}

const DataTablePagePagination = forwardRef<HTMLDivElement, DataTablePagePaginationProps>(
  function DataTablePagePagination({ children, id, 'data-testid': dataTestId }, ref) {
    const ctx = useDataTablePage('DataTablePage.Pagination');
    if (ctx.isEmpty) return null;
    return (
      <div ref={ref} id={id} data-testid={dataTestId} className={styles.paginationSlot}>
        {children}
      </div>
    );
  },
);

export interface DataTablePageEmptyProps extends BaseComponentProps {
  children?: ReactNode;
}

const DataTablePageEmpty = forwardRef<HTMLDivElement, DataTablePageEmptyProps>(
  function DataTablePageEmpty({ children, id, 'data-testid': dataTestId }, ref) {
    const ctx = useDataTablePage('DataTablePage.Empty');
    if (!ctx.isEmpty) return null;
    return (
      <div ref={ref} id={id} data-testid={dataTestId} className={styles.emptySlot}>
        {children}
      </div>
    );
  },
);

export const DataTablePage = Object.assign(DataTablePageRoot, {
  Header: DataTablePageHeader,
  FilterBar: DataTablePageFilterBar,
  Table: DataTablePageTable,
  Pagination: DataTablePagePagination,
  Empty: DataTablePageEmpty,
});
