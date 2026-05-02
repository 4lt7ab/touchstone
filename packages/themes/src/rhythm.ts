export type ThemeRhythmEasing = 'sine' | 'triangle' | 'square';

export interface ThemeRhythm {
  bpm: number;
  easing: ThemeRhythmEasing;
  intensity: number;
}

export const rhythms = {
  synthwave: { bpm: 80, easing: 'sine', intensity: 1 },
  terminal: { bpm: 140, easing: 'square', intensity: 0.8 },
  slate: null,
  'warm-sand': null,
  moss: null,
  coral: null,
  pipboy: { bpm: 140, easing: 'square', intensity: 0.85 },
  neural: { bpm: 60, easing: 'triangle', intensity: 0.9 },
  blackhole: { bpm: 50, easing: 'sine', intensity: 0.7 },
  pacman: { bpm: 110, easing: 'square', intensity: 0.6 },
} as const satisfies Record<string, ThemeRhythm | null>;

export type RhythmName = keyof typeof rhythms;
