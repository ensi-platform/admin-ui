import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { type ITreeItem, type ITreeProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { TreeStoryComponent } from '.';

const items: ITreeItem[] = [
    {
        id: 'clothing',
        label: 'Clothing',
        children: [
            { id: 'shirts', label: 'Shirts' },
            { id: 'pants', label: 'Pants' },
        ],
    },
    { id: 'accessories', label: 'Accessories' },
];

const DEFAULT_ARGS: ITreeProps = {
    'aria-label': 'Categories',
    items,
    selectionMode: 'single',
    disabled: false,
    readOnly: false,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<ITreeProps>> = {
    selectionMode: {
        control: { type: 'select' },
        options: ['none', 'single', 'multiple'],
    },
    disabled: { control: { type: 'boolean' } },
    readOnly: { control: { type: 'boolean' } },
    items: { control: false },
};

export default {
    title: 'Base/Tree',
    component: TreeStoryComponent,
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
    args: DEFAULT_ARGS,
    argTypes: DEFAULT_ARG_TYPES,
} satisfies Meta<typeof TreeStoryComponent>;

export const Default: StoryObj<ITreeProps> = {};

export const Multiple: StoryObj<ITreeProps> = {
    args: {
        selectionMode: 'multiple',
    },
};

export const None: StoryObj<ITreeProps> = {
    args: {
        selectionMode: 'none',
    },
};

export const Disabled: StoryObj<ITreeProps> = {
    args: {
        disabled: true,
    },
};

export const ReadOnly: StoryObj<ITreeProps> = {
    args: {
        readOnly: true,
        defaultSelectedKeys: new Set(['accessories']),
        defaultExpandedKeys: new Set(['clothing']),
    },
};
