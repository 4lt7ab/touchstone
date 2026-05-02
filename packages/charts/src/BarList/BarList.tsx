import { Badge, ProgressBar, Stack, Text } from '@touchstone/atoms';
import type { BaseComponentProps } from '@touchstone/atoms';
import { defaultDeltaTone, defaultFormatDelta, type DeltaTone } from '../internal/delta.js';

export type BarListTone = 'accent' | 'success' | 'warning' | 'danger';

export interface BarListItemDelta {
  /** Numeric delta as a decimal fraction (0.094 → +9.4%). */
  value: number;
  /** Tone override. Default: success > +0.5%, danger < -0.5%, neutral inside ±0.5%. */
  tone?: DeltaTone;
  /** Format function. @default `+9.4%` style with sign and 1 decimal place. */
  format?: (value: number) => string;
  /** Caption rendered after the formatted delta. Omit for a bare badge. */
  caption?: string;
}

export interface BarListItem {
  /** Stable id for the React key. Defaults to `name`. */
  id?: string;
  /** Visible row label. */
  name: string;
  /** Numeric value driving the bar's fill. */
  value: number;
  /** Optional secondary text shown beneath the name. */
  description?: string;
  /** Optional change indicator rendered as a Badge on the right. */
  delta?: BarListItemDelta;
  /** Per-row bar tone override. */
  tone?: BarListTone;
}

export interface BarListProps extends BaseComponentProps {
  /** Ranked items, in display order. */
  items: readonly BarListItem[];
  /** Required accessible label naming what the list depicts. */
  'aria-label': string;
  /** Format the row value for the right-hand label. @default n => n.toString() */
  format?: (value: number) => string;
  /** Default bar tone, applied when an item doesn't override. @default 'accent' */
  tone?: BarListTone;
  /** Bar density. Compact tightens the gap between rows. @default 'comfortable' */
  density?: 'comfortable' | 'compact';
  /** Cap bar widths against this value. Defaults to `max(items.value)`. */
  max?: number;
}

/**
 * A ranked list of horizontal bars — one row per item, sorted by the caller.
 * Reads bar tones from the theme contract and formats values through the
 * caller's formatter, so the same component handles share-of-total breakdowns
 * (`format={(v) => `${v}%`}`) and raw counts (`format={formatNumber}`). Pair
 * with `KpiCard` for "the headline number plus its breakdown" panels.
 */
export function BarList({
  items,
  'aria-label': ariaLabel,
  format = (n) => String(n),
  tone = 'accent',
  density = 'comfortable',
  max,
  id,
  'data-testid': dataTestId,
}: BarListProps): React.JSX.Element {
  const computedMax = items.reduce((m, i) => Math.max(m, i.value), 0);
  const ceiling = max ?? (computedMax > 0 ? computedMax : 1);
  const rowGap = density === 'compact' ? 'sm' : 'md';
  return (
    <section aria-label={ariaLabel} id={id} data-testid={dataTestId}>
      <Stack direction="column" gap={rowGap}>
        {items.map((item) => {
          const itemTone = item.tone ?? tone;
          const deltaTone = item.delta
            ? (item.delta.tone ?? defaultDeltaTone(item.delta.value))
            : undefined;
          const deltaText = item.delta
            ? (item.delta.format ?? defaultFormatDelta)(item.delta.value)
            : null;
          const fillPct = ceiling === 0 ? 0 : (item.value / ceiling) * 100;
          return (
            <Stack key={item.id ?? item.name} direction="column" gap="xs">
              <Stack direction="row" justify="between" align="center" gap="sm">
                <Stack direction="column" gap="none">
                  <Text size="sm" weight="medium">
                    {item.name}
                  </Text>
                  {item.description ? (
                    <Text size="xs" tone="muted">
                      {item.description}
                    </Text>
                  ) : null}
                </Stack>
                <Stack direction="row" gap="sm" align="center">
                  <Text size="sm" tone="muted">
                    {format(item.value)}
                  </Text>
                  {item.delta ? (
                    <Badge tone={deltaTone}>
                      {deltaText}
                      {item.delta.caption ? ` ${item.delta.caption}` : ''}
                    </Badge>
                  ) : null}
                </Stack>
              </Stack>
              <ProgressBar
                size="sm"
                tone={itemTone}
                value={Math.min(100, Math.max(0, fillPct))}
                aria-label={`${item.name}: ${format(item.value)}`}
              />
            </Stack>
          );
        })}
      </Stack>
    </section>
  );
}
