import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { type IButtonBaseProps, type TButtonProps } from '../types';

import Description from './Description.md';

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
    title: 'Button',
    component: ButtonStoryComponent,
    parameters: {
        docs: {
            description: {
                component: Description,
            },
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
        children: 'Link button',
    },
};

export const Block: StoryObj<TButtonProps> = {
    args: {
        block: true,
    },
};
