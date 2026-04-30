import { addons } from '@storybook/manager-api';
import { GLOBALS_UPDATED, SET_GLOBALS } from '@storybook/core-events';
import { resolveStorybookTheme } from './themes';

const apply = (name: string | undefined) => {
  addons.setConfig({ theme: resolveStorybookTheme(name) });
};

addons.register('touchstone/theme-sync', (api) => {
  apply(api.getGlobals().theme as string | undefined);
  api.on(SET_GLOBALS, ({ globals }) => apply(globals.theme));
  api.on(GLOBALS_UPDATED, ({ globals }) => apply(globals.theme));
});
