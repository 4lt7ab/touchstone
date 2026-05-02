import { useEffect, useMemo, useState } from 'react';
import { Background } from '@touchstone/atoms';
import { Toaster } from '@touchstone/molecules';
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
import { AppShellLayout } from './shell/AppShellLayout.js';
import { Dashboard } from './pages/Dashboard.js';
import { ProjectsList } from './pages/ProjectsList.js';
import { ProjectDetail } from './pages/ProjectDetail.js';
import { TasksPage } from './pages/Tasks.js';
import { TeamPage } from './pages/Team.js';

export type Route =
  | { name: 'dashboard' }
  | { name: 'projects' }
  | { name: 'project'; projectId: string }
  | { name: 'tasks' }
  | { name: 'team' };

export interface ThemeOption {
  key: string;
  label: string;
  className: string;
  scene?: 'synthwave' | 'blackhole' | 'neural' | 'pipboy' | 'pacman';
}

const themeOptions: ThemeOption[] = [
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

export function App() {
  const [route, setRoute] = useState<Route>({ name: 'dashboard' });
  const [themeKey, setThemeKey] = useState<string>('warm-sand');

  const theme = useMemo(
    () => themeOptions.find((t) => t.key === themeKey) ?? themeOptions[0]!,
    [themeKey],
  );

  useEffect(() => {
    document.body.className = theme.className;
    document.body.style.background = vars.color.bgPage;
    document.body.style.color = vars.color.fg;
  }, [theme]);

  const rhythmName = themeKey as keyof typeof rhythms;
  const rhythm = rhythmName in rhythms ? rhythms[rhythmName] : null;

  return (
    <ThemeRhythmProvider rhythm={rhythm}>
      {theme.scene && <Background scene={theme.scene} pulse />}
      <AppShellLayout
        route={route}
        onNavigate={setRoute}
        themeOptions={themeOptions}
        themeKey={themeKey}
        onThemeChange={setThemeKey}
      >
        {route.name === 'dashboard' && <Dashboard onNavigate={setRoute} />}
        {route.name === 'projects' && <ProjectsList onNavigate={setRoute} />}
        {route.name === 'project' && (
          <ProjectDetail projectId={route.projectId} onNavigate={setRoute} />
        )}
        {route.name === 'tasks' && <TasksPage />}
        {route.name === 'team' && <TeamPage />}
      </AppShellLayout>
      <Toaster />
    </ThemeRhythmProvider>
  );
}
