export const duration = {
  fast: '100ms',
  base: '150ms',
  slow: '250ms',
} as const;

export const easing = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  emphasized: 'cubic-bezier(0.3, 0, 0, 1)',
  linear: 'linear',
} as const;
