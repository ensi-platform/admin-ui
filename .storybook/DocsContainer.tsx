import { type ReactNode, useEffect, useState } from 'react';

import { DocsContainer as BaseDocsContainer } from '@storybook/addon-docs/blocks';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';

import { auiDark, auiLight } from './themes';

import type { DocsContextProps } from '@storybook/addon-docs/blocks';
import type { Renderer } from 'storybook/internal/types';

interface IDocsContainerProps {
    children: ReactNode;
    context: DocsContextProps<Renderer>;
}

const readThemeGlobal = (context: DocsContextProps<Renderer>) => {
    try {
        const primary = context.componentStories()[0];
        return (primary ? context.getStoryContext(primary).globals.theme : undefined) as string | undefined;
    } catch {
        return undefined;
    }
};

/** Docs chrome theme synced to globals.theme (addon-themes). */
export const DocsContainer = ({ children, context }: IDocsContainerProps) => {
    const [themeName, setThemeName] = useState(() => readThemeGlobal(context) || 'light');

    useEffect(() => {
        const onGlobalsUpdated = ({ globals }: { globals?: { theme?: string } }) => {
            setThemeName(globals?.theme || 'light');
        };

        context.channel.on(GLOBALS_UPDATED, onGlobalsUpdated);

        return () => {
            context.channel.off(GLOBALS_UPDATED, onGlobalsUpdated);
        };
    }, [context.channel]);

    return (
        <BaseDocsContainer context={context} theme={themeName === 'dark' ? auiDark : auiLight}>
            {children}
        </BaseDocsContainer>
    );
};
