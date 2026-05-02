import { Children, cloneElement, forwardRef, isValidElement, useId } from 'react';
import type {
  AriaAttributes,
  ElementType,
  KeyboardEvent,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import { useRovingFocus } from '@touchstone/hooks';
import type { BaseComponentProps } from '@touchstone/atoms';
import * as styles from './NavSection.css.js';

interface FocusableChildProps {
  ref?: Ref<HTMLButtonElement | HTMLElement>;
  tabIndex?: number;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  selected?: boolean;
  disabled?: boolean;
}

/**
 * Labelled grouping of `NavItem` rows (or any focusable children) with
 * vertical roving-tabindex keyboard navigation. The visible `label` becomes
 * the group's accessible name; arrow up/down move focus across items, and
 * Home/End jump to the ends. The active item — typically the one with
 * `selected` — is the tab entry point; if no child is selected, the first
 * item takes `tabIndex=0`.
 *
 * Use multiple `NavSection`s inside a single `Sidebar` to split nav into
 * named groups (e.g. "bench", "ledger") without breaking keyboard order.
 */
export interface NavSectionProps extends BaseComponentProps {
  /** Section header. Renders above the items and labels the group. */
  label?: string;
  /** NavItem (or other focusable) children. */
  children?: ReactNode;
  /** Element to render. @default 'div' */
  as?: ElementType;
  /**
   * ARIA label, used when `label` is omitted (e.g. an unlabelled toolbar
   * group). When `label` is set, this is ignored.
   */
  'aria-label'?: AriaAttributes['aria-label'];
  /** Override `aria-labelledby` if the label lives outside the section. */
  'aria-labelledby'?: AriaAttributes['aria-labelledby'];
}

export const NavSection = forwardRef<HTMLElement, NavSectionProps>(function NavSection(
  {
    label,
    children,
    as: Component = 'div',
    id,
    'data-testid': dataTestId,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
  },
  ref,
) {
  const generatedLabelId = useId();
  const labelId = label ? generatedLabelId : undefined;
  const resolvedLabelledBy = ariaLabelledBy ?? labelId;
  const resolvedAriaLabel = label ? undefined : ariaLabel;

  const items = Children.toArray(children).filter((c): c is ReactElement<FocusableChildProps> =>
    isValidElement(c),
  );
  const activeIndex = items.findIndex((c) => c.props.selected === true);
  const { itemRef, onKeyDown, getTabIndex } = useRovingFocus({
    count: items.length,
    activeIndex: activeIndex === -1 ? null : activeIndex,
    orientation: 'vertical',
  });

  const cloned = items.map((child, i) => {
    const existingOnKeyDown = child.props.onKeyDown;
    return cloneElement(child, {
      ref: itemRef(i) as Ref<HTMLElement>,
      tabIndex: getTabIndex(i),
      onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
        existingOnKeyDown?.(e);
        if (!e.defaultPrevented) onKeyDown(i)(e);
      },
    });
  });

  return (
    <Component
      ref={ref as Ref<HTMLElement>}
      id={id}
      data-testid={dataTestId}
      role="group"
      aria-label={resolvedAriaLabel}
      aria-labelledby={resolvedLabelledBy}
      className={styles.root}
    >
      {label ? (
        <div id={labelId} className={styles.label}>
          {label}
        </div>
      ) : null}
      <div className={styles.list}>{cloned}</div>
    </Component>
  );
});
