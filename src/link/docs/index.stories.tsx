import { type Meta, type StoryObj } from '@storybook/react';

import { type TLinkProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { LinkStoryComponent } from '.';

export default {
    title: 'Base/Link',
    component: LinkStoryComponent,
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
    args: {
        children: 'Orders',
        href: '/orders',
    },
} satisfies Meta<typeof LinkStoryComponent>;

export const Default: StoryObj<TLinkProps> = {};

export const WithHref: StoryObj<TLinkProps> = {
    args: {
        href: '/clients',
        children: 'Clients',
    },
};
