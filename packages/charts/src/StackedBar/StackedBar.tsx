import { Stack, Text } from '@touchstone/atoms';
import type { BaseComponentProps } from '@touchstone/atoms';
import { TONE_COLOR, type ChartTone } from '../internal/computePoints.js';

const DEFAULT_TONE_CYCLE: readonly ChartTone[] = [
  'accent',
  'info',
  'success',
  'warning',
  'danger',
  'neutral',
];

export type StackedBarTone = ChartTone;

export interface StackedBarSegment {
  /** Stable id for the React key. Defaults to `label`. */
  id?: string;
  /** Visible label shown in the legend. */
  label: string;
  /** Numeric value driving the segment's share of the bar. */
  value: number;
  /** Per-segment tone override. Defaults to the cycled palette colour. */
  tone?: StackedBarTone;
}

export interface StackedBarProps extends BaseComponentProps {
  /** Segments composing the whole, in display order (largest first reads best). */
  segments: readonly StackedBarSegment[];
  /** Required accessible label naming what the bar depicts. */
  'aria-label': string;
  /** Bar height in pixels. @default 16 */
  height?: number;
  /** Format the value for the legend. @default `${(value / total * 100).toFixed(0)}%` */
  format?: (value: number, total: number) => string;
  /** Tone rotation for segments without an explicit tone. */
  toneCycle?: readonly StackedBarTone[];
  /** Show the legend row below the bar. @default true */
  showLegend?: boolean;
}

/**
 * A single horizontal bar showing how parts compose to a whole. Each segment
 * sizes by its share of the total; tones cycle through the theme contract so
 * the same component handles "share of traffic" breakdowns and budget
 * compositions without colour management at the call site.
 */
export function StackedBar({
  segments,
  'aria-label': ariaLabel,
  height = 16,
  format,
  toneCycle = DEFAULT_TONE_CYCLE,
  showLegend = true,
  id,
  'data-testid': dataTestId,
}: StackedBarProps): React.JSX.Element {
  const total = segments.reduce((s, seg) => s + Math.max(0, seg.value), 0);
  const fmt =
    format ??
    ((value: number, t: number) => (t === 0 ? '0%' : `${((value / t) * 100).toFixed(0)}%`));
  const cycle = toneCycle.length > 0 ? toneCycle : DEFAULT_TONE_CYCLE;

  return (
    <section aria-label={ariaLabel} id={id} data-testid={dataTestId}>
      <Stack direction="column" gap="sm">
        <div
          role="img"
          aria-label={`${ariaLabel} bar`}
          style={{
            display: 'flex',
            width: '100%',
            height,
            borderRadius: 9999,
            overflow: 'hidden',
            background: 'transparent',
          }}
        >
          {segments.map((seg, i) => {
            const tone = seg.tone ?? cycle[i % cycle.length]!;
            return (
              <div
                key={seg.id ?? seg.label}
                aria-hidden
                title={`${seg.label}: ${fmt(seg.value, total)}`}
                style={{
                  flex: Math.max(0, seg.value),
                  background: TONE_COLOR[tone],
                  minWidth: seg.value > 0 ? 2 : 0,
                }}
              />
            );
          })}
        </div>
        {showLegend ? (
          <Stack direction="row" gap="md" wrap>
            {segments.map((seg, i) => {
              const tone = seg.tone ?? cycle[i % cycle.length]!;
              return (
                <Stack key={seg.id ?? seg.label} direction="row" gap="xs" align="center">
                  <span
                    aria-hidden
                    style={{
                      display: 'inline-block',
                      width: 10,
                      height: 10,
                      borderRadius: 9999,
                      background: TONE_COLOR[tone],
                    }}
                  />
                  <Text size="xs" tone="muted">
                    {seg.label} {fmt(seg.value, total)}
                  </Text>
                </Stack>
              );
            })}
          </Stack>
        ) : null}
      </Stack>
    </section>
  );
}
