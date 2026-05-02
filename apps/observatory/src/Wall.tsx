import type { CSSProperties, ReactNode } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Divider,
  ProgressBar,
  Stack,
  Surface,
  Switch,
  Text,
} from '@touchstone/atoms';
import './wall.css';
import { AlertBanner, Table } from '@touchstone/molecules';
import { Dialog, Menu, Tabs } from '@touchstone/organisms';
import {
  BarList,
  Heatmap,
  KpiCard,
  Sparkline,
  StackedBar,
  Trendline,
  type SparklineTone,
} from '@touchstone/charts';
import {
  ChevronDownIcon,
  PaletteIcon,
  RocketIcon,
  ShieldIcon,
  SparkleIcon,
} from '@touchstone/icons';
import type {
  CrewMember,
  Discovery,
  InstrumentToggle,
  LogRow,
  PowerAllocation,
  ProbeIdentity,
  SparkSeed,
  ThemeOption,
} from './data/mock.js';

interface SparkBundle {
  id: string;
  data: { label: string; value: number }[];
}

interface SeriesPoint {
  label: string;
  value: number;
}

export interface WallProps {
  probe: ProbeIdentity;
  countdown: string;
  themeOptions: ThemeOption[];
  themeKey: string;
  onThemeChange: (key: string) => void;
  crew: CrewMember[];
  crewStatusLabel: Record<CrewMember['status'], string>;
  crewStatusTone: Record<CrewMember['status'], 'success' | 'warning' | 'neutral' | 'info'>;
  instruments: InstrumentToggle[];
  onToggleInstrument: (id: string) => void;
  solarWind: SeriesPoint[];
  radiation: SeriesPoint[];
  magnetosphere: SeriesPoint[];
  sparks: SparkBundle[];
  sparkSeeds: SparkSeed[];
  skyMatrix: readonly (readonly { value: number }[])[];
  powerAllocations: PowerAllocation[];
  discoveries: Discovery[];
  logs: LogRow[];
  channelLabel: Record<LogRow['channel'], string>;
  channelTone: Record<LogRow['channel'], 'accent' | 'success' | 'warning' | 'info' | 'neutral'>;
  anomalyTriggered: boolean;
  anomalyAcknowledged: boolean;
  anomalyOpen: boolean;
  onAnomalyOpenChange: (open: boolean) => void;
  onAcknowledge: () => void;
  onScan: () => void;
}

const areaStyle = (area: string): CSSProperties => ({ gridArea: area });

const monospaceish: CSSProperties = {
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: '0.04em',
};

export function Wall(props: WallProps): React.JSX.Element {
  return (
    <div className="wall">
      <HeaderRow {...props} />
      <KpiColumn {...props} />
      <TrendlinePanel {...props} />
      <CrewPanel {...props} />
      <LifeSupportPanel {...props} />
      <SkyChartPanel {...props} />
      <PowerPanel {...props} />
      <InstrumentsPanel {...props} />
      <ConsolePanel {...props} />
      <AnomalyDialog {...props} />
    </div>
  );
}

