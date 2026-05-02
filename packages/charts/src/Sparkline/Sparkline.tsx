import { useId } from 'react';
import type { CSSProperties } from 'react';
import type { BaseComponentProps } from '@touchstone/atoms';
import {
  TONE_COLOR,
  computePoints,
  pointsToAreaPath,
  pointsToLinePath,
  type ChartDatum,
  type ChartTone,
} from '../internal/computePoints.js';

export type SparklineTone = ChartTone;
export type SparklineDatum = ChartDatum;

export interface SparklineProps extends BaseComponentProps {
  /** Data points in display order. */
  data: readonly SparklineDatum[];
  /** Required accessible label naming what the spark depicts. */
  'aria-label': string;
  /** Pixel height. @default 32 */
  height?: number;
  /** Optional explicit width. Omit to fill the container. */
  width?: number | string;
  /** Stroke + fill tone, drawn from the theme contract. @default 'accent' */
  tone?: SparklineTone;
  /** Render the gradient fill below the line. @default true */
  fill?: boolean;
  /** Render a dot at the last data point. @default true */
  showEndpoint?: boolean;
}

/**
 * A small inline trend mark — the same path-drawing as `Trendline` minus the
 * axis row, sized to live next to a number or fit a table cell. Defaults
 * tuned for inline use: 32px tall, fills its container width, gradient fill
 * on, endpoint dot on. Drop in a fixed-width parent (`<div style={{ width:
 * 120 }}>`) or a flex container to constrain.
 */
export function Sparkline({
  data,
  'aria-label': ariaLabel,
  height = 32,
  width,
  tone = 'accent',
  fill = true,
  showEndpoint = true,
  id,
  'data-testid': dataTestId,
}: SparklineProps): React.JSX.Element | null {
  const gradientId = useId();
  const viewportWidth = 200;
  const padY = 2;
  const computed = computePoints(data, viewportWidth, height, 2, padY);
  if (!computed) return null;
  const { points } = computed;
  const stroke = TONE_COLOR[tone];
  const last = points[points.length - 1]!;
  const wrapperStyle: CSSProperties = {
    display: 'inline-block',
    width: width ?? '100%',
    lineHeight: 0,
  };

  return (
    <div id={id} data-testid={dataTestId} style={wrapperStyle}>
      <svg
        viewBox={`0 0 ${viewportWidth} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={ariaLabel}
        style={{ width: '100%', height, display: 'block' }}
      >
        {fill ? (
          <>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity="0.3" />
                <stop offset="100%" stopColor={stroke} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={pointsToAreaPath(points, height - padY)} fill={`url(#${gradientId})`} />
          </>
        ) : null}
        <path
          d={pointsToLinePath(points)}
          fill="none"
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {showEndpoint ? <circle cx={last.x} cy={last.y} r={2} fill={stroke} /> : null}
      </svg>
    </div>
  );
}
