import { useContext, useEffect, useState } from 'react';

import {
    Controls,
    Description,
    DocsContext,
    Markdown,
    Primary,
    Stories,
    Subtitle,
    Title,
    useOf,
} from '@storybook/addon-docs/blocks';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';

interface IDocsDescriptionByLocale {
    ru?: string;
    en?: string;
}

/** Official DocsPage layout with locale-aware component description. */
export const DocsPage = () => {
    const resolvedOf = useOf('meta', ['meta']);
    const { stories } = resolvedOf.csfFile;
    const isSingleStory = Object.keys(stories).length === 1;
    const docsContext = useContext(DocsContext);
    const primaryStory = docsContext.componentStories()[0];
    const [globals, setGlobals] = useState(() =>
        primaryStory ? docsContext.getStoryContext(primaryStory).globals : {}
    );

    useEffect(() => {
        const onGlobalsUpdated = ({ globals: next }: { globals: Record<string, unknown> }) => {
            setGlobals(next);
        };

        docsContext.channel.on(GLOBALS_UPDATED, onGlobalsUpdated);

        return () => {
            docsContext.channel.off(GLOBALS_UPDATED, onGlobalsUpdated);
        };
    }, [docsContext.channel]);

    const locale = (globals.locale as string) || 'ru-RU';
    const docsByLocale = resolvedOf.preparedMeta.parameters.docsDescriptionByLocale as
        IDocsDescriptionByLocale | undefined;

    const localeKey = locale.startsWith('ru') ? 'ru' : 'en';
    const localeMarkdown = docsByLocale?.[localeKey] ?? docsByLocale?.ru ?? docsByLocale?.en;

    return (
        <>
            <Title />
            <Subtitle />
            {localeMarkdown ? <Markdown>{localeMarkdown}</Markdown> : <Description of="meta" />}
            {isSingleStory ? <Description of="story" /> : null}
            <Primary />
            <Controls />
            {isSingleStory ? null : <Stories />}
        </>
    );
};
