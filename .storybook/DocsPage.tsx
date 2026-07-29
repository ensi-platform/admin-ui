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

interface IDocsByLocale {
    ru?: string;
    en?: string;
}

const pickLocaleMarkdown = (byLocale: IDocsByLocale | undefined, localeKey: 'ru' | 'en') =>
    byLocale?.[localeKey] ?? byLocale?.ru ?? byLocale?.en;

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
    const params = resolvedOf.preparedMeta.parameters;
    const docsByLocale = params.docsDescriptionByLocale as IDocsByLocale | undefined;
    const exampleByLocale = params.docsExampleByLocale as IDocsByLocale | undefined;
    const docsCssVariables =
        typeof params.docsCssVariables === 'string' ? params.docsCssVariables.trim() : '';
    const docsOnly = params.docsOnly === true;

    const localeKey = locale.startsWith('ru') ? 'ru' : 'en';
    const localeMarkdown = pickLocaleMarkdown(docsByLocale, localeKey);
    const exampleMarkdown = pickLocaleMarkdown(exampleByLocale, localeKey);
    const cssHeading = localeKey === 'ru' ? 'CSS-переменные' : 'CSS variables';

    if (docsOnly) {
        if (localeMarkdown) {
            return (
                <>
                    <Title />
                    <Markdown>{localeMarkdown}</Markdown>
                </>
            );
        }

        return <Primary />;
    }

    return (
        <>
            <Title />
            <Subtitle />
            {localeMarkdown ? <Markdown>{localeMarkdown}</Markdown> : <Description of="meta" />}
            {docsCssVariables ? (
                <Markdown>{`## ${cssHeading}\n\n\`\`\`css\n${docsCssVariables}\n\`\`\``}</Markdown>
            ) : null}
            {exampleMarkdown ? <Markdown>{exampleMarkdown}</Markdown> : null}
            {isSingleStory ? <Description of="story" /> : null}
            <Primary />
            <Controls />
            {isSingleStory ? null : <Stories />}
        </>
    );
};
