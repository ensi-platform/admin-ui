import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Avatar } from '../Component';
import { type IAvatarProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

const DEFAULT_ARGS: IAvatarProps = {
    size: 'md',
    variant: 'primary',
    name: 'Alex Smith',
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IAvatarProps>> = {
    size: { control: { type: 'select' } },
    variant: { control: { type: 'select' } },
};

export default {
    title: 'Base/Avatar',
    component: Avatar,
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
} satisfies Meta<typeof Avatar>;

export const Default: StoryObj<typeof Avatar> = {};

export const Sizes: StoryObj<typeof Avatar> = {
    render: () => (
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Avatar name="Alex Smith" size="sm" />
            <Avatar name="Alex Smith" size="md" />
            <Avatar name="Alex Smith" size="lg" />
        </div>
    ),
};

export const Initials: StoryObj<typeof Avatar> = {
    args: {
        initials: 'AC',
        name: 'Alex',
    },
};
