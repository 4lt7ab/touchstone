import type { ReactNode } from 'react';
import { Badge, Stack, Surface, Text } from '@touchstone/atoms';
import type { BaseComponentProps } from '@touchstone/atoms';
import { defaultDeltaTone, defaultFormatDelta, type DeltaTone } from '../internal/delta.js';

export type KpiDeltaTone = DeltaTone;

export interface KpiCardDelta {
  /** Numeric delta as a decimal fraction (0.094 → +9.4%). */
  value: number;
  /**
   * Tone override. By default: success > +0.5%, danger < -0.5%, neutral
   * inside ±0.5%. Set explicitly when the metric inverts (e.g. a falling
   * bounce rate is good — pass `'success'` on a negative value).
   */
  tone?: KpiDeltaTone;
  /** Format function. @default `+9.4%` style with sign and 1 decimal place. */
  format?: (value: number) => string;
  /** Caption rendered after the formatted delta. @default 'vs prev' */
  caption?: string;
}

export interface KpiCardProps extends BaseComponentProps {
  /** Short metric name shown above the value. */
  label: string;
  /** Pre-formatted metric value. */
  value: ReactNode;
  /** Optional change indicator. Omit to render the card without a delta badge. */
  delta?: KpiCardDelta;
  /**
   * Optional inline trend rendered to the right of the value — typically a
   * `<Sparkline />`. Sized by the parent flex track, so pass a `Sparkline`
   * with no explicit width (it fills) or wrap your own glyph in a div.
   */
  sparkline?: ReactNode;
}

/**
 * A single KPI tile — label, value, optional delta, optional inline
 * sparkline. Reads its surface and delta tones from the theme contract, so
 * the card re-skins with the kit when the palette changes. Compose in a
 * `Grid` for a row of metrics.
 */
export function KpiCard({
  label,
  value,
  delta,
  sparkline,
  id,
  'data-testid': dataTestId,
}: KpiCardProps): React.JSX.Element {
  const deltaTone = delta?.tone ?? (delta ? defaultDeltaTone(delta.value) : undefined);
  const deltaText = delta ? (delta.format ?? defaultFormatDelta)(delta.value) : null;
  const caption = delta?.caption ?? 'vs prev';
  return (
    <Surface level="panel" padding="md" radius="md" id={id} data-testid={dataTestId}>
      <Stack direction="column" gap="xs">
        <Text size="sm" tone="muted">
          {label}
        </Text>
        {sparkline ? (
          <Stack direction="row" justify="between" align="center" gap="md">
            <Text size="2xl" weight="bold">
              {value}
            </Text>
            <div style={{ flex: 1, minWidth: 0, maxWidth: 120 }}>{sparkline}</div>
          </Stack>
        ) : (
          <Text size="2xl" weight="bold">
            {value}
          </Text>
        )}
        {delta ? (
          <Badge tone={deltaTone}>
            {deltaText} {caption}
          </Badge>
        ) : null}
      </Stack>
    </Surface>
  );
}
