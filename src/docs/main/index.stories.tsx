import { type Meta, type StoryObj } from '@storybook/react';

import { Landing } from './Landing';

export default {
    title: 'Main',
    tags: ['!dev'],
    parameters: {
        docsOnly: true,
        viewMode: 'docs',
        previewTabs: {
            canvas: { hidden: true },
        },
        controls: {
            disable: true,
        },
    },
} satisfies Meta;

export const Docs: StoryObj = {
    render: (_args, { globals }) => <Landing locale={(globals.locale as string) || 'ru-RU'} />,
};
