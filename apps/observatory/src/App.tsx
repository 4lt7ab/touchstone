import { useEffect, useMemo, useRef, useState } from 'react';
import { Background } from '@touchstone/atoms';
import { Toaster, toast } from '@touchstone/molecules';
import { ThemeRhythmProvider } from '@touchstone/hooks';
import {
  blackholeTheme,
  coralTheme,
  mossTheme,
  neuralTheme,
  pacmanTheme,
  pipboyTheme,
  rhythms,
  slateTheme,
  synthwaveTheme,
  terminalTheme,
  vars,
  warmSandTheme,
} from '@touchstone/themes';
import {
  channelLabel,
  channelTone,
  crew,
  crewStatusLabel,
  crewStatusTone,
  discoveries,
  escalatedSkyMatrix,
  initialInstruments,
  initialMagnetosphere,
  initialRadiation,
  initialSkyMatrix,
  initialSolarWind,
  initialSpark,
  logs,
  nextStep,
  powerAllocations,
  probe,
  sparkSeeds,
  transmissions,
  type InstrumentToggle,
  type ThemeOption,
} from './data/mock.js';
import { Wall } from './Wall.js';

const themeOptions: ThemeOption[] = [
  {
    key: 'warm-sand',
    label: 'Warm sand',
    spectrum: 'visible · daylight',
    className: warmSandTheme,
    rhythmKey: 'warm-sand',
  },
  {
    key: 'slate',
    label: 'Slate',
    spectrum: 'visible · twilight',
    className: slateTheme,
    rhythmKey: 'slate',
  },
  {
    key: 'moss',
    label: 'Moss',
    spectrum: 'visible · forest',
    className: mossTheme,
    rhythmKey: 'moss',
  },
  {
    key: 'coral',
    label: 'Coral',
    spectrum: 'visible · reef',
    className: coralTheme,
    rhythmKey: 'coral',
  },
  {
    key: 'synthwave',
    label: 'Synthwave',
    spectrum: 'plasma · UV',
    className: synthwaveTheme,
    scene: 'synthwave',
    rhythmKey: 'synthwave',
  },
  {
    key: 'terminal',
    label: 'Terminal',
    spectrum: 'monochrome · phosphor',
    className: terminalTheme,
    rhythmKey: 'terminal',
  },
  {
    key: 'pipboy',
    label: 'Pip-Boy',
    spectrum: 'CRT · band-pass',
    className: pipboyTheme,
    scene: 'pipboy',
    rhythmKey: 'pipboy',
  },
  {
    key: 'neural',
    label: 'Neural-net',
    spectrum: 'inference · live',
    className: neuralTheme,
    scene: 'neural',
    rhythmKey: 'neural',
  },
  {
    key: 'blackhole',
    label: 'Event horizon',
    spectrum: 'gravimetric · dark',
    className: blackholeTheme,
    scene: 'blackhole',
    rhythmKey: 'blackhole',
  },
  {
    key: 'pacman',
    label: 'Pac-Man',
    spectrum: 'arcade · waka',
    className: pacmanTheme,
    scene: 'pacman',
    rhythmKey: 'pacman',
  },
];