function HeaderRow({
  probe,
  countdown,
  themeOptions,
  themeKey,
  onThemeChange,
  anomalyTriggered,
  anomalyAcknowledged,
  onAcknowledge,
  onScan,
}: WallProps): React.JSX.Element {
  const activeTheme = themeOptions.find((t) => t.key === themeKey)!;
  const showAnomalyBanner = anomalyTriggered && !anomalyAcknowledged;
  return (
    <div style={areaStyle('header')}>
      <Stack direction="column" gap="sm">
        <Surface
          level="panel"
          radius="md"
          padding="md"
          glow={anomalyTriggered && !anomalyAcknowledged ? 'pulse' : 'soft'}
        >
          <Stack direction="row" align="center" justify="between" gap="md" wrap>
            <Stack direction="row" align="center" gap="md">
              <Avatar shape="square" size="md" tone="accent" aria-label="Mission insignia">
                <RocketIcon />
              </Avatar>
              <Stack direction="column" gap="none">
                <Stack direction="row" align="center" gap="sm" wrap>
                  <Text size="lg" weight="bold">
                    {probe.designation}
                  </Text>
                  <Badge tone="accent">live link</Badge>
                  {anomalyTriggered && !anomalyAcknowledged ? (
                    <Badge tone="danger">anomaly</Badge>
                  ) : null}
                </Stack>
                <Text size="xs" tone="muted">
                  {probe.classification} · launched {probe.launchedISO}
                </Text>
              </Stack>
            </Stack>
            <Stack direction="row" align="center" gap="md" wrap>
              <Stack direction="column" align="end" gap="none">
                <Text size="xs" tone="muted">
                  next horizon contact
                </Text>
                <span style={monospaceish}>
                  <Text size="xl" weight="bold" tone="accent">
                    T − {countdown}
                  </Text>
                </span>
              </Stack>
              <Stack direction="column" align="end" gap="none">
                <Text size="xs" tone="muted">
                  range
                </Text>
                <Text size="sm" weight="medium">
                  {probe.range}
                </Text>
              </Stack>
              <Stack direction="row" align="center" gap="sm" wrap>
                <Menu>
                  <Menu.Trigger>
                    <Button intent="secondary" size="sm">
                      <PaletteIcon />
                      <span style={{ marginLeft: 8 }}>Spectrum · {activeTheme.label}</span>
                      <span style={{ marginLeft: 8 }}>
                        <ChevronDownIcon />
                      </span>
                    </Button>
                  </Menu.Trigger>
                  <Menu.Content aria-label="Sensor spectrum" side="bottom" align="end">
                    {themeOptions.map((opt) => (
                      <Menu.Item
                        key={opt.key}
                        onSelect={() => onThemeChange(opt.key)}
                        trailing={
                          <Text size="xs" tone="muted">
                            {opt.spectrum}
                          </Text>
                        }
                      >
                        {opt.label}
                      </Menu.Item>
                    ))}
                  </Menu.Content>
                </Menu>
                <Button intent="primary" size="sm" onClick={onScan}>
                  <SparkleIcon />
                  <span style={{ marginLeft: 8 }}>Scan now</span>
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Surface>
        {showAnomalyBanner ? (
          <AlertBanner
            tone="warning"
            title="Sector ⟨14, η, +6⟩ · gravimetric residual"
            onDismiss={onAcknowledge}
            dismissLabel="acknowledge"
          >
            Sustained 4.6σ excess against rolling baseline. Recommend re-pointing the Cassegrain and
            capturing a 90 s long-exposure frame for the lensing arc field.
          </AlertBanner>
        ) : null}
      </Stack>
    </div>
  );
}

function KpiColumn({ sparks, sparkSeeds }: WallProps): React.JSX.Element {
  const headline = sparks.slice(0, 4);
  return (
    <div style={areaStyle('kpis')}>
      <Surface level="panel" radius="md" padding="md">
        <Stack direction="column" gap="md">
          <PanelHeading kicker="primary readouts" title="Vital signs" />
          {headline.map((bundle, i) => {
            const seed = sparkSeeds[i]!;
            const last = bundle.data[bundle.data.length - 1]?.value ?? 0;
            const prev = bundle.data[bundle.data.length - 2]?.value ?? last;
            const delta = (last - prev) / Math.max(1e-6, Math.abs(prev || 1));
            return (
              <KpiCard
                key={bundle.id}
                label={`${seed.label} · ${seed.unit}`}
                value={formatNumber(last)}
                delta={{ value: delta, caption: 'last frame' }}
                sparkline={
                  <Sparkline
                    data={bundle.data}
                    aria-label={`${seed.label} trend`}
                    tone={kpiSparkTone(i)}
                    height={28}
                  />
                }
              />
            );
          })}
        </Stack>
      </Surface>
    </div>
  );
}

