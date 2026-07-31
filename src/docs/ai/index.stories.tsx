import { Fragment } from 'react';

import { type Meta, type StoryObj } from '@storybook/react';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';

export default {
    title: 'AI',
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
        docsDescriptionByLocale: {
            ru: DescriptionRu,
            en: DescriptionEn,
        },
    },
} satisfies Meta;

export const Docs: StoryObj = {
    // eslint-disable-next-line react/jsx-no-useless-fragment, react/jsx-fragments
    render: () => <Fragment />,
};
