// Pseudo-deterministic noise — a tiny seeded LCG so the streams look "live"
// without making the page race-condition jittery on every render.
function lcg(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export interface ProbeIdentity {
  designation: string;
  classification: string;
  launchedISO: string;
  range: string;
  position: string;
}

export const probe: ProbeIdentity = {
  designation: 'Observatory Σ-7',
  classification: 'Long-baseline interferometer · class-IV',
  launchedISO: '2031-04-09',
  range: '0.0418 ly · 4.04 × 10¹⁵ m',
  position: 'Sector ⟨14, η, +6⟩ · drift +0.012 ly/yr',
};

export interface CrewMember {
  id: string;
  monogram: string;
  name: string;
  role: string;
  status: 'on-watch' | 'asleep' | 'eva' | 'away';
}

export const crew: CrewMember[] = [
  { id: 'a', monogram: 'AL', name: 'Alessia Loren', role: 'Commander', status: 'on-watch' },
  { id: 'b', monogram: 'KM', name: 'Kaito Murai', role: 'Comms', status: 'on-watch' },
  { id: 'c', monogram: 'NV', name: 'Nia Volkov', role: 'Sciences', status: 'eva' },
  { id: 'd', monogram: 'RJ', name: 'Rui Jiang', role: 'Propulsion', status: 'asleep' },
  { id: 'e', monogram: 'SP', name: 'Sofia Park', role: 'Bio-systems', status: 'on-watch' },
  { id: 'f', monogram: 'TZ', name: 'Théo Z. Mensah', role: 'Astrophys.', status: 'away' },
];

export const crewStatusLabel: Record<CrewMember['status'], string> = {
  'on-watch': 'on watch',
  asleep: 'sleeping',
  eva: 'EVA',
  away: 'off-shift',
};

export const crewStatusTone: Record<
  CrewMember['status'],
  'success' | 'warning' | 'neutral' | 'info'
> = {
  'on-watch': 'success',
  asleep: 'neutral',
  eva: 'warning',
  away: 'info',
};

export interface InstrumentToggle {
  id: string;
  name: string;
  abbr: string;
  description: string;
  on: boolean;
}

export const initialInstruments: InstrumentToggle[] = [
  { id: 'spec', name: 'Spectrometer', abbr: 'SPEC', description: 'wide-band optical', on: true },
  { id: 'mag', name: 'Magnetometer', abbr: 'MAG', description: 'field gradients', on: true },
  { id: 'rad', name: 'Radio array', abbr: 'RAD', description: '21-cm + decametric', on: true },
  { id: 'cam', name: 'Cassegrain camera', abbr: 'CAM', description: 'long exposure', on: false },
  { id: 'grav', name: 'Gravimetric sense', abbr: 'GRAV', description: 'tidal residue', on: false },
];

export interface PowerAllocation {
  id: string;
  label: string;
  draw: number;
}

export const powerAllocations: PowerAllocation[] = [
  { id: 'sci', label: 'Sciences', draw: 38 },
  { id: 'comms', label: 'Comms', draw: 24 },
  { id: 'prop', label: 'Propulsion', draw: 12 },
  { id: 'life', label: 'Life support', draw: 18 },
  { id: 'rsv', label: 'Reserve', draw: 8 },
];

export interface Discovery {
  id: string;
  name: string;
  detail: string;
  weight: number;
  delta: number;
}

export const discoveries: Discovery[] = [
  {
    id: 'd1',
    name: 'Kessler-94 transit',
    detail: 'period 18.2h · candidate',
    weight: 92,
    delta: 0.18,
  },
  {
    id: 'd2',
    name: 'Cluster η-cygnid debris',
    detail: 'mag 12.4 · 3 returns',
    weight: 74,
    delta: 0.06,
  },
  { id: 'd3', name: 'Quasar QSO-1832 flare', detail: 'γ-ray excess', weight: 61, delta: -0.04 },
  { id: 'd4', name: 'Drift body 2114-LJ', detail: 'cometary, hyperbolic', weight: 47, delta: 0.21 },
  {
    id: 'd5',
    name: 'Pulsar PSR-J0440 jitter',
    detail: '14 ms cadence shift',
    weight: 33,
    delta: 0.0,
  },
  {
    id: 'd6',
    name: 'Lensing arc · field 12',
    detail: 'z ≈ 1.6 · 4 mirrors',
    weight: 28,
    delta: 0.09,
  },
];

export interface LogRow {
  id: string;
  ts: string;
  channel: 'sci' | 'cmd' | 'life' | 'comms' | 'astro';
  source: string;
  body: string;
}

export const logs: LogRow[] = [
  {
    id: 'l1',
    ts: '14:02:41',
    channel: 'astro',
    source: 'NV',
    body: 'EVA mark — array re-aligned to ⟨14, η, +6⟩.',
  },
  {
    id: 'l2',
    ts: '14:01:58',
    channel: 'sci',
    source: 'AL',
    body: 'Spectrometer drift compensated, +0.6 nm.',
  },
  {
    id: 'l3',
    ts: '14:01:12',
    channel: 'comms',
    source: 'KM',
    body: 'Carrier wave clean. SNR 38.4 dB.',
  },
  {
    id: 'l4',
    ts: '13:59:05',
    channel: 'cmd',
    source: 'AL',
    body: 'Watch handover acknowledged · Park → Loren.',
  },
  {
    id: 'l5',
    ts: '13:55:33',
    channel: 'life',
    source: 'SP',
    body: 'CO₂ scrubber cycle nominal · 412 ppm.',
  },
  {
    id: 'l6',
    ts: '13:48:17',
    channel: 'astro',
    source: 'TZ',
    body: 'Quasar QSO-1832 flagged for follow-up.',
  },
  {
    id: 'l7',
    ts: '13:42:02',
    channel: 'sci',
    source: 'NV',
    body: 'Magnetometer field 412 nT · gradient stable.',
  },
  {
    id: 'l8',
    ts: '13:31:50',
    channel: 'comms',
    source: 'KM',
    body: 'Earth ping · round-trip 4.7 min.',
  },
];

export const channelTone: Record<
  LogRow['channel'],
  'accent' | 'success' | 'warning' | 'info' | 'neutral'
> = {
  astro: 'accent',
  sci: 'info',
  cmd: 'success',
  life: 'warning',
  comms: 'neutral',
};

export const channelLabel: Record<LogRow['channel'], string> = {
  astro: 'astro',
  sci: 'sciences',
  cmd: 'command',
  life: 'life-sys',
  comms: 'comms',
};

const sectorRows = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ'];
const sectorCols = Array.from({ length: 14 }, (_, i) => String(i + 1));

function buildSkyMatrix(seedShift = 0): readonly (readonly { value: number }[])[] {
  const r = lcg(0xb1ac4 + seedShift);
  return sectorRows.map((_, rowIdx) =>
    sectorCols.map((_, colIdx) => {
      const focus = rowIdx === 5 && colIdx >= 8 && colIdx <= 12 ? 0.55 : 0;
      const value = clamp(r() * 0.45 + focus + r() * 0.18, 0, 1);
      return { value };
    }),
  );
}

export const skyRowLabels = sectorRows;
export const skyColLabels = sectorCols;
export const initialSkyMatrix = buildSkyMatrix();
export const escalatedSkyMatrix = (() => {
  const base = buildSkyMatrix(7);
  return base.map((row, rowIdx) =>
    row.map((cell, colIdx) => {
      const inFocus = rowIdx >= 4 && rowIdx <= 6 && colIdx >= 7 && colIdx <= 12;
      return { value: clamp(cell.value + (inFocus ? 0.55 : 0), 0, 1) };
    }),
  );
})();

const baselineSeries = (n: number, base: number, jitter: number, seed: number) => {
  const r = lcg(seed);
  return Array.from({ length: n }, (_, i) => ({
    label: `${String(i).padStart(2, '0')}:00`,
    value: base + (r() - 0.5) * jitter * 2,
  }));
};

export const initialSolarWind = baselineSeries(48, 412, 32, 0xc0ffee);
export const initialRadiation = baselineSeries(48, 0.84, 0.16, 0xfeed1);
export const initialMagnetosphere = baselineSeries(48, 56, 8, 0xb33f);

export interface SparkSeed {
  id: string;
  label: string;
  unit: string;
  base: number;
  jitter: number;
  seed: number;
}

export const sparkSeeds: SparkSeed[] = [
  { id: 'temp', label: 'Cabin temp', unit: '°C', base: 21.4, jitter: 0.4, seed: 0x1 },
  { id: 'pres', label: 'Cabin pressure', unit: 'kPa', base: 101.3, jitter: 0.6, seed: 0x2 },
  { id: 'co2', label: 'CO₂', unit: 'ppm', base: 412, jitter: 18, seed: 0x3 },
  { id: 'rad', label: 'Hull dose', unit: 'µSv/h', base: 0.84, jitter: 0.12, seed: 0x4 },
  { id: 'sig', label: 'Signal SNR', unit: 'dB', base: 38.4, jitter: 1.2, seed: 0x5 },
  { id: 'rpm', label: 'Reaction wheel', unit: 'rpm', base: 1840, jitter: 70, seed: 0x6 },
];

export function initialSpark(
  seed: SparkSeed,
  length: number,
): {
  label: string;
  value: number;
}[] {
  return baselineSeries(length, seed.base, seed.jitter, seed.seed);
}

// Utility: roll a series forward by one tick — keep `length`, drop the
// oldest, append a new sample. Caller passes a freshly generated random
// number so the source of randomness lives at the call site (testable).
export function nextStep(
  series: { label: string; value: number }[],
  base: number,
  jitter: number,
  rng: number,
): { label: string; value: number }[] {
  const next = base + (rng - 0.5) * jitter * 2;
  const drop = series.slice(1);
  const lastNum = Number(series[series.length - 1]?.label.replace(':00', '')) || 0;
  const nextLabel = `${String((lastNum + 1) % 100).padStart(2, '0')}:00`;
  return [...drop, { label: nextLabel, value: next }];
}

export const transmissions: {
  title: string;
  description: string;
  tone: 'info' | 'success' | 'warning';
}[] = [
  {
    tone: 'info',
    title: 'Transmission · Earth-DSN',
    description: 'Carrier locked, 4.7 min round-trip.',
  },
  { tone: 'success', title: 'Spectrometer calibrated', description: '+0.6 nm correction applied.' },
  {
    tone: 'info',
    title: 'Field 12 packet received',
    description: '128 KB · 14 frames · checksum ok.',
  },
  {
    tone: 'warning',
    title: 'Reaction-wheel drift',
    description: 'Wheel-Y trim queued for 14:18 UTC.',
  },
  { tone: 'info', title: 'Cassegrain warming', description: 'CCD at -94°C and falling.' },
  {
    tone: 'success',
    title: 'EVA hatch sealed',
    description: 'Volkov inboard · suit telemetry green.',
  },
];

export interface ThemeOption {
  key: string;
  label: string;
  spectrum: string;
  className: string;
  scene?: 'synthwave' | 'blackhole' | 'neural' | 'pipboy' | 'pacman';
  rhythmKey:
    | 'warm-sand'
    | 'slate'
    | 'moss'
    | 'coral'
    | 'synthwave'
    | 'terminal'
    | 'pipboy'
    | 'neural'
    | 'blackhole'
    | 'pacman';
}
