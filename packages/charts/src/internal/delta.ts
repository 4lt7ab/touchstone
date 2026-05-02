const NEUTRAL_EPSILON = 0.005;

export type DeltaTone = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

export function defaultFormatDelta(value: number): string {
  const pct = (value * 100).toFixed(1);
  if (value > 0) return `+${pct}%`;
  if (value < 0) return `${pct}%`;
  return '0.0%';
}

export function defaultDeltaTone(value: number): DeltaTone {
  if (value > NEUTRAL_EPSILON) return 'success';
  if (value < -NEUTRAL_EPSILON) return 'danger';
  return 'neutral';
}
