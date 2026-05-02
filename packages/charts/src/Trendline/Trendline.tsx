import { useId } from 'react';
import { Stack, Text } from '@touchstone/atoms';
import type { BaseComponentProps } from '@touchstone/atoms';
import {
  TONE_COLOR,
  computePoints,
  pointsToAreaPath,
  pointsToLinePath,
  type ChartDatum,
  type ChartTone,
} from '../internal/computePoints.js';

export type TrendlineTone = ChartTone;
export type TrendlineDatum = ChartDatum;

export interface TrendlineSeries {
  /** Legend label and aria for this series. */
  label: string;
  /** Data points in display order. Must align with sibling series by index. */
  data: readonly TrendlineDatum[];
  /** Per-series tone override. */
  tone?: TrendlineTone;
  /** Per-series fill override. Defaults: single-series on, multi-series off. */
  fill?: boolean;
}

interface TrendlineSingleProps {
  /** Single-series data. Mutually exclusive with `series`. */
  data: readonly TrendlineDatum[];
  series?: never;
  /** Stroke + fill tone for the single series. @default 'accent' */
  tone?: TrendlineTone;
}

interface TrendlineMultiProps {
  data?: never;
  /** Two or more series sharing the same X axis. */
  series: readonly TrendlineSeries[];
  /** Ignored when `series` is provided — set tones per-series instead. */
  tone?: never;
}

interface TrendlineCommonProps extends BaseComponentProps {
  /** Required accessible label naming what the chart depicts. */
  'aria-label': string;
  /** Number formatter used for axis high/low labels. @default n => n.toString() */
  format?: (value: number) => string;
  /** Chart height in pixels. @default 200 */
  height?: number;
  /** Show the axis row beneath the chart. @default true */
  showAxis?: boolean;
  /** Show a legend row above the chart. @default false single-series, true multi-series */
  showLegend?: boolean;
}

export type TrendlineProps = TrendlineCommonProps & (TrendlineSingleProps | TrendlineMultiProps);

interface ResolvedSeries {
  label: string;
  data: readonly TrendlineDatum[];
  tone: TrendlineTone;
  fill: boolean;
}

function resolveSeries(props: TrendlineSingleProps | TrendlineMultiProps): ResolvedSeries[] {
  if ('series' in props && props.series) {
    return props.series.map((s) => ({
      label: s.label,
      data: s.data,
      tone: s.tone ?? 'accent',
      fill: s.fill ?? false,
    }));
  }
  return [
    {
      label: '',
      data: props.data ?? [],
      tone: props.tone ?? 'accent',
      fill: true,
    },
  ];
}

/**
 * A line + area chart sized to its container width. Pass `data` for a single
 * series, or `series` for two or more sharing one X axis (per-series tone +
 * fill, automatic legend). Reads colours from the theme contract; pair with
 * the smaller `Sparkline` for inline trends inside cards and table rows.
 */
export function Trendline(props: TrendlineProps): React.JSX.Element | null {
  const {
    'aria-label': ariaLabel,
    format = (n) => String(n),
    height = 200,
    showAxis = true,
    showLegend,
    id,
    'data-testid': dataTestId,
  } = props;
  const baseId = useId();
  const resolved = resolveSeries(props);
  const longest = resolved.reduce((m, s) => (s.data.length > m ? s.data.length : m), 0);
  if (longest < 2) return null;

  const reference = resolved.find((s) => s.data.length === longest)!.data;
  const allValues = resolved.flatMap((s) => s.data.map((d) => d.value));
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);

  const width = 800;
  const padY = 12;
  const renderedSeries = resolved
    .map((s, i) => {
      const computed = computePoints(s.data, width, height, 8, padY);
      if (!computed) return null;
      return {
        ...s,
        gradientId: `${baseId}-${i}`,
        points: computed.points,
      };
    })
    .filter(
      (
        s,
      ): s is ResolvedSeries & {
        gradientId: string;
        points: ReturnType<typeof computePoints> extends infer R
          ? R extends { points: infer P }
            ? P
            : never
          : never;
      } => s !== null,
    );

  const showLegendResolved = showLegend ?? resolved.length > 1;

  return (
    <div id={id} data-testid={dataTestId} style={{ width: '100%' }}>
      {showLegendResolved ? (
        <Stack direction="row" gap="md" align="center" wrap>
          {resolved.map((s) => (
            <Stack key={s.label} direction="row" gap="xs" align="center">
              <span
                aria-hidden
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: 9999,
                  background: TONE_COLOR[s.tone],
                }}
              />
              <Text size="xs" tone="muted">
                {s.label}
              </Text>
            </Stack>
          ))}
        </Stack>
      ) : null}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={ariaLabel}
        style={{ width: '100%', height, display: 'block' }}
      >
        <defs>
          {renderedSeries
            .filter((s) => s.fill)
            .map((s) => (
              <linearGradient key={s.gradientId} id={s.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={TONE_COLOR[s.tone]} stopOpacity="0.35" />
                <stop offset="100%" stopColor={TONE_COLOR[s.tone]} stopOpacity="0" />
              </linearGradient>
            ))}
        </defs>
        {renderedSeries.map((s) => {
          const stroke = TONE_COLOR[s.tone];
          const last = s.points[s.points.length - 1]!;
          return (
            <g key={`${s.label}-${s.gradientId}`}>
              {s.fill ? (
                <path
                  d={pointsToAreaPath(s.points, height - padY)}
                  fill={`url(#${s.gradientId})`}
                />
              ) : null}
              <path
                d={pointsToLinePath(s.points)}
                fill="none"
                stroke={stroke}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx={last.x} cy={last.y} r={4} fill={stroke} />
            </g>
          );
        })}
      </svg>
      {showAxis ? (
        <Stack direction="row" justify="between">
          <Text size="xs" tone="muted">
            {reference[0]!.label}
          </Text>
          <Text size="xs" tone="muted">
            high {format(max)} · low {format(min)}
          </Text>
          <Text size="xs" tone="muted">
            {reference[reference.length - 1]!.label}
          </Text>
        </Stack>
      ) : null}
    </div>
  );
}