function lcg(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

const tickRng = lcg(0xfeedface);

const TICK_MS = 1500;
const TRANSMISSION_INTERVAL_MS = 6500;
const ANOMALY_AT_MS = 9000;

function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function App() {
  const [themeKey, setThemeKey] = useState<string>('blackhole');
  const [instruments, setInstruments] = useState<InstrumentToggle[]>(initialInstruments);
  const [solarWind, setSolarWind] = useState(initialSolarWind);
  const [radiation, setRadiation] = useState(initialRadiation);
  const [magnetosphere, setMagnetosphere] = useState(initialMagnetosphere);
  const [sparks, setSparks] = useState(() =>
    sparkSeeds.map((s) => ({ id: s.id, data: initialSpark(s, 24) })),
  );
  const [countdown, setCountdown] = useState<number>(7 * 3600 + 14 * 60 + 22);
  const [skyMatrix, setSkyMatrix] = useState(initialSkyMatrix);
  const [anomalyOpen, setAnomalyOpen] = useState(false);
  const [anomalyAcknowledged, setAnomalyAcknowledged] = useState(false);
  const [anomalyTriggered, setAnomalyTriggered] = useState(false);
  const transmissionIdx = useRef(0);

  const theme = useMemo(
    () => themeOptions.find((t) => t.key === themeKey) ?? themeOptions[0]!,
    [themeKey],
  );

  useEffect(() => {
    document.body.className = theme.className;
    document.body.style.background = vars.color.bgPage;
    document.body.style.color = vars.color.fg;
  }, [theme]);

  // Live ticker — refreshes the chart streams + countdown every TICK_MS.
  useEffect(() => {
    const id = window.setInterval(() => {
      setSolarWind((prev) => nextStep(prev, 412, 32, tickRng()));
      setRadiation((prev) => nextStep(prev, 0.84, 0.16, tickRng()));
      setMagnetosphere((prev) => nextStep(prev, 56, 8, tickRng()));
      setSparks((prev) =>
        prev.map((entry, i) => {
          const seed = sparkSeeds[i]!;
          return {
            id: entry.id,
            data: nextStep(entry.data, seed.base, seed.jitter, tickRng()),
          };
        }),
      );
      setCountdown((c) => (c > 0 ? c - 1 : c));
    }, TICK_MS);
    return () => {
      window.clearInterval(id);
    };
  }, []);

  // Periodic transmission toasts — narration in the corner of the wall.
  useEffect(() => {
    const id = window.setInterval(() => {
      const item = transmissions[transmissionIdx.current % transmissions.length];
      transmissionIdx.current += 1;
      if (!item) return;
      toast({
        tone: item.tone,
        title: item.title,
        description: item.description,
        duration: 4200,
      });
    }, TRANSMISSION_INTERVAL_MS);
    return () => {
      window.clearInterval(id);
    };
  }, []);

  // Scripted anomaly cascade — fires once, ANOMALY_AT_MS after mount.
  useEffect(() => {
    const id = window.setTimeout(() => {
      setAnomalyTriggered(true);
      setSkyMatrix(escalatedSkyMatrix);
      setAnomalyOpen(true);
      toast({
        tone: 'warning',
        title: 'Anomaly · sector ⟨14, η, +6⟩',
        description: 'Gravimetric residual climbing — 4.6σ over baseline.',
        duration: 6800,
      });
    }, ANOMALY_AT_MS);
    return () => {
      window.clearTimeout(id);
    };
  }, []);

  const rhythm = rhythms[theme.rhythmKey];

  const onToggleInstrument = (id: string) => {
    setInstruments((prev) => prev.map((i) => (i.id === id ? { ...i, on: !i.on } : i)));
  };

  const onAcknowledge = () => {
    setAnomalyAcknowledged(true);
    setAnomalyOpen(false);
    toast({
      tone: 'success',
      title: 'Anomaly acknowledged',
      description: 'Rerouting Cassegrain to ⟨14, η, +6⟩. ETA 12s.',
      duration: 5000,
    });
  };

  const onScan = () => {
    setSparks((prev) =>
      prev.map((entry, i) => {
        const seed = sparkSeeds[i]!;
        return {
          id: entry.id,
          data: nextStep(entry.data, seed.base, seed.jitter * 1.6, tickRng()),
        };
      }),
    );
    toast({
      tone: 'info',
      title: 'Manual scan dispatched',
      description: 'All instruments stepped one frame.',
      duration: 2800,
    });
  };

  return (
    <ThemeRhythmProvider rhythm={rhythm}>
      {theme.scene && <Background scene={theme.scene} pulse pattern="grid" />}
      {!theme.scene && <Background pattern="grid" pulse />}
      <Wall
        probe={probe}
        countdown={formatCountdown(countdown)}
        themeOptions={themeOptions}
        themeKey={themeKey}
        onThemeChange={setThemeKey}
        crew={crew}
        crewStatusLabel={crewStatusLabel}
        crewStatusTone={crewStatusTone}
        instruments={instruments}
        onToggleInstrument={onToggleInstrument}
        solarWind={solarWind}
        radiation={radiation}
        magnetosphere={magnetosphere}
        sparks={sparks}
        sparkSeeds={sparkSeeds}
        skyMatrix={skyMatrix}
        powerAllocations={powerAllocations}
        discoveries={discoveries}
        logs={logs}
        channelLabel={channelLabel}
        channelTone={channelTone}
        anomalyTriggered={anomalyTriggered}
        anomalyAcknowledged={anomalyAcknowledged}
        anomalyOpen={anomalyOpen}
        onAnomalyOpenChange={setAnomalyOpen}
        onAcknowledge={onAcknowledge}
        onScan={onScan}
      />
      <Toaster placement="bottom-right" max={3} />
    </ThemeRhythmProvider>
  );
}
