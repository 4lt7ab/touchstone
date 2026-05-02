import { Children, cloneElement, forwardRef, isValidElement, useId } from 'react';
import type { AriaAttributes, KeyboardEvent, ReactElement, ReactNode, Ref } from 'react';
import { createCompoundContext, useControllableState, useRovingFocus } from '@touchstone/hooks';
import type { BaseComponentProps } from '@touchstone/atoms';
import * as styles from './Tabs.css.js';

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  triggerId: (value: string) => string;
  panelId: (value: string) => string;
}

const [TabsProvider, useTabsScope] = createCompoundContext<TabsContextValue>('Tabs');

export interface TabsProps extends BaseComponentProps {
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial value. If omitted, no tab is selected until the user interacts. */
  defaultValue?: string;
  /** Called when the selected tab changes. */
  onValueChange?: (value: string) => void;
  /** A `Tabs.List` (with `Tabs.Trigger`s) and one or more `Tabs.Panel`s. */
  children: ReactNode;
}

/**
 * WAI-ARIA tablist / tabpanel pair for switching between views inside a page
 * — settings sub-pages, profile sections, "Overview / Activity" sub-nav.
 * Each `Tabs.Trigger` and matching `Tabs.Panel` share the same `value`; the
 * compound context wires `aria-controls` / `aria-labelledby` automatically.
 *
 * Manual activation: arrow keys move focus across triggers (via
 * `useRovingFocus`), but selection only happens on click / Enter / Space —
 * matching the ARIA "manual activation" tabs pattern. For one-of-N selection
 * without panel switching, use `SegmentedControl`.
 */
function TabsRoot({
  value: controlledValue,
  defaultValue,
  onValueChange,
  children,
  id,
  'data-testid': dataTestId,
}: TabsProps): React.JSX.Element {
  const baseId = useId();
  const [value, setValue] = useControllableState<string>({
    ...(controlledValue !== undefined ? { value: controlledValue } : {}),
    defaultValue: defaultValue ?? '',
    ...(onValueChange ? { onChange: onValueChange } : {}),
  });

  return (
    <TabsProvider
      value={{
        value,
        setValue,
        triggerId: (v: string) => `${baseId}-tab-${v}`,
        panelId: (v: string) => `${baseId}-panel-${v}`,
      }}
    >
      <div id={id} data-testid={dataTestId} className={styles.root}>
        {children}
      </div>
    </TabsProvider>
  );
}

export interface TabsListProps extends BaseComponentProps {
  /** Required ARIA label for the tablist. */
  'aria-label'?: AriaAttributes['aria-label'];
  /** Or labelledby — id of an external label element. */
  'aria-labelledby'?: AriaAttributes['aria-labelledby'];
  /** `Tabs.Trigger`s. */
  children?: ReactNode;
}

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  {
    children,
    id,
    'data-testid': dataTestId,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
  },
  ref,
) {
  const ctx = useTabsScope('Tabs.List');
  const childArray = Children.toArray(children);
  const triggers = childArray.filter(
    (c) => isValidElement(c) && isTabsTriggerElement(c),
  ) as ReactElement<TabsTriggerProps & TabsTriggerFocusableProps>[];
  const activeIndex = triggers.findIndex((t) => t.props.value === ctx.value && !t.props.disabled);

  const { itemRef, onKeyDown, getTabIndex } = useRovingFocus({
    count: triggers.length,
    activeIndex: activeIndex === -1 ? null : activeIndex,
    orientation: 'horizontal',
  });

  let triggerIdx = 0;
  const cloned = childArray.map((child) => {
    if (!isValidElement(child) || !isTabsTriggerElement(child)) return child;
    const i = triggerIdx++;
    const focusable = child as ReactElement<TabsTriggerProps & TabsTriggerFocusableProps>;
    const existing = focusable.props;
    return cloneElement(focusable, {
      ref: itemRef(i) as Ref<HTMLButtonElement>,
      tabIndex: getTabIndex(i),
      onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
        existing.onKeyDown?.(e);
        if (!e.defaultPrevented) onKeyDown(i)(e);
      },
    });
  });

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      id={id}
      data-testid={dataTestId}
      className={styles.list}
    >
      {cloned}
    </div>
  );
});

interface TabsTriggerFocusableProps {
  ref?: Ref<HTMLButtonElement>;
  tabIndex?: number;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
}

export interface TabsTriggerProps extends BaseComponentProps {
  /** The matching `Tabs.Panel` value. Selecting this trigger shows that panel. */
  value: string;
  /** Visible label content. */
  children?: ReactNode;
  /** Disable the trigger. */
  disabled?: boolean;
  /** Size preset, mirrors `SegmentedControl`. @default 'md' */
  size?: 'sm' | 'md';
  /** @internal Wired by `Tabs.List` for roving focus. */
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  /** @internal Wired by `Tabs.List` for roving focus. */
  tabIndex?: number;
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { value, children, disabled, size = 'md', onKeyDown, tabIndex, id, 'data-testid': dataTestId },
  ref,
) {
  const ctx = useTabsScope('Tabs.Trigger');
  const selected = ctx.value === value;
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={id ?? ctx.triggerId(value)}
      data-testid={dataTestId}
      className={styles.trigger({ size })}
      disabled={disabled}
      aria-selected={selected}
      aria-controls={ctx.panelId(value)}
      tabIndex={tabIndex ?? (selected ? 0 : -1)}
      onClick={() => {
        if (disabled) return;
        ctx.setValue(value);
      }}
      onKeyDown={onKeyDown}
    >
      {children}
    </button>
  );
});

(TabsTrigger as unknown as { $$touchstone: string }).$$touchstone = 'TabsTrigger';

function isTabsTriggerElement(child: ReactElement): boolean {
  return (child.type as { $$touchstone?: string })?.$$touchstone === 'TabsTrigger';
}

export interface TabsPanelProps extends BaseComponentProps {
  /** The matching `Tabs.Trigger` value. */
  value: string;
  /** Panel content. */
  children?: ReactNode;
}

const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(function TabsPanel(
  { value, children, id, 'data-testid': dataTestId },
  ref,
) {
  const ctx = useTabsScope('Tabs.Panel');
  const selected = ctx.value === value;
  return (
    <div
      ref={ref}
      role="tabpanel"
      id={id ?? ctx.panelId(value)}
      data-testid={dataTestId}
      className={styles.panel}
      aria-labelledby={ctx.triggerId(value)}
      tabIndex={0}
      hidden={!selected}
    >
      {selected ? children : null}
    </div>
  );
});

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Panel: TabsPanel,
});