function TrendlinePanel({ solarWind, radiation, magnetosphere }: WallProps): React.JSX.Element {
  return (
    <div style={areaStyle('trendline')}>
      <Surface level="panel" radius="md" padding="md">
        <Stack direction="column" gap="md">
          <Stack direction="row" justify="between" align="center" gap="md">
            <PanelHeading
              kicker="instrument cluster · 48 frames"
              title="Solar wind · radiation · magnetosphere"
            />
            <Stack direction="row" gap="xs">
              <Badge tone="accent">SOL-α</Badge>
              <Badge tone="warning">γ-flux</Badge>
              <Badge tone="info">B-field</Badge>
            </Stack>
          </Stack>
          <Trendline
            aria-label="Solar wind, radiation, and magnetosphere trends"
            height={220}
            format={(n) => formatNumber(n)}
            series={[
              { label: 'Solar wind (km/s)', data: solarWind, tone: 'accent', fill: true },
              { label: 'Radiation (µSv/h)', data: radiation, tone: 'warning' },
              { label: 'Magnetosphere (nT)', data: magnetosphere, tone: 'info' },
            ]}
            showLegend
          />
        </Stack>
      </Surface>
    </div>
  );
}

function CrewPanel({ crew, crewStatusLabel, crewStatusTone }: WallProps): React.JSX.Element {
  return (
    <div style={areaStyle('crew')}>
      <Surface level="panel" radius="md" padding="md">
        <Stack direction="column" gap="md">
          <PanelHeading kicker="six souls aboard" title="Crew watch" />
          <Stack direction="column" gap="sm">
            {crew.map((c) => (
              <Stack key={c.id} direction="row" align="center" justify="between" gap="sm">
                <Stack direction="row" align="center" gap="sm">
                  <Avatar size="md" monogram={c.monogram} aria-label={c.name} />
                  <Stack direction="column" gap="none">
                    <Text size="sm" weight="medium">
                      {c.name}
                    </Text>
                    <Text size="xs" tone="muted">
                      {c.role}
                    </Text>
                  </Stack>
                </Stack>
                <Badge tone={crewStatusTone[c.status]}>{crewStatusLabel[c.status]}</Badge>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Surface>
    </div>
  );
}

function LifeSupportPanel({ sparks, sparkSeeds }: WallProps): React.JSX.Element {
  const tail = sparks.slice(2);
  const seedTail = sparkSeeds.slice(2);
  // Map a few real-feeling life-support reservoirs to ProgressBar fills.
  const reservoirs = [
    { id: 'fuel', label: 'Δv reserve', value: 78, tone: 'success' as const },
    { id: 'oxy', label: 'Oxygen', value: 92, tone: 'success' as const },
    { id: 'water', label: 'Water recycled', value: 64, tone: 'accent' as const },
    { id: 'heat', label: 'Heat dump', value: 41, tone: 'warning' as const },
  ];
  return (
    <div style={areaStyle('life')}>
      <Surface level="panel" radius="md" padding="md">
        <Stack direction="column" gap="md">
          <PanelHeading kicker="life-support" title="Reservoirs" />
          <Stack direction="column" gap="sm">
            {reservoirs.map((r) => (
              <Stack key={r.id} direction="column" gap="xs">
                <Stack direction="row" justify="between" gap="sm">
                  <Text size="sm">{r.label}</Text>
                  <Text size="sm" tone="muted">
                    {r.value}%
                  </Text>
                </Stack>
                <FillBar value={r.value} tone={r.tone} label={r.label} />
              </Stack>
            ))}
          </Stack>
          <Divider />
          <Stack direction="column" gap="sm">
            <Text size="xs" tone="muted">
              ambient channels
            </Text>
            {tail.map((bundle, i) => {
              const seed = seedTail[i]!;
              const last = bundle.data[bundle.data.length - 1]?.value ?? 0;
              return (
                <Stack key={bundle.id} direction="row" align="center" justify="between" gap="sm">
                  <Text size="xs">{seed.label}</Text>
                  <div style={{ flex: 1, maxWidth: 96 }}>
                    <Sparkline
                      data={bundle.data}
                      tone={ambientSparkTone(i)}
                      height={20}
                      showEndpoint={false}
                      aria-label={`${seed.label} sparkline`}
                    />
                  </div>
                  <span style={monospaceish}>
                    <Text size="xs" weight="medium">
                      {formatNumber(last)} {seed.unit}
                    </Text>
                  </span>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </Surface>
    </div>
  );
}

function SkyChartPanel({
  skyMatrix,
  anomalyTriggered,
  anomalyAcknowledged,
}: WallProps): React.JSX.Element {
  const hot = anomalyTriggered && !anomalyAcknowledged;
  return (
    <div style={areaStyle('skychart')}>
      <Surface level="panel" radius="md" padding="md" glow={hot ? 'pulse' : 'none'}>
        <Stack direction="column" gap="md">
          <Stack direction="row" justify="between" align="center" gap="md">
            <PanelHeading
              kicker="long-baseline interferometer"
              title="Sky chart · sectors α–θ ⟨1–14⟩"
            />
            <Stack direction="row" gap="xs" align="center">
              <Badge tone={hot ? 'danger' : 'neutral'}>
                {hot ? 'focal · ⟨14, η, +6⟩' : 'baseline drift'}
              </Badge>
              <Badge tone="info">snapshot · 1.5 s</Badge>
            </Stack>
          </Stack>
          <div style={{ overflowX: 'auto' }}>
            <Heatmap
              data={skyMatrix}
              aria-label="Sky chart"
              rowLabels={['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ']}
              columnLabels={Array.from({ length: 14 }, (_, i) => String(i + 1))}
              tone={hot ? 'danger' : 'accent'}
              cellSize={28}
              cellGap={3}
              format={(n) => `${(n * 100).toFixed(1)}% intensity`}
            />
          </div>
        </Stack>
      </Surface>
    </div>
  );
}

function PowerPanel({ powerAllocations }: WallProps): React.JSX.Element {
  return (
    <div style={areaStyle('power')}>
      <Surface level="panel" radius="md" padding="md">
        <Stack direction="column" gap="md">
          <PanelHeading kicker="reactor draw · 100 kW" title="Power allocation" />
          <StackedBar
            aria-label="Power allocation by subsystem"
            height={20}
            segments={powerAllocations.map((p) => ({
              id: p.id,
              label: p.label,
              value: p.draw,
            }))}
          />
          <Divider />
          <Stack direction="column" gap="sm">
            <Text size="xs" tone="muted">
              integrity envelope
            </Text>
            <Stack direction="row" justify="between" align="center" gap="sm">
              <Stack direction="row" align="center" gap="sm">
                <Avatar shape="square" size="sm" tone="accent" aria-label="Shield">
                  <ShieldIcon />
                </Avatar>
                <Text size="sm">Hull integrity</Text>
              </Stack>
              <Badge tone="success">99.7%</Badge>
            </Stack>
            <Stack direction="row" justify="between" align="center" gap="sm">
              <Text size="sm">Comms array</Text>
              <Badge tone="success">nominal</Badge>
            </Stack>
            <Stack direction="row" justify="between" align="center" gap="sm">
              <Text size="sm">Reaction wheels</Text>
              <Badge tone="warning">trim due</Badge>
            </Stack>
          </Stack>
        </Stack>
      </Surface>
    </div>
  );
}

function InstrumentsPanel({ instruments, onToggleInstrument }: WallProps): React.JSX.Element {
  return (
    <div style={areaStyle('instruments')}>
      <Surface level="panel" radius="md" padding="md">
        <Stack direction="column" gap="md">
          <PanelHeading kicker="instrument bus" title="Toggles" />
          <Stack direction="column" gap="sm">
            {instruments.map((inst) => (
              <Stack key={inst.id} direction="row" align="center" justify="between" gap="sm">
                <Stack direction="column" gap="none">
                  <Stack direction="row" gap="xs" align="center">
                    <Badge tone={inst.on ? 'success' : 'neutral'}>{inst.abbr}</Badge>
                    <Text size="sm" weight="medium">
                      {inst.name}
                    </Text>
                  </Stack>
                  <Text size="xs" tone="muted">
                    {inst.description}
                  </Text>
                </Stack>
                <Switch
                  checked={inst.on}
                  onCheckedChange={() => onToggleInstrument(inst.id)}
                  aria-label={`Toggle ${inst.name}`}
                />
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Surface>
    </div>
  );
}

function ConsolePanel({
  discoveries,
  logs,
  channelLabel,
  channelTone,
  sparks,
  sparkSeeds,
}: WallProps): React.JSX.Element {
  return (
    <div style={areaStyle('console')}>
      <Surface level="panel" radius="md" padding="md">
        <Tabs defaultValue="logs">
          <Stack direction="column" gap="md">
            <Stack direction="row" justify="between" align="center" gap="md">
              <PanelHeading kicker="console" title="Mission stream" />
              <Tabs.List aria-label="Console mode">
                <Tabs.Trigger value="logs">Logs</Tabs.Trigger>
                <Tabs.Trigger value="discoveries">Discoveries</Tabs.Trigger>
                <Tabs.Trigger value="spectrum">Spectrum</Tabs.Trigger>
              </Tabs.List>
            </Stack>
            <Tabs.Panel value="logs">
              <div className="wall__table-scroll">
                <Table density="compact" striped>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Time (UTC)</Table.HeaderCell>
                      <Table.HeaderCell>Channel</Table.HeaderCell>
                      <Table.HeaderCell>From</Table.HeaderCell>
                      <Table.HeaderCell>Entry</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {logs.map((row) => (
                      <Table.Row key={row.id}>
                        <Table.Cell>
                          <span style={monospaceish}>
                            <Text size="sm">{row.ts}</Text>
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge tone={channelTone[row.channel]}>{channelLabel[row.channel]}</Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Avatar
                            size="sm"
                            monogram={row.source}
                            aria-label={`From ${row.source}`}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <Text size="sm">{row.body}</Text>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="discoveries">
              <BarList
                aria-label="Discoveries this watch"
                items={discoveries.map((d) => ({
                  id: d.id,
                  name: d.name,
                  description: d.detail,
                  value: d.weight,
                  delta: { value: d.delta, caption: 'priority' },
                }))}
                format={(n) => `${n}`}
              />
            </Tabs.Panel>
            <Tabs.Panel value="spectrum">
              <Stack direction="column" gap="md">
                {sparks.map((bundle, i) => {
                  const seed = sparkSeeds[i]!;
                  const last = bundle.data[bundle.data.length - 1]?.value ?? 0;
                  return (
                    <Stack
                      key={bundle.id}
                      direction="row"
                      align="center"
                      justify="between"
                      gap="md"
                    >
                      <div style={{ minWidth: 160 }}>
                        <Stack direction="column" gap="none">
                          <Text size="sm" weight="medium">
                            {seed.label}
                          </Text>
                          <Text size="xs" tone="muted">
                            {seed.unit} · 24-frame window
                          </Text>
                        </Stack>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Sparkline
                          data={bundle.data}
                          aria-label={`${seed.label} extended trend`}
                          tone={spectrumSparkTone(i)}
                          height={36}
                        />
                      </div>
                      <span style={monospaceish}>
                        <Text size="md" weight="bold">
                          {formatNumber(last)}
                        </Text>
                      </span>
                    </Stack>
                  );
                })}
              </Stack>
            </Tabs.Panel>
          </Stack>
        </Tabs>
      </Surface>
    </div>
  );
}

function AnomalyDialog({
  anomalyOpen,
  onAnomalyOpenChange,
  onAcknowledge,
}: WallProps): React.JSX.Element {
  return (
    <Dialog open={anomalyOpen} onOpenChange={onAnomalyOpenChange}>
      <Dialog.Content
        title="Sector ⟨14, η, +6⟩ — anomaly cascade"
        description="Gravimetric residual has held above the 4.6σ threshold for 12 consecutive frames. The lensing-arc field overlaps this sector by 38%."
      >
        <Stack direction="column" gap="md">
          <Stack direction="column" gap="sm">
            <Text size="sm" weight="medium">
              Recommended response
            </Text>
            <Stack direction="column" gap="xs">
              <RecommendationRow
                label="Re-point Cassegrain"
                detail="ΔAz 4.2° · ΔAlt -1.8° · ETA 12 s"
                tone="accent"
              />
              <RecommendationRow
                label="Engage gravimetric sense"
                detail="off → primed (+0.6 kW draw)"
                tone="info"
              />
              <RecommendationRow
                label="Wake Volkov from EVA"
                detail="comms ping, suit telemetry green"
                tone="warning"
              />
            </Stack>
          </Stack>
          <Divider />
          <Stack direction="row" justify="end" gap="sm">
            <Dialog.Close>
              <Button intent="ghost">Defer</Button>
            </Dialog.Close>
            <Button intent="primary" onClick={onAcknowledge}>
              Acknowledge & dispatch
            </Button>
          </Stack>
        </Stack>
      </Dialog.Content>
    </Dialog>
  );
}

interface RecommendationRowProps {
  label: string;
  detail: string;
  tone: 'accent' | 'info' | 'warning';
}

function RecommendationRow({ label, detail, tone }: RecommendationRowProps): React.JSX.Element {
  return (
    <Surface level="muted" radius="sm" padding="sm">
      <Stack direction="row" justify="between" align="center" gap="md">
        <Stack direction="column" gap="none">
          <Text size="sm" weight="medium">
            {label}
          </Text>
          <Text size="xs" tone="muted">
            {detail}
          </Text>
        </Stack>
        <Badge tone={tone}>queued</Badge>
      </Stack>
    </Surface>
  );
}

interface PanelHeadingProps {
  kicker: string;
  title: string;
  trailing?: ReactNode;
}

function PanelHeading({ kicker, title, trailing }: PanelHeadingProps): React.JSX.Element {
  return (
    <Stack direction="row" justify="between" align="end" gap="md">
      <Stack direction="column" gap="none">
        <Text size="xs" tone="muted">
          {kicker.toUpperCase()}
        </Text>
        <Text size="md" weight="semibold">
          {title}
        </Text>
      </Stack>
      {trailing}
    </Stack>
  );
}

interface FillBarProps {
  value: number;
  tone: 'accent' | 'success' | 'warning' | 'danger';
  label: string;
}

function FillBar({ value, tone, label }: FillBarProps): React.JSX.Element {
  return <ProgressBar value={value} tone={tone} aria-label={`${label} ${value}%`} size="sm" />;
}

function formatNumber(n: number): string {
  if (Math.abs(n) >= 1000) return n.toFixed(0);
  if (Math.abs(n) >= 100) return n.toFixed(1);
  if (Math.abs(n) >= 10) return n.toFixed(2);
  return n.toFixed(3);
}

const KPI_TONES: SparklineTone[] = ['accent', 'info', 'warning', 'success'];
const AMBIENT_TONES: SparklineTone[] = ['neutral', 'info', 'success', 'warning'];
const SPECTRUM_TONES: SparklineTone[] = [
  'accent',
  'info',
  'warning',
  'success',
  'danger',
  'neutral',
];

function kpiSparkTone(i: number): SparklineTone {
  return KPI_TONES[i % KPI_TONES.length]!;
}
function ambientSparkTone(i: number): SparklineTone {
  return AMBIENT_TONES[i % AMBIENT_TONES.length]!;
}
function spectrumSparkTone(i: number): SparklineTone {
  return SPECTRUM_TONES[i % SPECTRUM_TONES.length]!;
}
