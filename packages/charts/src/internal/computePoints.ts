import { vars } from '@touchstone/themes';

export interface ChartDatum {
  /** Axis label (typically a date). */
  label: string;
  /** Numeric value plotted along Y. */
  value: number;
}

export interface ChartPoint extends ChartDatum {
  x: number;
  y: number;
}

export type ChartTone = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export const TONE_COLOR: Record<ChartTone, string> = {
  accent: vars.color.accent,
  success: vars.color.success,
  warning: vars.color.warning,
  danger: vars.color.danger,
  info: vars.color.info,
  neutral: vars.color.fgMuted,
};

export interface ComputePointsResult {
  points: ChartPoint[];
  min: number;
  max: number;
}

export function computePoints(
  data: readonly ChartDatum[],
  width: number,
  height: number,
  padX = 8,
  padY = 12,
): ComputePointsResult | null {
  if (data.length < 2) return null;
  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = (width - padX * 2) / (data.length - 1);
  const points = data.map((d, i) => ({
    ...d,
    x: padX + i * stepX,
    y: padY + (1 - (d.value - min) / range) * (height - padY * 2),
  }));
  return { points, min, max };
}

export function pointsToLinePath(points: readonly ChartPoint[]): string {
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');
}

export function pointsToAreaPath(points: readonly ChartPoint[], baselineY: number): string {
  const linePath = pointsToLinePath(points);
  const last = points[points.length - 1]!;
  const first = points[0]!;
  return `${linePath} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
}
