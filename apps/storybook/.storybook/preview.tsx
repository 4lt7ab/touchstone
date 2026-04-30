import * as React from 'react';
import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import { DocsContainer, type DocsContainerProps } from '@storybook/blocks';
import { GLOBALS_UPDATED } from '@storybook/core-events';
import {
  darkTheme,
  lightTheme,
  rhythms,
  synthwaveTheme,
  terminalTheme,
} from '@touchstone/themes';
import { ThemeRhythmProvider } from '@touchstone/hooks';
import '@touchstone/themes/styles.css';
import '@touchstone/atoms/styles.css';
import '@touchstone/molecules/styles.css';
import { resolveStorybookTheme } from './themes';
import './preview.css';

const ThemedDocsContainer = ({ children, context }: DocsContainerProps) => {
  const readTheme = React.useCallback(() => {
    const story = context.storyById();
    const ctx = story ? context.getStoryContext(story) : null;
    return ctx?.globals?.theme as string | undefined;
  }, [context]);

  const [themeName, setThemeName] = React.useState<string | undefined>(
    readTheme,
  );

  React.useEffect(() => {
    const handler = () => setThemeName(readTheme());
    context.channel.on(GLOBALS_UPDATED, handler);
    return () => context.channel.off(GLOBALS_UPDATED, handler);
  }, [context, readTheme]);

  return (
    <DocsContainer context={context} theme={resolveStorybookTheme(themeName)}>
      {children}
    </DocsContainer>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    a11y: {
      config: { rules: [] },
    },
    docs: {
      container: ThemedDocsContainer,
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: lightTheme,
        dark: darkTheme,
        synthwave: synthwaveTheme,
        terminal: terminalTheme,
      },
      defaultTheme: 'light',
      parentSelector: 'body',
    }),
    (Story, ctx) => {
      const themeName = ctx.globals.theme as keyof typeof rhythms | undefined;
      const rhythm =
        themeName && themeName in rhythms ? rhythms[themeName] : null;
      return (
        <ThemeRhythmProvider rhythm={rhythm}>
          <Story />
        </ThemeRhythmProvider>
      );
    },
  ],
};

export default preview;
