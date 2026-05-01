import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { BaseComponentProps } from '@touchstone/atoms';
import * as styles from './Table.css.js';

type HeaderCellVariants = NonNullable<RecipeVariants<typeof styles.headerCell>>;
type CellVariants = NonNullable<RecipeVariants<typeof styles.cell>>;

export interface TableProps extends BaseComponentProps {
  /** Vertical rhythm. `comfortable` is the default app shape; `compact` is the dense data view. @default 'comfortable' */
  density?: 'compact' | 'comfortable';
  /** Tint every other body row with `bgMuted`. @default false */
  striped?: boolean;
  /**
   * Pin the header row to the top of the nearest scrolling ancestor. Wrap
   * the table in a scrolling `Surface` for this to do anything visible.
   * @default false
   */
  stickyHeader?: boolean;
  /** A `Table.Header`, `Table.Body`, and optionally a `Table.Footer`. */
  children: ReactNode;
}

/**
 * Tabular data surface. Composes `Table.Header`, `Table.Body`, `Table.Footer`,
 * `Table.Row`, `Table.HeaderCell`, and `Table.Cell` into a native `<table>`
 * with `scope="col"` already wired on header cells. Visual treatment —
 * density, striping, sticky header — comes through props on the root, so
 * cells stay declarative.
 *
 * v1 covers structural primitives only. Sortable headers, row selection
 * checkboxes, and pagination land as separate follow-ups (each will pair
 * with a hook in `@touchstone/hooks`).
 */
const TableRoot = forwardRef<HTMLTableElement, TableProps>(function Table(
  {
    density = 'comfortable',
    striped = false,
    stickyHeader = false,
    children,
    id,
    'data-testid': dataTestId,
  },
  ref,
) {
  return (
    <table
      ref={ref}
      id={id}
      data-testid={dataTestId}
      data-density={density}
      data-striped={striped ? 'true' : 'false'}
      data-sticky-header={stickyHeader ? 'true' : 'false'}
      className={styles.table}
    >
      {children}
    </table>
  );
});

export interface TableHeaderProps extends BaseComponentProps {
  /** One or more `Table.Row`. */
  children: ReactNode;
}

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(function TableHeader(
  { children, id, 'data-testid': dataTestId },
  ref,
) {
  return (
    <thead ref={ref} id={id} data-testid={dataTestId} className={styles.head}>
      {children}
    </thead>
  );
});

export interface TableBodyProps extends BaseComponentProps {
  /** One or more `Table.Row`. */
  children: ReactNode;
}

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  { children, id, 'data-testid': dataTestId },
  ref,
) {
  return (
    <tbody ref={ref} id={id} data-testid={dataTestId} className={styles.body}>
      {children}
    </tbody>
  );
});

export interface TableFooterProps extends BaseComponentProps {
  /** One or more `Table.Row`. */
  children: ReactNode;
}

const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(function TableFooter(
  { children, id, 'data-testid': dataTestId },
  ref,
) {
  return (
    <tfoot ref={ref} id={id} data-testid={dataTestId} className={styles.foot}>
      {children}
    </tfoot>
  );
});

export interface TableRowProps extends BaseComponentProps {
  /** Visually highlight the row as selected. @default false */
  selected?: boolean;
  /** One or more `Table.Cell` or `Table.HeaderCell`. */
  children: ReactNode;
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { selected = false, children, id, 'data-testid': dataTestId },
  ref,
) {
  return (
    <tr
      ref={ref}
      id={id}
      data-testid={dataTestId}
      data-selected={selected ? 'true' : undefined}
      aria-selected={selected ? true : undefined}
      className={styles.row}
    >
      {children}
    </tr>
  );
});

export interface TableHeaderCellProps extends BaseComponentProps, HeaderCellVariants {
  /** Cell content. */
  children?: ReactNode;
  /** ARIA scope. Defaults to `col` for column-header rows in `<thead>`. */
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
  colSpan?: number;
  rowSpan?: number;
}

const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  function TableHeaderCell(
    { align, children, scope = 'col', colSpan, rowSpan, id, 'data-testid': dataTestId },
    ref,
  ) {
    return (
      <th
        ref={ref}
        id={id}
        data-testid={dataTestId}
        scope={scope}
        colSpan={colSpan}
        rowSpan={rowSpan}
        className={styles.headerCell({ align })}
      >
        {children}
      </th>
    );
  },
);

export interface TableCellProps extends BaseComponentProps, CellVariants {
  /** Cell content. */
  children?: ReactNode;
  colSpan?: number;
  rowSpan?: number;
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { align, children, colSpan, rowSpan, id, 'data-testid': dataTestId },
  ref,
) {
  return (
    <td
      ref={ref}
      id={id}
      data-testid={dataTestId}
      colSpan={colSpan}
      rowSpan={rowSpan}
      className={styles.cell({ align })}
    >
      {children}
    </td>
  );
});

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  HeaderCell: TableHeaderCell,
  Cell: TableCell,
});
