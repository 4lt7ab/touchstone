import { Fragment } from 'react';
import { Stack, Text } from '@touchstone/atoms';
import type { BaseComponentProps } from '@touchstone/atoms';
import { TONE_COLOR, type ChartTone } from '../internal/computePoints.js';

const MIN_OPACITY = 0.04;

export type HeatmapTone = ChartTone;

export interface HeatmapCell {
  /** Numeric value driving the cell's colour intensity. */
  value: number;
  /** Optional override label for the cell tooltip / aria. Defaults to the formatted value. */
  label?: string;
}

export interface HeatmapProps extends BaseComponentProps {
  /** 2D matrix of cells: rows × columns, in display order. */
  data: readonly (readonly HeatmapCell[])[];
  /** Required accessible label naming what the grid depicts. */
  'aria-label': string;
  /** Optional row labels rendered down the left axis. Length should match `data.length`. */
  rowLabels?: readonly string[];
  /** Optional column labels rendered along the top. Length should match `data[0].length`. */
  columnLabels?: readonly string[];
  /** Cell tone. @default 'accent' */
  tone?: HeatmapTone;
  /** Cell size in pixels (square). @default 16 */
  cellSize?: number;
  /** Gap between cells in pixels. @default 2 */
  cellGap?: number;
  /** Override the value-to-intensity domain. Defaults to `[min, max]` of the data. */
  domain?: readonly [number, number];
  /** Format the value for tooltips and the legend. @default n => n.toString() */
  format?: (value: number) => string;
  /** Show the colour-scale legend below the grid. @default true */
  showLegend?: boolean;
}

/**
 * A grid of intensity-mapped cells — rows × columns, each cell coloured by
 * its value's position in the data range. Reads the cell tone from the
 * theme contract; consumers pick a single `tone` rather than a custom
 * palette so the kit's colour discipline carries through. Pair with row
 * and column labels for readable activity grids; `domain` pins the scale
 * so two heatmaps can share a colour reference.
 */
export function Heatmap({
  data,
  'aria-label': ariaLabel,
  rowLabels,
  columnLabels,
  tone = 'accent',
  cellSize = 16,
  cellGap = 2,
  domain,
  format = (n) => String(n),
  showLegend = true,
  id,
  'data-testid': dataTestId,
}: HeatmapProps): React.JSX.Element | null {
  if (data.length === 0 || (data[0]?.length ?? 0) === 0) return null;

  const cols = data[0]!.length;
  const allValues = data.flatMap((row) => row.map((c) => c.value));
  const computedMin = Math.min(...allValues);
  const computedMax = Math.max(...allValues);
  const [domainMin, domainMax] = domain ?? [computedMin, computedMax];
  const range = domainMax - domainMin || 1;

  const intensity = (value: number): number => {
    const t = (value - domainMin) / range;
    return Math.max(0, Math.min(1, t));
  };
  const opacityFor = (value: number): number => MIN_OPACITY + (1 - MIN_OPACITY) * intensity(value);

  const stroke = TONE_COLOR[tone];
  const gridTemplateColumns = `${rowLabels ? 'auto ' : ''}repeat(${cols}, ${cellSize}px)`;

  return (
    <section aria-label={ariaLabel} id={id} data-testid={dataTestId}>
      <Stack direction="column" gap="sm">
        <div
          role="img"
          aria-label={`${ariaLabel} grid`}
          style={{
            display: 'grid',
            gridTemplateColumns,
            gap: `${cellGap}px`,
            alignItems: 'center',
          }}
        >
          {columnLabels ? (
            <>
              {rowLabels ? <span /> : null}
              {columnLabels.map((label, i) => (
                <div key={`col-${i}-${label}`} style={{ textAlign: 'center' }}>
                  <Text size="xs" tone="muted">
                    {label}
                  </Text>
                </div>
              ))}
            </>
          ) : null}
          {data.map((row, rowIndex) => (
            <Fragment key={`row-${rowIndex}`}>
              {rowLabels ? (
                <Text size="xs" tone="muted">
                  {rowLabels[rowIndex] ?? ''}
                </Text>
              ) : null}
              {row.map((cell, colIndex) => {
                const labelText =
                  cell.label ??
                  [rowLabels?.[rowIndex], columnLabels?.[colIndex], format(cell.value)]
                    .filter(Boolean)
                    .join(' · ');
                return (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    title={labelText}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      borderRadius: 3,
                      background: stroke,
                      opacity: opacityFor(cell.value),
                    }}
                  />
                );
              })}
            </Fragment>
          ))}
        </div>
        {showLegend ? (
          <Stack direction="row" gap="sm" align="center">
            <Text size="xs" tone="muted">
              {format(domainMin)}
            </Text>
            {[0.15, 0.35, 0.55, 0.75, 0.95].map((o) => (
              <div
                key={o}
                aria-hidden
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderRadius: 3,
                  background: stroke,
                  opacity: o,
                }}
              />
            ))}
            <Text size="xs" tone="muted">
              {format(domainMax)}
            </Text>
          </Stack>
        ) : null}
      </Stack>
    </section>
  );
}
