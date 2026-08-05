import { type Meta, type StoryObj } from '@storybook/react';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { ContextMenuDemo, ContextMenuStoryComponent } from '.';

export default {
    title: 'Overlays/ContextMenu',
    component: ContextMenuStoryComponent,
    parameters: {
        docsDescriptionByLocale: {
            ru: DescriptionRu,
            en: DescriptionEn,
        },
        docsExampleByLocale: {
            ru: ExampleRu,
            en: ExampleEn,
        },
        docsCssVariables,
        controls: {
            expanded: true,
        },
    },
} satisfies Meta<typeof ContextMenuStoryComponent>;

export const Default: StoryObj = {
    render: () => <ContextMenuDemo />,
};

export const WithSeparator: StoryObj = {
    render: () => <ContextMenuDemo withSeparator />,
};
