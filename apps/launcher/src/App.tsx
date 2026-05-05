import { useEffect, useMemo, useRef, useState } from 'react';
import { Background, Button, Kbd, Slider, Stack, Surface, Text } from '@touchstone/atoms';
import {
  CommandItem,
  Toaster,
  Tooltip,
  toast,
} from '@touchstone/molecules';
import { CenteredShell, CommandPalette } from '@touchstone/organisms';
import type { CommandPaletteCommand } from '@touchstone/organisms';
import { ThemeRhythmProvider, useHotkey } from '@touchstone/hooks';
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
  BellIcon,
  BookIcon,
  CopyIcon,
  FolderIcon,
  GearIcon,
  HomeIcon,
  PaletteIcon,
  PlusIcon,
  RocketIcon,
  SparkleIcon,
  StarIcon,
  TrashIcon,
  TrendIcon,
} from '@touchstone/icons';

interface ThemeOption {
  key: string;
  label: string;
  className: string;
  scene?: 'synthwave' | 'blackhole' | 'neural' | 'pipboy' | 'pacman';
}

const THEMES: ThemeOption[] = [
  { key: 'warm-sand', label: 'Warm sand', className: warmSandTheme },
  { key: 'slate', label: 'Slate', className: slateTheme },
  { key: 'moss', label: 'Moss', className: mossTheme },
  { key: 'coral', label: 'Coral', className: coralTheme },
  { key: 'synthwave', label: 'Synthwave', className: synthwaveTheme, scene: 'synthwave' },
  { key: 'terminal', label: 'Terminal', className: terminalTheme },
  { key: 'pipboy', label: 'Pip-Boy', className: pipboyTheme, scene: 'pipboy' },
  { key: 'neural', label: 'Neural', className: neuralTheme, scene: 'neural' },
  { key: 'blackhole', label: 'Blackhole', className: blackholeTheme, scene: 'blackhole' },
  { key: 'pacman', label: 'Pac-Man', className: pacmanTheme, scene: 'pacman' },
];

interface JournalEntry {
  id: number;
  label: string;
  at: string;
}

