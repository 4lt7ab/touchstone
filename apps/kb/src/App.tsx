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
import { SearchPage } from './pages/Search.js';
import { ArticlePage } from './pages/Article.js';
import { BrowsePage } from './pages/Browse.js';
import { CategoryPage } from './pages/Category.js';
import { RecentPage } from './pages/Recent.js';

export type Route =
  | { name: 'search' }
  | { name: 'browse' }
  | { name: 'category'; categoryId: string }
  | { name: 'article'; articleId: string }
  | { name: 'recent' };

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

const RECENT_LIMIT = 10;

export function App() {
  const [route, setRoute] = useState<Route>({ name: 'search' });
  const [themeKey, setThemeKey] = useState<string>('warm-sand');
  const [recent, setRecent] = useState<string[]>([]);

  const theme = useMemo(
    () => themeOptions.find((t) => t.key === themeKey) ?? themeOptions[0]!,
    [themeKey],
  );

  useEffect(() => {
    document.body.className = theme.className;
    document.body.style.background = vars.color.bgPage;
    document.body.style.color = vars.color.fg;
  }, [theme]);

  const navigate = (next: Route) => {
    if (next.name === 'article') {
      setRecent((prev) => {
        const without = prev.filter((id) => id !== next.articleId);
        return [next.articleId, ...without].slice(0, RECENT_LIMIT);
      });
    }
    setRoute(next);
  };

  const rhythmName = themeKey as keyof typeof rhythms;
  const rhythm = rhythmName in rhythms ? rhythms[rhythmName] : null;

  return (
    <ThemeRhythmProvider rhythm={rhythm}>
      {theme.scene && <Background scene={theme.scene} pulse />}
      <AppShellLayout
        route={route}
        onNavigate={navigate}
        themeOptions={themeOptions}
        themeKey={themeKey}
        onThemeChange={setThemeKey}
        recentCount={recent.length}
      >
        {route.name === 'search' && <SearchPage onNavigate={navigate} />}
        {route.name === 'browse' && <BrowsePage onNavigate={navigate} />}
        {route.name === 'category' && (
          <CategoryPage categoryId={route.categoryId} onNavigate={navigate} />
        )}
        {route.name === 'article' && (
          <ArticlePage articleId={route.articleId} onNavigate={navigate} />
        )}
        {route.name === 'recent' && <RecentPage recent={recent} onNavigate={navigate} />}
      </AppShellLayout>
      <Toaster />
    </ThemeRhythmProvider>
  );
}
