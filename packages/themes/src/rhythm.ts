export type ThemeRhythmEasing = 'sine' | 'triangle' | 'square';

export interface ThemeRhythm {
  bpm: number;
  easing: ThemeRhythmEasing;
  intensity: number;
}

export const rhythms = {
  light: null,
  dark: null,
  synthwave: { bpm: 80, easing: 'sine', intensity: 1 },
  terminal: { bpm: 140, easing: 'square', intensity: 0.8 },
} as const satisfies Record<string, ThemeRhythm | null>;

export type RhythmName = keyof typeof rhythms;
