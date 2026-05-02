import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { BaseComponentProps } from '@touchstone/atoms';
import { Checkbox } from '@touchstone/atoms';
import type { TableSortDirection } from '@touchstone/hooks';
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
 * `Table.Row`, `Table.HeaderCell`, `Table.Cell`, `Table.SelectCell`, and
 * `Table.SelectAllCell` into a native `<table>` with `scope="col"` already
 * wired on header cells. Visual treatment — density, striping, sticky header
 * — comes through props on the root, so cells stay declarative.
 *
 * Sortable columns: pass `sortable` / `sortDirection` / `onSortChange` to
 * `Table.HeaderCell`, or spread `useTableSort().getColumnProps(key)` onto
 * the cell. Selection: pair `Table.SelectCell` and `Table.SelectAllCell`
 * with `useTableSelection` from `@touchstone/hooks`.
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
  /**
   * Make the header a clickable sort affordance. Drives `aria-sort` on the
   * `<th>` and renders a chevron glyph that flips with `sortDirection`.
   * @default false
   */
  sortable?: boolean;
  /** Current sort direction for this column, or `null` for unsorted. */
  sortDirection?: TableSortDirection | null;
  /**
   * Called when the user activates the sort affordance. The cell computes
   * the next direction in the asc → desc → none cycle and emits it.
   */
  onSortChange?: (next: TableSortDirection | null) => void;
}

function nextSortDirection(current: TableSortDirection | null): TableSortDirection | null {
  if (current === null) return 'asc';
  if (current === 'asc') return 'desc';
  return null;
}

const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  function TableHeaderCell(
    {
      align,
      children,
      scope = 'col',
      colSpan,
      rowSpan,
      sortable = false,
      sortDirection = null,
      onSortChange,
      id,
      'data-testid': dataTestId,
    },
    ref,
  ) {
    const ariaSort = !sortable
      ? undefined
      : sortDirection === 'asc'
        ? 'ascending'
        : sortDirection === 'desc'
          ? 'descending'
          : 'none';

    return (
      <th
        ref={ref}
        id={id}
        data-testid={dataTestId}
        scope={scope}
        colSpan={colSpan}
        rowSpan={rowSpan}
        aria-sort={ariaSort}
        className={styles.headerCell({ align })}
      >
        {sortable ? (
          <button
            type="button"
            className={styles.sortButton}
            onClick={() => onSortChange?.(nextSortDirection(sortDirection))}
          >
            <span>{children}</span>
            <SortGlyph direction={sortDirection} />
          </button>
        ) : (
          children
        )}
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

export interface TableSelectCellProps extends BaseComponentProps {
  /** Controlled checked state for the row's selection checkbox. */
  checked?: boolean;
  /** Uncontrolled initial checked state. @default false */
  defaultChecked?: boolean;
  /** Called when the row's selection toggles. */
  onCheckedChange?: (checked: boolean) => void;
  /** Disable the checkbox. */
  disabled?: boolean;
  /** Required accessible label for the row's checkbox (e.g. `select Anvil`). */
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

const TableSelectCell = forwardRef<HTMLTableCellElement, TableSelectCellProps>(
  function TableSelectCell(
    {
      checked,
      defaultChecked,
      onCheckedChange,
      disabled,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      id,
      'data-testid': dataTestId,
    },
    ref,
  ) {
    return (
      <td ref={ref} id={id} data-testid={dataTestId} className={styles.selectCell}>
        <Checkbox
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
        />
      </td>
    );
  },
);

export interface TableSelectAllCellProps extends BaseComponentProps {
  /** All rows in the current view are selected. */
  checked?: boolean;
  /** Uncontrolled initial state. @default false */
  defaultChecked?: boolean;
  /** Some — but not all — rows in the current view are selected. */
  indeterminate?: boolean;
  /** Called when the consumer flips select-all. */
  onCheckedChange?: (checked: boolean) => void;
  /** Disable the checkbox. */
  disabled?: boolean;
  /** Accessible label. @default 'Select all rows' */
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

const TableSelectAllCell = forwardRef<HTMLTableCellElement, TableSelectAllCellProps>(
  function TableSelectAllCell(
    {
      checked,
      defaultChecked,
      indeterminate,
      onCheckedChange,
      disabled,
      'aria-label': ariaLabel = 'Select all rows',
      'aria-labelledby': ariaLabelledBy,
      id,
      'data-testid': dataTestId,
    },
    ref,
  ) {
    return (
      <th
        ref={ref}
        scope="col"
        id={id}
        data-testid={dataTestId}
        className={styles.selectHeaderCell}
      >
        <Checkbox
          checked={checked}
          defaultChecked={defaultChecked}
          indeterminate={indeterminate}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
        />
      </th>
    );
  },
);

interface SortGlyphProps {
  direction: TableSortDirection | null;
}

function SortGlyph({ direction }: SortGlyphProps): React.JSX.Element {
  return (
    <svg
      className={styles.sortGlyph}
      data-direction={direction ?? 'none'}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path data-arm="asc" d="M5 7l3-3 3 3" />
      <path data-arm="desc" d="M5 9l3 3 3-3" />
    </svg>
  );
}

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  HeaderCell: TableHeaderCell,
  Cell: TableCell,
  SelectCell: TableSelectCell,
  SelectAllCell: TableSelectAllCell,
});