export function App(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [themeKey, setThemeKey] = useState<string>('warm-sand');
  const [intensity, setIntensity] = useState<number>(60);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const journalIdRef = useRef(0);

  const theme = useMemo(
    () => THEMES.find((t) => t.key === themeKey) ?? THEMES[0]!,
    [themeKey],
  );

  useEffect(() => {
    document.body.className = theme.className;
    document.body.style.background = vars.color.bgPage;
    document.body.style.color = vars.color.fg;
  }, [theme]);

  const log = (label: string): void => {
    journalIdRef.current += 1;
    setJournal((prev) =>
      [
        { id: journalIdRef.current, label, at: new Date().toLocaleTimeString() },
        ...prev,
      ].slice(0, 6),
    );
  };

  useHotkey('mod+k', () => setOpen((o) => !o), { ignoreWhenTyping: false });

  const cycleTheme = (delta: 1 | -1): void => {
    const idx = THEMES.findIndex((t) => t.key === themeKey);
    const next = THEMES[(idx + delta + THEMES.length) % THEMES.length]!;
    setThemeKey(next.key);
    log(`Switched theme → ${next.label}`);
    toast({ tone: 'success', title: `Now in ${next.label}` });
  };

  const copySomething = (): void => {
    const motto = 'touchstone — the team’s measure of quality';
    void navigator.clipboard?.writeText(motto);
    log('Copied motto to clipboard');
    toast({ tone: 'success', title: 'Copied to clipboard' });
  };

  const commands: CommandPaletteCommand[] = useMemo(() => {
    const themeCommands: CommandPaletteCommand[] = THEMES.map((t) => ({
      id: `theme:${t.key}`,
      label: t.label,
      group: 'Themes',
      icon: <PaletteIcon />,
      keywords: ['theme', 'color', 'palette', t.key],
      onSelect: () => {
        setThemeKey(t.key);
        log(`Switched theme → ${t.label}`);
        toast({ tone: 'success', title: `Now in ${t.label}` });
      },
    }));

    return [
      {
        id: 'home',
        label: 'Welcome',
        group: 'Navigate',
        icon: <HomeIcon />,
        shortcut: <Kbd>⌘H</Kbd>,
        keywords: ['home', 'welcome'],
        onSelect: () => log('Navigated to Welcome'),
      },
      {
        id: 'projects',
        label: 'Browse projects',
        group: 'Navigate',
        icon: <FolderIcon />,
        shortcut: <Kbd>⌘P</Kbd>,
        keywords: ['project', 'workspace', 'switch'],
        onSelect: () => log('Browsed projects'),
      },
      {
        id: 'docs',
        label: 'Read the docs',
        group: 'Navigate',
        icon: <BookIcon />,
        keywords: ['help', 'guide', 'manual'],
        onSelect: () => log('Opened docs'),
      },
      {
        id: 'new',
        label: 'New project',
        description: 'Start with an empty workspace',
        group: 'Create',
        icon: <PlusIcon />,
        shortcut: <Kbd>⌘N</Kbd>,
        onSelect: () => {
          log('Created a new project');
          toast({ tone: 'success', title: 'Project created' });
        },
      },
      {
        id: 'launch',
        label: 'Quickstart from template',
        description: 'Boot a fresh workspace from the standard template',
        group: 'Create',
        icon: <RocketIcon />,
        keywords: ['scaffold', 'bootstrap'],
        onSelect: () => {
          log('Quickstarted from template');
          toast({ tone: 'success', title: 'Quickstart fired up' });
        },
      },
      ...themeCommands,
      {
        id: 'cycle-next',
        label: 'Next theme',
        group: 'Themes',
        icon: <SparkleIcon />,
        shortcut: <Kbd>⌥→</Kbd>,
        onSelect: () => cycleTheme(1),
      },
      {
        id: 'cycle-prev',
        label: 'Previous theme',
        group: 'Themes',
        icon: <SparkleIcon />,
        shortcut: <Kbd>⌥←</Kbd>,
        onSelect: () => cycleTheme(-1),
      },
      {
        id: 'copy-motto',
        label: 'Copy motto to clipboard',
        group: 'Actions',
        icon: <CopyIcon />,
        keywords: ['clipboard', 'paste'],
        onSelect: copySomething,
      },
      {
        id: 'star',
        label: 'Star a thing',
        group: 'Actions',
        icon: <StarIcon />,
        onSelect: () => {
          log('Starred a thing');
          toast({ tone: 'success', title: 'Starred ★' });
        },
      },
      {
        id: 'metrics',
        label: 'Peek at metrics',
        group: 'Actions',
        icon: <TrendIcon />,
        keywords: ['analytics', 'stats'],
        onSelect: () => log('Peeked at metrics'),
      },
      {
        id: 'notify',
        label: 'Test a notification',
        group: 'Actions',
        icon: <BellIcon />,
        onSelect: () => {
          log('Triggered a notification');
          toast({ tone: 'info', title: 'Bell rung', description: 'This is a test notification.' });
        },
      },
      {
        id: 'settings',
        label: 'Settings',
        group: 'Settings',
        icon: <GearIcon />,
        shortcut: <Kbd>⌘,</Kbd>,
        onSelect: () => log('Opened Settings'),
      },
      {
        id: 'reset',
        label: 'Clear the journal',
        description: 'Wipe the recent-actions log',
        group: 'Settings',
        tone: 'danger',
        icon: <TrashIcon />,
        onSelect: () => {
          setJournal([]);
          toast({ tone: 'info', title: 'Journal cleared' });
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeKey]);

  // Optional bonus hotkeys — not required, but they show that hotkeys can
  // mirror the palette's shortcut hints without the palette ever opening.
  useHotkey('alt+ArrowRight', () => cycleTheme(1));
  useHotkey('alt+ArrowLeft', () => cycleTheme(-1));

  const rhythmName = themeKey as keyof typeof rhythms;
  const rhythm = rhythmName in rhythms ? rhythms[rhythmName] : null;

  return (
    <ThemeRhythmProvider rhythm={rhythm}>
      {theme.scene ? <Background scene={theme.scene} pulse /> : null}
      <CenteredShell>
        <CenteredShell.Brand>Touchstone Launcher</CenteredShell.Brand>
        <CenteredShell.Card>
          <Stack direction="column" gap="md">
            <Text size="lg">
              Press <Kbd>⌘K</Kbd> (or <Kbd>Ctrl+K</Kbd>) to open the command palette.
            </Text>
            <Text size="sm">
              The palette is the whole interface — every action this app can run lives in
              it. Try <em>quickstart</em>, <em>theme</em>, or just start typing.
            </Text>

            <Tooltip content="Or click the button if your hands are off the keyboard">
              <Button intent="primary" onClick={() => setOpen(true)}>
                open the palette
              </Button>
            </Tooltip>

            <Stack direction="column" gap="sm">
              <Text size="sm">
                A demo Slider — drag, or use arrow keys (Shift = 10× step):
              </Text>
              <Slider
                aria-label="rhythm intensity"
                min={0}
                max={100}
                step={5}
                value={intensity}
                onChange={(v) => setIntensity(v as number)}
                formatValue={(v) => `${v}%`}
              />
              <Text size="xs">intensity: {intensity}%</Text>
            </Stack>

            <Stack direction="column" gap="sm">
              <Text size="sm">Recent actions</Text>
              {journal.length === 0 ? (
                <Text size="sm">
                  <em>(no actions yet — open the palette and try one)</em>
                </Text>
              ) : (
                <Surface
                  as="ul"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    paddingInlineStart: 0,
                    listStyle: 'none',
                    margin: 0,
                  }}
                >
                  {journal.map((entry) => (
                    <JournalRow key={entry.id} label={entry.label} at={entry.at} />
                  ))}
                </Surface>
              )}
            </Stack>
          </Stack>
        </CenteredShell.Card>
        <CenteredShell.Footer>
          <Stack direction="row" gap="sm" align="center" justify="center">
            <Text size="xs">
              themed with <strong>{theme.label}</strong>
            </Text>
            <Text size="xs">·</Text>
            <Text size="xs">
              <Kbd size="sm">⌥→</Kbd> next theme
            </Text>
          </Stack>
        </CenteredShell.Footer>
      </CenteredShell>

      <CommandPalette open={open} onOpenChange={setOpen} commands={commands} />
      <Toaster />
    </ThemeRhythmProvider>
  );
}

interface JournalRowProps {
  label: string;
  at: string;
}

function JournalRow({ label, at }: JournalRowProps): React.JSX.Element {
  return (
    <CommandItem
      role="listitem"
      icon={<SparkleIcon />}
      shortcut={<Text size="xs">{at}</Text>}
    >
      {label}
    </CommandItem>
  );
}
