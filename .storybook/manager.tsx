import React, { type FC, memo } from 'react';

import { Button } from 'storybook/internal/components';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import { addons, types, useGlobals } from 'storybook/manager-api';

import '../src/ds/tokens/fonts.css';

import { auiDark, auiLight } from './themes';

const applyManagerTheme = (theme?: string) => {
    const isDark = theme === 'dark';

    document.documentElement.dataset.auiManagerTheme = isDark ? 'dark' : 'light';

    addons.setConfig({
        theme: isDark ? auiDark : auiLight,
    });
};

addons.register('aui/theme-sync', api => {
    applyManagerTheme(api.getGlobals()?.theme as string | undefined);

    const channel = api.getChannel();

    channel?.on(GLOBALS_UPDATED, ({ globals }: { globals?: { theme?: string } }) => {
        applyManagerTheme(globals?.theme);
    });
});

const ThemeToggle: FC = memo(() => {
    const [globals, updateGlobals] = useGlobals();
    const isDark = globals.theme === 'dark';

    return (
        <Button
            key="aui-theme-toggle"
            ariaLabel="Theme"
            tooltip={isDark ? 'Light theme' : 'Dark theme'}
            variant="ghost"
            onClick={() => {
                updateGlobals({ theme: isDark ? 'light' : 'dark' });
            }}
        >
            {isDark ? '☀️' : '☾'}
        </Button>
    );
});

addons.register('aui/theme-toggle', () => {
    addons.add('aui/theme-toggle-tool', {
        title: 'Theme',
        type: types.TOOL,
        match: ({ viewMode, tabId }) => !!(viewMode && viewMode.match(/^(story|docs)$/)) && !tabId,
        render: ThemeToggle,
    });
});
