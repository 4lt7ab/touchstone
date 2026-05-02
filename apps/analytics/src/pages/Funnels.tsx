import { useMemo, useState } from 'react';
import { Badge, Container, Divider, ProgressBar, Stack, Surface, Text } from '@touchstone/atoms';
import { PageHeader, SegmentedControl } from '@touchstone/molecules';
import { deltaTone, formatDelta, formatNumber, formatPercent, funnels } from '../data/mock.js';

export function Funnels() {
  const [funnelId, setFunnelId] = useState(funnels[0]!.id);

  const funnel = useMemo(() => funnels.find((f) => f.id === funnelId) ?? funnels[0]!, [funnelId]);

  const top = funnel.steps[0]!.count;
  const bottom = funnel.steps[funnel.steps.length - 1]!.count;
  const overall = bottom / top;

  return (
    <Container width="wide" padding="lg">
      <Stack direction="column" gap="lg">
        <PageHeader
          title="Funnels"
          description="Step-by-step conversion across the critical flows."
          divider
        />

        <Stack direction="row" justify="between" align="center" wrap>
          <SegmentedControl
            aria-label="Funnel"
            value={funnelId}
            onValueChange={(v) => setFunnelId(v)}
            options={funnels.map((f) => ({ value: f.id, label: f.name }))}
          />
          <Text size="sm" tone="muted">
            {funnel.description}
          </Text>
        </Stack>

        <Surface level="panel" padding="lg" radius="md">
          <Stack direction="column" gap="md">
            <Stack direction="row" justify="between" align="center" wrap>
              <Stack direction="column" gap="none">
                <Text size="sm" tone="muted">
                  Overall conversion
                </Text>
                <Text size="2xl" weight="bold">
                  {formatPercent(overall)}
                </Text>
              </Stack>
              <Stack direction="row" gap="lg" align="center">
                <Stack direction="column" gap="none" align="end">
                  <Text size="xs" tone="muted">
                    Entered
                  </Text>
                  <Text size="lg" weight="semibold">
                    {formatNumber(top)}
                  </Text>
                </Stack>
                <Stack direction="column" gap="none" align="end">
                  <Text size="xs" tone="muted">
                    Completed
                  </Text>
                  <Text size="lg" weight="semibold">
                    {formatNumber(bottom)}
                  </Text>
                </Stack>
                <Stack direction="column" gap="none" align="end">
                  <Text size="xs" tone="muted">
                    Drop-off
                  </Text>
                  <Badge tone={deltaTone(-(1 - overall))}>{formatDelta(-(1 - overall))}</Badge>
                </Stack>
              </Stack>
            </Stack>
            <Divider />
            <Stack direction="column" gap="md">
              {funnel.steps.map((step, i) => {
                const fromTop = step.count / top;
                const stepConversion = i === 0 ? 1 : step.count / funnel.steps[i - 1]!.count;
                const dropToHere =
                  i === 0
                    ? 0
                    : (funnel.steps[i - 1]!.count - step.count) / funnel.steps[i - 1]!.count;
                return (
                  <Stack key={step.label} direction="column" gap="xs">
                    <Stack direction="row" justify="between" align="center">
                      <Stack direction="row" gap="sm" align="center">
                        <Surface
                          level="muted"
                          radius="full"
                          style={{
                            width: 24,
                            height: 24,
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {i + 1}
                        </Surface>
                        <Text size="sm" weight="medium">
                          {step.label}
                        </Text>
                      </Stack>
                      <Stack direction="row" gap="md" align="center">
                        <Text size="sm" tone="muted">
                          {formatNumber(step.count)}
                        </Text>
                        <Badge tone="neutral">{formatPercent(fromTop, 0)} of top</Badge>
                        {i > 0 && (
                          <Badge tone={deltaTone(-dropToHere)}>
                            {formatDelta(-dropToHere)} from prev
                          </Badge>
                        )}
                      </Stack>
                    </Stack>
                    <ProgressBar
                      value={fromTop * 100}
                      tone={stepConversion < 0.6 ? 'warning' : 'accent'}
                      aria-label={`${step.label} retention`}
                    />
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
        </Surface>
      </Stack>
    </Container>
  );
}
