import { type ArgTypes, type Meta, type StoryObj } from '@storybook/react';

import { type IButtonBaseProps, type TButtonProps } from '../types.js';

import Description from './Description.md';

import { ButtonStoryComponent } from './index.js';

const DEFAULT_ARGS: IButtonBaseProps = {
    children: 'Save',
    size: 'md',
    variant: 'primary',
};

const DEFAULT_ARG_TYPES: ArgTypes<Partial<IButtonBaseProps>> = {
    size: { control: { type: 'select' } },
    variant: { control: { type: 'select' } },
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

export const Secondary: StoryObj<TButtonProps> = {
    args: {
        variant: 'secondary',
    },
};

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
