import { useMemo, useState } from 'react';
import {
  Button,
  Container,
  Divider,
  Grid,
  ProgressBar,
  Stack,
  Surface,
  Text,
} from '@touchstone/atoms';
import { PageHeader, SegmentedControl } from '@touchstone/molecules';
import { BarList, Heatmap, KpiCard, Sparkline, StackedBar, Trendline } from '@touchstone/charts';
import type { HeatmapCell } from '@touchstone/charts';
import { vars } from '@touchstone/themes';
import type { Route } from '../App.js';
import {
  conversionSeries,
  deltaTone,
  formatDelta,
  formatNumber,
  sessionSeries,
  sources,
  topPages,
  trafficSeries,
} from '../data/mock.js';

type Metric = 'visitors' | 'sessions' | 'conversion';

interface OverviewProps {
  onNavigate: (route: Route) => void;
}

export function Overview({ onNavigate }: OverviewProps) {
  const [metric, setMetric] = useState<Metric>('visitors');

  const series = useMemo(() => {
    if (metric === 'sessions') {
      return sessionSeries.map((d) => ({ date: d.date, value: d.sessions }));
    }
    if (metric === 'conversion') {
      return conversionSeries.map((d) => ({ date: d.date, value: d.rate }));
    }
    return trafficSeries.map((d) => ({ date: d.date, value: d.visitors }));
  }, [metric]);

  const total = series.reduce((acc, d) => acc + d.value, 0);
  const previousHalf = series.slice(0, Math.floor(series.length / 2));
  const recentHalf = series.slice(Math.floor(series.length / 2));
  const previousAvg = previousHalf.reduce((a, d) => a + d.value, 0) / previousHalf.length;
  const recentAvg = recentHalf.reduce((a, d) => a + d.value, 0) / recentHalf.length;
  const trendDelta = previousAvg === 0 ? 0 : (recentAvg - previousAvg) / previousAvg;

  const goal = metric === 'conversion' ? 3.5 : metric === 'sessions' ? 600000 : 420000;
  const goalProgress = Math.min(100, (total / goal) * 100);

  const visitorsSpark = trafficSeries.slice(-30).map((d) => ({ label: d.date, value: d.visitors }));
  const sessionsSpark = sessionSeries.slice(-30).map((d) => ({ label: d.date, value: d.sessions }));
  const conversionSpark = conversionSeries
    .slice(-30)
    .map((d) => ({ label: d.date, value: d.rate }));
  const bounceSpark = trafficSeries.slice(-30).map((d, i, arr) => ({
    label: d.date,
    value: 40 - (d.visitors - arr[0]!.visitors) / 200,
  }));

  const activityGrid: HeatmapCell[][] = Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: 24 }, (_, hour) => {
      const morning = hour >= 9 && hour <= 12 ? 22 : 0;
      const afternoon = hour >= 13 && hour <= 17 ? 30 : 0;
      const evening = hour >= 19 && hour <= 21 ? 14 : 0;
      const weekend = day === 0 || day === 6;
      const base = weekend ? 6 : 14;
      const wkndShift = weekend && hour >= 11 && hour <= 22 ? 12 : 0;
      const noise = ((day * 31 + hour * 17) % 9) - 4;
      const value = Math.max(
        0,
        base + (weekend ? 0 : morning + afternoon + evening) + wkndShift + noise,
      );
      return { value };
    }),
  );

  return (
    <Container width="wide" padding="lg">
      <Stack direction="column" gap="lg">
        <PageHeader
          title="Overview"
          description="Last 90 days · all properties"
          actions={
            <Button intent="primary" onClick={() => onNavigate({ name: 'reports' })}>
              Open reports
            </Button>
          }
          divider
        />

        <Grid columns={4} gap="md">
          <KpiCard
            label="Visitors (90d)"
            value={formatNumber(trafficSeries.reduce((a, d) => a + d.visitors, 0))}
            delta={{ value: 0.094 }}
            sparkline={<Sparkline data={visitorsSpark} aria-label="Visitors 30-day trend" />}
          />
          <KpiCard
            label="Sessions (90d)"
            value={formatNumber(sessionSeries.reduce((a, d) => a + d.sessions, 0))}
            delta={{ value: 0.061 }}
            sparkline={<Sparkline data={sessionsSpark} aria-label="Sessions 30-day trend" />}
          />
          <KpiCard
            label="Avg conversion"
            value={`${(
              conversionSeries.reduce((a, d) => a + d.rate, 0) / conversionSeries.length
            ).toFixed(2)}%`}
            delta={{ value: 0.118 }}
            sparkline={<Sparkline data={conversionSpark} aria-label="Conversion 30-day trend" />}
          />
          <KpiCard
            label="Bounce rate"
            value="38.2%"
            delta={{ value: -0.022, tone: 'success' }}
            sparkline={
              <Sparkline data={bounceSpark} tone="success" aria-label="Bounce rate 30-day trend" />
            }
          />
        </Grid>

        <Surface level="panel" padding="lg" radius="md">
          <Stack direction="column" gap="md">
            <Stack direction="row" justify="between" align="center" wrap>
              <Stack direction="column" gap="none">
                <Text size="lg" weight="semibold">
                  Trend
                </Text>
                <Text size="sm" tone="muted">
                  {formatNumber(total)} total ·{' '}
                  <span
                    style={{
                      color:
                        deltaTone(trendDelta) === 'success'
                          ? vars.color.success
                          : deltaTone(trendDelta) === 'danger'
                            ? vars.color.danger
                            : vars.color.fgMuted,
                    }}
                  >
                    {formatDelta(trendDelta)}
                  </span>{' '}
                  vs previous 45 days
                </Text>
              </Stack>
              <SegmentedControl
                aria-label="Metric"
                value={metric}
                onValueChange={(v) => setMetric(v)}
                options={[
                  { value: 'visitors', label: 'Visitors' },
                  { value: 'sessions', label: 'Sessions' },
                  { value: 'conversion', label: 'Conversion' },
                ]}
              />
            </Stack>
            <Trendline
              data={series.map((d) => ({ label: d.date, value: d.value }))}
              aria-label="Trend chart"
              format={(v) =>
                metric === 'conversion' ? `${v.toFixed(2)}%` : formatNumber(Math.round(v))
              }
            />
            <Divider />
            <Stack direction="row" justify="between" align="center">
              <Text size="sm" tone="muted">
                Goal pacing · target {metric === 'conversion' ? '3.5%' : formatNumber(goal)}
              </Text>
              <Text size="sm">{goalProgress.toFixed(0)}%</Text>
            </Stack>
            <ProgressBar
              value={goalProgress}
              tone={goalProgress >= 80 ? 'accent' : 'warning'}
              aria-label="Goal pacing"
            />
          </Stack>
        </Surface>

        <Surface level="panel" padding="lg" radius="md">
          <Stack direction="column" gap="md">
            <Stack direction="row" justify="between" align="center">
              <Text size="lg" weight="semibold">
                Source mix
              </Text>
              <Text size="sm" tone="muted">
                90-day composition
              </Text>
            </Stack>
            <StackedBar
              aria-label="Source mix"
              segments={sources.map((s) => ({
                id: s.id,
                label: s.name,
                value: s.share * 100,
              }))}
              format={(v) => `${v.toFixed(0)}%`}
              height={20}
            />
          </Stack>
        </Surface>

        <Grid columns={{ min: 'lg' }} gap="lg">
          <Surface level="panel" padding="lg" radius="md">
            <Stack direction="column" gap="md">
              <Stack direction="row" justify="between" align="center">
                <Text size="lg" weight="semibold">
                  Top sources
                </Text>
                <Text size="sm" tone="muted">
                  share of visitors
                </Text>
              </Stack>
              <BarList
                aria-label="Top sources"
                items={sources.map((s) => ({
                  id: s.id,
                  name: s.name,
                  value: s.share * 100,
                  delta: { value: s.delta },
                }))}
                format={(v) => `${v.toFixed(0)}%`}
                max={100}
              />
            </Stack>
          </Surface>

          <Surface level="panel" padding="lg" radius="md">
            <Stack direction="column" gap="md">
              <Text size="lg" weight="semibold">
                Top pages
              </Text>
              <Divider />
              <BarList
                aria-label="Top pages"
                items={topPages.map((p) => ({
                  id: p.path,
                  name: p.path,
                  description: `${formatNumber(p.views)} views`,
                  value: p.views,
                  delta: { value: p.delta },
                }))}
                format={(v) => formatNumber(v)}
              />
            </Stack>
          </Surface>
        </Grid>

        <Surface level="panel" padding="lg" radius="md">
          <Stack direction="column" gap="md">
            <Stack direction="row" justify="between" align="center">
              <Text size="lg" weight="semibold">
                Visitors vs Sessions
              </Text>
              <Text size="sm" tone="muted">
                90-day overlay
              </Text>
            </Stack>
            <Trendline
              aria-label="Visitors vs Sessions over 90 days"
              format={(v) => formatNumber(Math.round(v))}
              height={180}
              series={[
                {
                  label: 'Visitors',
                  data: trafficSeries.map((d) => ({
                    label: d.date,
                    value: d.visitors,
                  })),
                  tone: 'accent',
                },
                {
                  label: 'Sessions',
                  data: sessionSeries.map((d) => ({
                    label: d.date,
                    value: d.sessions,
                  })),
                  tone: 'info',
                },
              ]}
            />
          </Stack>
        </Surface>

        <Surface level="panel" padding="lg" radius="md">
          <Stack direction="column" gap="md">
            <Stack direction="row" justify="between" align="center">
              <Text size="lg" weight="semibold">
                Activity by hour
              </Text>
              <Text size="sm" tone="muted">
                7 days × 24 hours · UTC
              </Text>
            </Stack>
            <Heatmap
              data={activityGrid}
              aria-label="Sessions by day-of-week and hour"
              rowLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
              columnLabels={Array.from({ length: 24 }, (_, i) => `${i}`)}
              cellSize={16}
              cellGap={2}
              format={(v) => `${v} sessions`}
            />
          </Stack>
        </Surface>
      </Stack>
    </Container>
  );
}
