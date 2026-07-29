import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Check } from '@/icons';

import { type IButtonBaseProps, type TButtonProps } from '../types';

import { docsCssVariables } from './cssVariables';
import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';
import ExampleEn from './Example.en.md';
import ExampleRu from './Example.ru.md';

import { ButtonStoryComponent } from '.';

const DEFAULT_ARGS: IButtonBaseProps = {
    children: 'Save',
    size: 'md',
    variant: 'primary',
    block: false,
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IButtonBaseProps>> = {
    size: { control: { type: 'select' } },
    variant: { control: { type: 'select' } },
    block: { control: { type: 'boolean' } },
};

export default {
    title: 'Base/Button',
    component: ButtonStoryComponent,
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
        ...DEFAULT_ARGS,
        disabled: false,
    },
    argTypes: DEFAULT_ARG_TYPES,
} satisfies Meta<typeof ButtonStoryComponent>;

export const Default: StoryObj<TButtonProps> = {};

export const Disabled: StoryObj<TButtonProps> = {
    args: {
        disabled: true,
    },
};

export const AsLink: StoryObj<TButtonProps<'a'>> = {
    args: {
        as: 'a',
        href: '#',
        children: 'Orders',
    },
};

export const Block: StoryObj<TButtonProps> = {
    args: {
        block: true,
    },
};

export const Sizes: StoryObj<TButtonProps> = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ButtonStoryComponent size="sm">sm</ButtonStoryComponent>
            <ButtonStoryComponent size="md">md</ButtonStoryComponent>
            <ButtonStoryComponent size="lg">lg</ButtonStoryComponent>
        </div>
    ),
};

export const Variants: StoryObj<TButtonProps> = {
    render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
            <ButtonStoryComponent variant="primary">Primary</ButtonStoryComponent>
            <ButtonStoryComponent variant="secondary">Secondary</ButtonStoryComponent>
            <ButtonStoryComponent variant="danger">Danger</ButtonStoryComponent>
        </div>
    ),
};

export const WithIcon: StoryObj<TButtonProps> = {
    args: {
        children: 'Save',
        icon: { Component: Check },
    },
};
