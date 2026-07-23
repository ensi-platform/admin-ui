import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import { addons } from 'storybook/manager-api';

import { auiDark, auiLight } from './themes.js';

const applyManagerTheme = (theme?: string) => {
    addons.setConfig({
        theme: theme === 'dark' ? auiDark : auiLight,
    });
};

applyManagerTheme('light');

addons.register('aui/theme-sync', api => {
    const channel = api.getChannel();

    channel?.on(GLOBALS_UPDATED, ({ globals }: { globals?: { theme?: string } }) => {
        applyManagerTheme(globals?.theme);
    });
});
