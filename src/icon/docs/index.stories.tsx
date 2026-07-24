import { type Meta, type StoryObj } from '@storybook/react';

import { Clear } from '@/icons';

import { type IIconButtonProps } from '../types';

import Description from './Description.md';

import { IconStoryComponent } from '.';

const DEFAULT_ARGS: IIconButtonProps = {
    Component: Clear,
    size: 20,
};

export default {
    title: 'Icon',
    component: IconStoryComponent,
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
    args: DEFAULT_ARGS,
} satisfies Meta<typeof IconStoryComponent>;

export const Default: StoryObj<IIconButtonProps> = {};

export const CustomFill: StoryObj<IIconButtonProps> = {
    args: {
        fill: '#0077cc',
        size: 24,
    },
};
