import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { Check } from '@/icons';

import { type IButtonBaseProps, type TButtonProps } from '../types';

import DescriptionEn from './Description.en.md';
import DescriptionRu from './Description.ru.md';

import { ButtonStoryComponent } from '.';

const DEFAULT_ARGS: IButtonBaseProps = {
    children: 'Сохранить',
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
    title: 'Button',
    component: ButtonStoryComponent,
    parameters: {
        docsDescriptionByLocale: {
            ru: DescriptionRu,
            en: DescriptionEn,
        },
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
        children: 'К заказам',
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
            <ButtonStoryComponent variant="primary">Основная</ButtonStoryComponent>
            <ButtonStoryComponent variant="secondary">Второстепенная</ButtonStoryComponent>
            <ButtonStoryComponent variant="danger">Опасная</ButtonStoryComponent>
        </div>
    ),
};

export const WithIcon: StoryObj<TButtonProps> = {
    args: {
        children: 'Сохранить',
        icon: { Component: Check },
    },
};
